import React, { Component, PropTypes } from 'react';
import { reduxForm, Field } from 'redux-form';

import FieldComponent from 'components/FieldComponent';


class SignupForm extends Component {
  render() {
    const { error, handleSubmit, onSubmit, submitting } = this.props;

    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <Field
          name="name"
          label="Name"
          placeholder="Radu"
          component={FieldComponent}
          type="text" />

        <Field
          name="email"
          label="Email"
          placeholder="radu@example.com"
          component={FieldComponent}
          type="text" />

        <Field
          name="password"
          label="Password"
          placeholder="*****"
          component={FieldComponent}
          type="password" />

        <Field
          name="confirmPassword"
          label="Password confirmation"
          placeholder="*****"
          component={FieldComponent}
          type="password" />

        <div className="field-container">
          <button type="submit" disabled={submitting}>Sign up</button>
        </div>

        <div className="field-container">
          {error && <span className="error">{error}</span>}
        </div>
      </form>
    );
  }
}

SignupForm.PropTypes = {
  onSubmit: PropTypes.func.isRequired
};

const validate = (values) => {
  const errors = {};

  if (!values.name) {
    errors.name = 'Name cannot be blank';
  }

  const emailRe = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!values.email) {
    errors.email = 'Email cannot be blank';
  } else if (!emailRe.test(values.email)) {
    errors.email = 'Email is invalid';
  }

  if (!values.password) {
    errors.password = 'Password cannot be blank';
  } else if (values.password.length < 4) {
    errors.password = 'Password cannot be shorter than 4 characters.'
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = 'Password confirmation cannot be blank';
  } else if (values.password !== values.confirmPassword) {
    errors.confirmPassword = 'Password confirmation does not match password';
  }

  return errors;
};

export default reduxForm({
  form: 'signup',
  validate
})(SignupForm);
