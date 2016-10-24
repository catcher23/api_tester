import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import { Link } from 'react-router';
import {
  FormGroup, FormControl, HelpBlock
} from 'react-bootstrap'

class PostsForm extends Component {
  static contextTypes = {
    router: PropTypes.object
  };

  constructor(refs) {
    super(refs);
    this.handleChange = this.handleChange.bind(this);
  }

  componentWillMount() {
    //Important! If your component is navigating based on some global state(from say componentWillReceiveProps)
    //always reset that global state back to null when you REMOUNT
    this.props.resetMe();
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.newPost.post && !nextProps.newPost.error) {
      this.context.router.push('/');
    }
  }

  renderError(newPost) {
    if(newPost && newPost.error && newPost.error.message) {
      return (
        <div className="alert alert-danger">
          {newPost ? newPost.error.message : ''}
        </div>
      );
    } else {
      return <span></span>
    }
  }

  handleChange(e) {
    e.preventDefault();

    const file = findDOMNode(this.refs.file).files[0];
    if(!file) return;
    this.props.uploadImage(file);
  }

  render() {
    const {asyncValidating, fields: { email, name, age }, handleSubmit, submitting, newPost, file } = this.props;

    return (
      <div className="container">
      {this.renderError(newPost)}
      <form onSubmit={handleSubmit(this.props.createPost.bind(this))}>
        <div className={`form-group ${email.touched && email.invalid ? 'has-error' : ''}`}>
          <label className="control-label">Email</label>
          <input type="text" className="form-control" {...email} />
          <div className="help-block">
            {email.touched ? email.error : ''}
          </div>
          <div className="help-block">
            {asyncValidating === 'email'? 'validating..': ''}
          </div>
        </div>

        <div className={`form-group ${name.touched && name.invalid ? 'has-error' : ''}`}>
          <label className="control-label">Full Name</label>
          <input type="text" className="form-control" {...name} />
          <div className="help-block">
            {name.touched ? name.error : ''}
          </div>
        </div>

        <div className={`form-group ${age.touched && age.invalid ? 'has-error' : ''}`}>
          <label className="control-label">Age</label>
          <textarea className="form-control" {...age} />
          <div className="help-block">
            {age.touched ? age.error : ''}
          </div>
        </div>

        <button type="submit" className="btn btn-primary"  disabled={submitting} >Submit</button>
        <Link to="/" className="btn btn-error">Cancel</Link>
      </form>
      </div>
    );
  }
}

export default PostsForm;
