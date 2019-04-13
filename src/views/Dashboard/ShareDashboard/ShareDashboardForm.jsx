import React, { Component } from "react";
import { Formik, Form } from "formik";
import Input from "../../../components/FormikInputs";

const initialValues = { user: "" };

class ShareDashboardForm extends Component {
  submit = (values, { resetForm, setSubmitting }) => {
    setTimeout(() => {
      setSubmitting(false);
      resetForm(initialValues);
    }, 0);
  };

  validate = values => {
    let errors = {};
    if (!values.user) {
      errors.user = "مشخصات کاربر را وارد کنید";
    }
    return errors;
  };

  renderForm = formikProps => {
    return (
      <Form autoComplete="off">
        <Input
          name="user"
          label="نام کاربری، ایمیل یا شماره همراه"
          {...formikProps}
        />
      </Form>
    );
  };

  render = () => {
    return (
      <Formik
        initialValues={initialValues}
        enableReinitialize
        validate={this.validate}
        onSubmit={this.submit}
        render={this.renderForm}
      />
    );
  };
}

export default ShareDashboardForm;
