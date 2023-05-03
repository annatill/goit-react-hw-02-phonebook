import React, { Component } from 'react';
import propTypes from 'prop-types';
import { nanoid } from 'nanoid';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import './ContactForm.css';
import { ContainerInput, Label, Button } from './ContactForm.styled.jsx';
import * as Yup from 'yup';

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

const validationSchema = Yup.object({
  name: Yup.string().required('Required'),
  number: Yup.string()
    .required('Required')
    .matches(phoneRegExp, 'Phone number is not valid')
    .min(8, 'too short')
    .max(12, 'too long'),
});

const initialValues = {
  name: '',
  number: '',
};

const FormError = ({ message }) => {
  return <p>{message}</p>;
};

export class ContactForm extends Component {
  constructor(props) {
    super(props);
    this.submitButton = React.createRef();
  }

  state = {
    isError: false,
  };

  handleSubmit = (values, { resetForm }) => {
    const { name, number } = values;
    const isContactExist = this.props.isContactExist(name);
    if (isContactExist) {
      this.setState({ isError: true });
      setTimeout(() => {
        this.setState({ isError: false });
      }, 2000);
      return;
    }

    this.props.onSubmit(name, number);
    this.submitButton.current.focus();
    resetForm();
  };

  nameInputId = nanoid();
  telInputId = nanoid();

  render() {
    return (
      <Formik
        validationSchema={validationSchema}
        onSubmit={this.handleSubmit}
        initialValues={initialValues}
      >
        <Form className="form">
          <ContainerInput>
            <Label htmlFor={this.nameInputId}>
              Name
              <Field
                className="input"
                type="text"
                name="name"
                id={this.nameInputId}
                placeholder="Enter name"
              />
            </Label>
            <div className="message">
              <ErrorMessage name="name" />
              {this.state.isError && (
                <FormError name="name" message={'Already exists!'} />
              )}
            </div>
          </ContainerInput>
          <ContainerInput>
            <Label htmlFor={this.telInputId}>
              Phone
              <Field
                className="input"
                type="tel"
                name="number"
                id={this.telInputId}
                placeholder="Enter phone number"
              />
            </Label>
            <div className="message">
              <ErrorMessage name="number" />
            </div>
          </ContainerInput>
          <Button type="submit" ref={this.submitButton}>
            Add contact
          </Button>
        </Form>
      </Formik>
    );
  }
}

ContactForm.propTypes = {
  onSubmit: propTypes.func.isRequired,
  isContactExist: propTypes.func.isRequired,
};
