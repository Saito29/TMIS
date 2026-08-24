import React, { useState } from "react";
import logo from "../assets/logo/DA SAAD LOGO FULL - WHITE TEXT.png";

function App() {
  const [showPassword, setShowPassword] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
  }

  return (
    <main className="container-fluid authenticator-container">
      <div className="row">
        <section className="col authenticator-left">
          <div className="authenticator-left-content-logo">
            <img src={logo} alt="DA-SAAD Logo" className="authenticator-left-logo" />
            <span className="authenticator-system-name">TMIS</span>
          </div>
          <div className="authenticator-left-content-tagline">
            <h1 className="authenticator-tagline">
              Building Competence Through Smarter Training Management.
            </h1>
          </div>
          <div className="authenticator-left-content-DA">
            <span className="authenticator-left-content-DA-name">
              Department of Agriculture 4A - SAAD
            </span>
          </div>
        </section>

        <section className="col authenticator-right card">
          <div className="card-body">
            <header className="authenticator-right-card-form card-title">
              <h2 className="authenticator-right-card-header">Welcome Back!</h2>
              <p className="authenticator-right-card-header2">
                Sign in to continue to your account
              </p>
            </header>

            <div className="authenticator-right-card-form-box">
              <form
                action="#"
                id="authenticator_form"
                className="row gx-2 gy-3"
                onSubmit={handleSubmit}
                autoComplete="on"
              >
                <div className="col-sm-6 col-md-12 col-lg-12 mb-2">
                  <label htmlFor="email-input" className="form-label text-form-label">
                    Email Address
                  </label>
                  <div className="input-group form-group">
                    <span className="input-group-text">
                      <i className="bi bi-envelope-at-fill" aria-hidden="true" />
                    </span>
                    <input
                      type="email"
                      name="email_address"
                      id="email-input"
                      className="form-control text-form"
                      placeholder="your@emailaddress"
                      required
                    />
                  </div>
                </div>

                <div className="col-sm-6 col-md-12 col-lg-12 mb-2">
                  <label htmlFor="password_input" className="form-label text-form-label">
                    Password
                  </label>
                  <div className="input-group form-group">
                    <span className="input-group-text">
                      <i className="bi bi-lock-fill" aria-hidden="true" />
                    </span>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password_auth"
                      id="password_input"
                      className="form-control text-form"
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      id="toggle-password"
                      onClick={() => setShowPassword((visible) => !visible)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      <i
                        className={`bi bi-eye${showPassword ? "-slash" : ""}-fill`}
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                </div>

                <div className="col-sm-12 col-md-12 col-lg-12 mb-2">
                  <input
                    type="submit"
                    value="Login"
                    className="btn btn-outline-success form-control form-submit"
                  />
                </div>
              </form>
            </div>

            <div className="authenticator-right-card-form-others">
              <a href="#" className="authenticator-right-card-form-forgetpassword">
                Forgot Password?
              </a>
              <p className="authenticator-right-card-form-sign-up">
                Don&apos;t have an account? <a href="" className="sign-up-text">Sign up</a>
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default App;
