import React, { useState } from "react";
import { AuthShell, Field } from "./App.jsx";

function ForgetPassword() {
  const [email, setEmail] = useState("");

  return (
    <AuthShell>
      <header className="authenticator-right-card-form card-title">
        <h2 className="authenticator-right-card-header">Reset Password</h2>
        <p className="authenticator-right-card-header2">
          Enter your verified email to receive a password reset link
        </p>
      </header>
      <div className="authenticator-right-card-form-box">
        <form
          action="#"
          id="forgot-password-form"
          className="row gx-3 gy-3"
          onSubmit={(event) => event.preventDefault()}
          autoComplete="on"
        >
          <Field
            id="forgot-email-input"
            name="email_address"
            label="Email address"
            placeholder="Enter your email address"
            icon="envelope-at-fill"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            columnClass="col-12"
          />
          <div className="col-12 mb-2">
            <input
              type="submit"
              value="Send Link"
              className="btn btn-outline-success form-control form-submit"
            />
          </div>
        </form>
      </div>
      <div className="authenticator-right-card-form-other">
        <p className="authenticator-right-card-form-login">
          Already have an account? <a href="/" className="login-text">Login</a>
        </p>
      </div>
    </AuthShell>
  );
}

export default ForgetPassword;
