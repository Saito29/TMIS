document.querySelectorAll(".authenticator-container form").forEach((form) => {
  form.addEventListener("submit", (event) => event.preventDefault());
});

document.querySelectorAll("[data-password-target]").forEach((toggle) => {
  toggle.addEventListener("click", () => {
    const password = document.getElementById(toggle.dataset.passwordTarget);
    if (!password) {
      console.error(
        `Password field "${toggle.dataset.passwordTarget}" was not found.`,
      );
      return;
    }

    const isVisible = password.type === "password";
    password.type = isVisible ? "text" : "password";
    const label = toggle.getAttribute("aria-label").replace(/^(Show|Hide)/, "");
    toggle.setAttribute("aria-label", `${isVisible ? "Hide" : "Show"}${label}`);
    toggle.innerHTML = `<i class="bi bi-eye${isVisible ? "-slash" : ""}-fill" aria-hidden="true"></i>`;
  });
});

const password = document.getElementById("register-password-input");
const confirmPassword = document.getElementById("confirm_password");

if (password && confirmPassword) {
  const checks = {
    length: (value) => value.length >= 8,
    uppercase: (value) => /[A-Z]/.test(value),
    lowercase: (value) => /[a-z]/.test(value),
    number: (value) => /\d/.test(value),
    special: (value) => /[@$!%*?&#]/.test(value),
    match: (value) => confirmPassword.value.length > 0 && value === confirmPassword.value,
  };

  const updateRequirements = () => {
    Object.entries(checks).forEach(([name, check]) => {
      const requirement = document.querySelector(
        `[data-password-requirement="${name}"]`,
      );
      if (!requirement) return;
      const valid = check(password.value);
      requirement.classList.toggle("is-valid", valid);
      const icon = requirement.querySelector("i");
      if (icon) {
        icon.className = `bi bi-${valid ? "check-circle-fill" : "circle"}`;
      }
    });
  };

  password.addEventListener("input", updateRequirements);
  confirmPassword.addEventListener("input", updateRequirements);
}
