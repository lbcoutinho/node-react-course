const _ = require('lodash');
const Path = require('path-parser').default;
const { URL } = require('url');

const requireLogin = require('../middlewares/requireLogin');
const requireCredits = require('../middlewares/requireCredits');

const mongoose = require('mongoose');
const Survey = mongoose.model('surveys');

const Mailer = require('../services/Mailer');
const surveyTemplate = require('../services/emailTemplates/surveyTemplate');

module.exports = app => {
  app.get('/api/surveys', requireLogin, async (req, res) => {
    // Get all survey from user and select fields to return (In Mongo it's called "projection")
    const surveys = await Survey.find({ _user: req.user.id }).select({
      recipients: false
    });
    res.send(surveys);
  });

  app.get('/api/surveys/:surveyId/:choice', (req, res) => {
    res.send('Thanks for voting!');
  });

  // SendGrid may take a long time to send a response in development env
  app.post('/api/surveys/webhooks', (req, res) => {
    // Pattern to extract surveyId and choice from route
    const pathPattern = new Path('/api/surveys/:surveyId/:choice');

    _.chain(req.body)
      .map(({ email, url }) => {
        // Get route from URL = /api/surveys/123/yes
        const { pathname } = new URL(url);
        // .test returns an object containing surveyId and choice from route
        const match = pathPattern.test(pathname);
        // If pattern not found match will be undefined
        if (match) {
          return { email, ...match };
        }
      })
      // Remove undefined values from array
      .compact()
      // Remove duplicates by checking if objects have same email and surveyId
      .uniqBy('email', 'surveyId')
      .each(({ surveyId, email, choice }) => {
        Survey.updateOne(
          // Query object
          {
            // Find survey that matches  surveyId and exact recipient that matches email and responded = false
            _id: surveyId,
            recipients: {
              $elemMatch: {
                email: email,
                responded: false
              }
            }
          },
          // Update object
          {
            // Find yes/no property and increment 1
            $inc: { [choice]: 1 },
            // Set responded = true in the exact recipient found in the query, this is indicated by the $ sign below
            $set: {
              'recipients.$.responded': true
            },
            lastResponded: new Date()
          }
        ).exec(); // exec() trigger operation in mongo
      })
      .value();

    res.send({});
  });

  app.post('/api/surveys', requireLogin, requireCredits, async (req, res) => {
    const { title, subject, body, recipients } = req.body;

    const survey = new Survey({
      title,
      subject,
      body,
      recipients: recipients.split(',').map(email => ({ email: email.trim() })),
      _user: req.user.id,
      dateSent: Date.now()
    });

    const mailer = new Mailer(survey, surveyTemplate(survey));
    try {
      await mailer.send();
      await survey.save();

      req.user.credits -= 1;
      const user = await req.user.save();

      res.send(user);
    } catch (err) {
      res.status(422).send(err);
    }
  });
};
