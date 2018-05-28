import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import formFields from './formFields';
import { withRouter } from 'react-router-dom';
import * as actions from '../../actions';

const SurveyFormReview = ({ onCancel, formValues, submitSurvey, history }) => {
  const reviewFields = _.map(formFields, ({ name, label }) => {
    return (
      <div key={name}>
        <label>{label}</label>
        <div>{formValues[name]}</div>
      </div>
    );
  });

  return (
    <div>
      <h5>Please confirm your entries</h5>
      {reviewFields}
      <br />
      {/* On click Back calls callback function defined in SurveyNew.js */}
      <button className="yellow darken-3 white-text btn-flat" onClick={onCancel}>
        Back
      </button>

      {/* submitSurvey action is set as prop in the component by setting in the connect function at the bottom */}
      <button
        type="submit"
        className="green btn-flat right white-text"
        onClick={() => submitSurvey(formValues, history)}
      >
        Send Survey
        <i className="material-icons right">email</i>
      </button>
    </div>
  );
};

// Map state from redux to component props
function mapStateToProps(state) {
  return {
    formValues: state.form.surveyForm.values
  };
}

// withRouter enables react-router in the SurveyFormReview component.
// Property 'history' imported at the top comes from router
export default connect(mapStateToProps, actions)(withRouter(SurveyFormReview));
