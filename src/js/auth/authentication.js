document.querySelectorAll(".authenticator-container form").forEach((form) => {
  form.addEventListener("submit", (event) => event.preventDefault());
  let isShowingValidation = false;
  form.addEventListener("invalid", (event) => {
    event.preventDefault();
    if (isShowingValidation) {
      return;
    }
    isShowingValidation = true;
    window.TmisToast.show(event.target.validationMessage, "error");
    event.target.focus();
    window.setTimeout(() => {
      isShowingValidation = false;
    }, 0);
  }, true);
});

document.querySelectorAll("[data-password-target]").forEach((toggle) => {
  toggle.addEventListener("click", () => {
    const password = document.getElementById(toggle.dataset.passwordTarget);
    if (!password) {
      return;
    }
    const isVisible = password.type === "password";
    password.type = isVisible ? "text" : "password";
    const label = toggle.getAttribute("aria-label").replace(/^(Show|Hide)/, "");
    toggle.setAttribute("aria-label", (isVisible ? "Hide" : "Show") + label);
    toggle.setAttribute("aria-pressed", String(isVisible));
    toggle.textContent = isVisible ? "Hide" : "Show";
  });
});

const signInForm = document.querySelector("form[data-verification-url]");
if (signInForm) {
  signInForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!signInForm.reportValidity()) {
      return;
    }
    const email = document.getElementById("email-input").value.trim();
    const verificationPage = new URL(signInForm.dataset.verificationUrl, window.location.href);
    const separator = email.lastIndexOf("@");
    const maskedEmail = email.slice(0, 1) + "***" + email.slice(separator);
    verificationPage.hash = new URLSearchParams({ email: maskedEmail, step: "signin" }).toString();
    document.getElementById("password_input").value = "";
    window.location.assign(verificationPage.href);
  });
}

const registerForm = document.getElementById("registration-form");
if (registerForm) {
  const password = document.getElementById("register-password-input");
  const confirmation = document.getElementById("confirm_password");
  const checks = {
    length: () => password.value.length >= 8,
    uppercase: () => /[A-Z]/.test(password.value),
    lowercase: () => /[a-z]/.test(password.value),
    number: () => /[0-9]/.test(password.value),
    special: () => /[@$!%*?&#]/.test(password.value),
    match: () => Boolean(password.value) && password.value === confirmation.value,
  };
  const update = () => {
    for (const [name, check] of Object.entries(checks)) {
      registerForm.querySelector(`[data-password-requirement="${name}"]`).classList.toggle("is-valid", check());
    }
    confirmation.setCustomValidity(confirmation.value && !checks.match() ? "Passwords must match." : "");
  };
  password.addEventListener("input", update);
  confirmation.addEventListener("input", update);
  registerForm.addEventListener("submit", (event) => {
    event.preventDefault();
    update();
    if (!registerForm.reportValidity()) return;
    registerForm.reset();
    update();
    window.TmisToast.show("Demo registration complete. No account was created. Return to sign in to try the demo.", "success");
  });
  update();
}

const recoveryForm = document.getElementById("forgot-password-form");
if (recoveryForm) {
  recoveryForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!recoveryForm.reportValidity()) {
      return;
    }
    document.getElementById("recovery-email").textContent =
      document.getElementById("forgot-email-input").value.trim();
    document.getElementById("recovery-request").hidden = true;
    document.getElementById("recovery-sent").hidden = false;
    document.getElementById("recovery-sent-title").focus();
    window.TmisToast.show("Continue to set your new password.", "success");
  });

  document.getElementById("change-recovery-email").addEventListener("click", () => {
    document.getElementById("recovery-sent").hidden = true;
    document.getElementById("recovery-request").hidden = false;
    document.getElementById("forgot-email-input").focus();
  });
}

const resetForm = document.getElementById("reset-password-form");
if (resetForm) {
  const password = document.getElementById("new-password");
  const confirmation = document.getElementById("confirm-password");
  const error = document.getElementById("reset-error");
  const checks = {
    length: (value) => value.length >= 8,
    case: (value) => /[A-Z]/.test(value) && /[a-z]/.test(value),
    number: (value) => /[0-9]/.test(value),
    special: (value) => /[^A-Za-z0-9\s]/.test(value),
  };

  const updateRequirements = () => {
    Object.entries(checks).forEach(([name, check]) => {
      const requirement = document.querySelector('[data-reset-rule="' + name + '"]');
      requirement.classList.toggle("is-valid", check(password.value));
    });
    error.hidden = true;
    password.removeAttribute("aria-invalid");
    confirmation.removeAttribute("aria-invalid");
  };

  password.addEventListener("input", updateRequirements);
  confirmation.addEventListener("input", updateRequirements);
  resetForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!resetForm.reportValidity()) {
      return;
    }
    const meetsRequirements = Object.values(checks).every((check) => check(password.value));
    const matches = password.value === confirmation.value;
    if (!meetsRequirements || !matches) {
      error.textContent = !meetsRequirements
        ? "Your new password must meet all the requirements above."
        : "Your passwords don't match. Re-enter the same password.";
      error.hidden = false;
      window.TmisToast.show(error.textContent, "error");
      const field = !meetsRequirements ? password : confirmation;
      field.setAttribute("aria-invalid", "true");
      field.focus();
      return;
    }
    resetForm.reset();
    document.getElementById("reset-request").hidden = true;
    document.getElementById("reset-success").hidden = false;
    document.getElementById("reset-success-title").focus();
    window.TmisToast.show("Password entries accepted.", "success");
  });
}


