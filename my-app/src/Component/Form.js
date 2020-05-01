import React, {useState, useEffect} from 'react';
import { withFormik, Form, Field } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

function UserForm({ values, errors, touched, status }) {

  const [users, setUsers] = useState([]);

  useEffect( () => {
    status && setUsers( users => [...users, status])
  }, [status])
  
  return (  
    <div >
      <Form className='user-form'>

        <Field 
        className='input' 
        type='text' 
        name='username' 
        placeholder='Wiseguy Name'/>
            {touched.username && errors.username && (<p>What should we call you again?</p>)}
        <Field 
        className='input' 
        type='email' 
        name='email' 
        placeholder='Email'/>
            {touched.email && errors.email && (<p>really...?</p>) || values.email === 'juicey@juice.com' && (<p>really...?</p>)}
        <Field 
        className='input' 
        type='password'
        name='password' 
        placeholder='Password'/>
            {touched.password && errors.password && (<p>A password you must have, yessssss</p>)}
        <label>
          <p><Field 
          className='check-box'
           type='checkbox' 
           name='terms' 
           checked={values.terms}/>Please Review and Agree to the <a href="https://randomstores.com/en/user-agreement" target="_blank">randomness.</a> You can't handle being normal!</p>
            {touched.terms && errors.terms && (<p>You MUST Review and Agree to the Terms of Service</p>)}
        </label>
        <button>Submit</button>

        {users.map( user => (
          <ul>
            <li>username: {user.username}</li>
            <li>email: {user.email}</li>
            <li>password: {user.password}</li>
          </ul>
        ))}
      </Form>
    </div>
  );
}

const FormikUserForm = withFormik( {
  mapPropsToValues({ username, email, password, terms }) {
    return {
      username: username || '',
      email: email || '',
      password: password || '',
      terms: terms || false,
    }
  },
  validationSchema: Yup.object().shape({
    username: Yup.string().required(),
    email: Yup.string().required(),
    password: Yup.string().required(),
    terms: Yup.boolean([true]).required(),
  }),
  handleSubmit(values, { setStatus, resetForm} ) {
    axios
      .post('https://reqres.in/api/users', values)
      .then( response => {
        setStatus(response.data)
        console.log(response);
      })
      .catch(err => console.log(err.response))
      .finally(resetForm())
  }
})(UserForm);

export default FormikUserForm;