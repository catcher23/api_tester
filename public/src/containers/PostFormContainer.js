import PostsForm from '../components/PostsForm.js';
import {
  createPost, createPostSuccess, createPostFailure, resetNewPost, validatePostFields, validatePostFieldsSuccess,
  validatePostFieldsFailure
}
from '../actions/postsActions';
import { reduxForm } from 'redux-form';

//Client side validation
function validate(values) {
  const errors = {};

  if (!values.email || values.email.trim() === '') {
    errors.email = 'Enter an Email';
  }
  if (!values.name || values.name.trim() === '') {
    errors.name = 'Enter a name';
  }
  if (!values.age || values.age.trim() === '') {
    errors.age = 'Enter an age';
  }

  return errors;
}

//For instant async server validation
const asyncValidate = (values, dispatch) => {

  return new Promise((resolve, reject) => {

    dispatch(validatePostFields(values))
      .then((response) => {
        let data = response.payload.data;
        //if status is not 200 or any one of the fields exist, then there is a field error
        if (response.payload.status != 200 || data.email || data.name || data.description) {
          //let other components know of error by updating the redux` state
          dispatch(validatePostFieldsFailure(response.payload));
          reject(data); //this is for redux-form itself
        } else {
          //let other components know that everything is fine by updating the redux` state
          dispatch(validatePostFieldsSuccess(response.payload)); //ps: this is same as dispatching RESET_POST_FIELDS
          resolve(); //this is for redux-form itself
        }
      });
  });
};

//For any field errors upon submission (i.e. not instant check)
const validateAndCreatePost = (values, dispatch) => {

  return new Promise((resolve, reject) => {
    dispatch(createPost(values, token))
      .then((response) => {
        let data = response.payload.data;
        //if any one of these exist, then there is a field error
        if (response.payload.status != 200) {
          //let other components know of error by updating the redux` state
          dispatch(createPostFailure(response.payload));
          reject(data); //this is for redux-form itself
        } else {
          //let other components know that everything is fine by updating the redux` state
          dispatch(createPostSuccess(response.payload));
          resolve(); //this is for redux-form itself
        }
      });
  });
};


const mapDispatchToProps = (dispatch) => {
  return {
    createPost: validateAndCreatePost,
    resetMe: () => {
      dispatch(resetNewPost());
    }
    }
  };


function mapStateToProps(state, ownProps) {
  return {
    newPost: state.posts.newPost,
    user: state.user.user || 'anonymous user'
  };
}


// connect: first argument is mapStateToProps, 2nd is mapDispatchToProps
// reduxForm: 1st is form config, 2nd is mapStateToProps, 3rd is mapDispatchToProps
export default reduxForm({
  form: 'PostsNewForm',
  fields: ['email', 'name', 'age'],
  asyncValidate,
  asyncBlurFields: ['email'],
  validate
}, mapStateToProps, mapDispatchToProps)(PostsForm);
