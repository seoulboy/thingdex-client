import React from 'react';
import './LoginModal.scss';
import { Icon } from 'antd';
import { domain } from '../../constants';

const LoginModal = ({
  showModal,
  handleClose,
  showRegisterForm,
  toggleRegisterForm,
}) => {
  const handleGoogleSignInClick = () => {
    // Authenticate using via passport api in the backend
    // Open Google login page
    // Upon successful login, a cookie session will be stored in the client

    window.open(`${domain}/auth/google`, '_self');
  };

  const handleFacebookSignInClick = () => {
    window.open(`${domain}/auth/facebook`, '_self');
  };

  const handleGithubSignInClick = () => {
    window.open(`${domain}/auth/github`, '_self');
  };

  const handleTwitterSignInClick = () => {
    window.open(`${domain}/auth/twitter`, '_self');
  };

  if (showModal) {
    return (
      <div className='modal'>
        <section className='modal-main'>
          <Icon
            type='close-circle'
            className='toggle-modal'
            onClick={handleClose}
          />

          {!showRegisterForm && (
            <>
              <p>
                <Icon type='rocket' className='modal-header-icon' />
              </p>
              <p className='modal-text'>
                Choose a social network service to sign in
              </p>
              <div className='social-login-container'>
                <>
                  <p onClick={handleGoogleSignInClick}>
                    <Icon type='google-plus' className='social-auth-icon google-login' />
                  </p>
                  <p onClick={handleFacebookSignInClick}>
                    <Icon type='facebook' className='social-auth-icon facebook-login' />
                  </p>
                  <p onClick={handleGithubSignInClick}>
                    <Icon type='github' className='social-auth-icon github-login' />
                  </p>
                  <p onClick={handleTwitterSignInClick}>
                    <Icon type='twitter' className='social-auth-icon twitter-login' />
                  </p>
                </>
              </div>
              <p className='middle-text-modal'>
                Or
                <br />
                Sign In with local ID
              </p>
              <form action={`${domain}/auth/local/login`} method='POST'>
                <label>
                  Email:
                  <br />
                  <input
                    type='email'
                    name='email'
                    placeholder='enter email'
                    required
                  />
                </label>
                <br />
                <label>
                  Password:
                  <br />
                  <input
                    type='password'
                    name='password'
                    placeholder='enter password'
                    min='6'
                    max='18'
                    required
                  />
                </label>
                <br />
                <br />
                <div className='login-container'>
                  <button type='submit' className='submit-button'>
                    Login <Icon type='smile' />
                  </button>
                </div>
              </form>
              <br />
              <p>
                Don't have an account?
                <span
                  className='show-register-form'
                  onClick={toggleRegisterForm}
                >
                  {' '}
                  Create Account
                </span>
              </p>
            </>
          )}
          {showRegisterForm && (
            <>
              <p>
                <Icon type='form' className='modal-header-icon' />
              </p>
              <p className='modal-text'>
                Please fill in the forms below to sign up
              </p>
              <form action={`${domain}/auth/local/register`} method='POST'>
                <label>
                  Name:
                  <br />
                  <input type='text' name='name' placeholder='name' required />
                </label>
                <br />
                <label>
                  Email:
                  <br />
                  <input
                    type='email'
                    name='email'
                    placeholder='email'
                    required
                  />
                </label>
                <br />
                <label>
                  Password:
                  <br />
                  <input
                    type='text'
                    name='password'
                    placeholder='password'
                    min='6'
                    max='18'
                    required
                  />
                </label>
                <br />
                <label>
                  Confirm Password:
                  <br />
                  <input
                    type='text'
                    name='passwordConfirm'
                    placeholder='confirm password'
                    min='6'
                    max='18'
                    required
                  />
                </label>
                <br />
                <br />
                <div>
                  <button type='submit' className='submit-button'>
                    Sign Up <Icon type='smile' />
                  </button>
                </div>
              </form>

              <br />
              <p>
                Have an account?
                <span
                  className='show-sign-in-form'
                  onClick={toggleRegisterForm}
                >
                  {' '}
                  Sign In
                </span>
              </p>
            </>
          )}
        </section>
      </div>
    );
  } else {
    return null;
  }
};

export default LoginModal;
