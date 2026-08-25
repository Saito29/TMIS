import React, { useState } from "react";
import logo from "../../assets/logo/DA SAAD LOGO FULL - WHITE TEXT.png";

function BrandPanel() {
  return (
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
  );
}

function Field({ id, name, label, placeholder, icon, type = "text", value, onChange, columnClass = "col-sm-6 col-md-12 col-lg-12" }) {
  return (
    <div className={`${columnClass} mb-2`}>
      <label htmlFor={id} className="form-label text-form-label">{label}</label>
      <div className="input-group form-group">
        <span className="input-group-text">
          <i className={`bi bi-${icon}`} aria-hidden="true" />
        </span>
        <input
          type={type}
          name={name}
          id={id}
          className="form-control text-form"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required
        />
      </div>
    </div>
  );
}

function PasswordField({ id, name, label, placeholder, value, onChange, showPassword, onToggle, columnClass = "col-sm-6 col-md-12 col-lg-12", minLength, maxLength, pattern }) {
  return (
    <div className={`${columnClass} mb-2`}>
      <label htmlFor={id} className="form-label text-form-label">{label}</label>
      <div className="input-group form-group">
        <span className="input-group-text">
          <i className="bi bi-lock-fill" aria-hidden="true" />
        </span>
        <input
          type={showPassword ? "text" : "password"}
          name={name}
          id={id}
          className="form-control text-form"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          minLength={minLength}
          maxLength={maxLength}
          pattern={pattern}
          required
        />
        <button
          type="button"
          className="password-toggle"
          id={`toggle-${id}`}
          onClick={onToggle}
          aria-label={showPassword ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
        >
          <i className={`bi bi-eye${showPassword ? "-slash" : ""}-fill`} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

export function PasswordRequirements({ password, confirmPassword }) {
  const requirements = [
    { label: "At least 8 characters", valid: password.length >= 8 },
    { label: "At least 1 uppercase letter", valid: /[A-Z]/.test(password) },
    { label: "At least 1 lowercase letter", valid: /[a-z]/.test(password) },
    { label: "At least 1 number", valid: /\d/.test(password) },
    { label: "At least 1 special character (@$!%*?&#)", valid: /[@$!%*?&#]/.test(password) },
    { label: "Passwords match", valid: confirmPassword.length > 0 && password === confirmPassword },
  ];

  return (
    <ul className="password-requirements" aria-label="Password requirements">
      {requirements.map((requirement) => (
        <li key={requirement.label} className={requirement.valid ? "is-valid" : ""}>
          <i className={`bi bi-${requirement.valid ? "check-circle-fill" : "circle"}`} aria-hidden="true" />
          <span>{requirement.label}</span>
        </li>
      ))}
    </ul>
  );
}

function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <AuthShell>
      <header className="authenticator-right-card-form card-title">
        <h2 className="authenticator-right-card-header">Welcome Back!</h2>
        <p className="authenticator-right-card-header2">Sign in to continue to your account</p>
      </header>
      <div className="authenticator-right-card-form-box">
        <form action="#" id="authenticator_form" className="row gx-2 gy-3" onSubmit={(event) => event.preventDefault()} autoComplete="on">
          <Field id="email-input" name="email_address" label="Email Address" placeholder="your@emailaddress" icon="envelope-at-fill" type="email" />
          <PasswordField id="password_input" name="password_auth" label="Password" placeholder="Enter your password" showPassword={showPassword} onToggle={() => setShowPassword((visible) => !visible)} />
          <div className="col-sm-12 col-md-12 col-lg-12 mb-2">
            <input type="submit" value="Login" className="btn btn-outline-success form-control form-submit" />
          </div>
        </form>
      </div>
      <div className="authenticator-right-card-form-others">
        <a href="/forget-password" className="authenticator-right-card-form-forgetpassword">Forgot Password?</a>
        <p className="authenticator-right-card-form-sign-up">
          Don&apos;t have an account? <a href="/register" className="sign-up-text">Sign up</a>
        </p>
      </div>
    </AuthShell>
  );
}

export function AuthShell({ children }) {
  return (
    <main className="container-fluid authenticator-container">
      <div className="row">
        <BrandPanel />
        <section className="col authenticator-right card">
          <div className="card-body">{children}</div>
        </section>
      </div>
    </main>
  );
}

export { Field, PasswordField };

export default LoginPage;
