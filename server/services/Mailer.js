const sendgrid = require('sendgrid');
const helper = sendgrid.mail;
const sendGridKey = require('../config/dev').sendGridKey;

class Mailer extends helper.Mail {
  constructor({ subject, recipients }, content) {
    super();

    // Get API object using the key to authenticate
    this.sgApi = sendgrid(sendGridKey);

    this.from_email = new helper.Email('no-reply@emaily.com');
    this.subject = subject;
    this.body = new helper.Content('text/html', content);
    this.recipients = this.formatAddresses(recipients);

    // Set email content using super class method
    this.addContent(this.body);
    this.addClickTracking();
    this.addRecipients();
  }

  // Convert list of email as String into list of Email objects
  formatAddresses(recipients) {
    return recipients.map(({ email }) => {
      return new helper.Email(email);
    });
  }

  // Setup click tracking
  addClickTracking() {
    const trackingSettings = new helper.TrackingSettings();
    const clickTracking = new helper.ClickTracking(true, true);

    trackingSettings.setClickTracking(clickTracking);
    this.addTrackingSettings(trackingSettings);
  }

  // Set recipients using super class method
  addRecipients() {
    const personalize = new helper.Personalization();

    this.recipients.forEach(recipient => {
      personalize.addTo(recipient);
    });
    this.addPersonalization(personalize);
  }

  // Send emails
  async send() {
    const request = this.sgApi.emptyRequest({
      method: 'POST',
      path: '/v3/mail/send',
      body: this.toJSON()
    });

    const response = await this.sgApi.API(request);
    return response;
  }
}

module.exports = Mailer;
