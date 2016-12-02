import { reduxForm } from 'redux-form';

export default function createForm(name, component, options) {
  return reduxForm({ form: name, ...options })(component);
}
