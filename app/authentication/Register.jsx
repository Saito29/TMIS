import React, { useState } from "react";
import { AuthShell, Field, PasswordField, PasswordRequirements } from "./App.jsx";

const fields = [
  { id: "first_name", name: "first_name", label: "First Name", placeholder: "Enter your first name", icon: "person-fill" },
  { id: "middle_name", name: "middle_name", label: "Middle Name", placeholder: "Enter your middle name", icon: "person-fill" },
  { id: "last_name", name: "last_name", label: "Last Name", placeholder: "Enter your last name", icon: "person-fill" },
];

function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({});

  function updateField(event) {
    setFormData((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  function togglePassword() {
    setShowPassword((visible) => !visible);
  }

  return (
    <AuthShell>
      <header className="authenticator-right-card-form card-title">
        <h2 className="authenticator-right-card-header">Register</h2>
        <p className="authenticator-right-card-header2">Create an account</p>
      </header>
      <div className="authenticator-right-card-form-box">
        <form action="#" id="authenticator_form" className="row gx-3 gy-3" onSubmit={(event) => event.preventDefault()} autoComplete="on">
          {fields.map((field) => <Field key={field.id} {...field} columnClass="col-sm-6 col-md-6 col-lg-6" value={formData[field.name] || ""} onChange={updateField} />)}
          <Field id="register-email-input" name="email_address" label="Email Address" placeholder="your@emailaddress" icon="envelope-at-fill" type="email" columnClass="col-sm-6 col-md-6 col-lg-6" value={formData.email_address || ""} onChange={updateField} />
          <PasswordField id="register-password-input" name="password_auth" label="Password" placeholder="Enter your password" columnClass="col-sm-6 col-md-6 col-lg-6" value={formData.password_auth || ""} onChange={updateField} showPassword={showPassword} onToggle={togglePassword} minLength={8} pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}" />
          <PasswordField id="confirm_password" name="confirm_password" label="Confirm Password" placeholder="Confirm your password" columnClass="col-sm-6 col-md-6 col-lg-6" value={formData.confirm_password || ""} onChange={updateField} showPassword={showPassword} onToggle={togglePassword} />
          <div className="col-12 password-requirements-column">
            <PasswordRequirements password={formData.password_auth || ""} confirmPassword={formData.confirm_password || ""} />
          </div>
          <div className="col-sm-12 col-md-12 col-lg-12 mb-2">
            <input type="submit" value="Register" className="btn btn-outline-success form-control form-submit" />
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

export default Register;
