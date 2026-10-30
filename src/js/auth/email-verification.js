(() => {
  const form = document.getElementById("email-verification-form");
  const codeInput = document.getElementById("verification-code");
  const error = document.getElementById("code-error");
  const status = document.getElementById("verification-status");
  const resendButton = document.getElementById("resend-code");
  const countdown = document.getElementById("resend-countdown");
  const validityCountdown = document.getElementById("code-validity-countdown");
  const verifyButton = document.getElementById("verify-code-button");
  const email = new URLSearchParams(window.location.hash.slice(1)).get("email");

  if (email) {
    document.getElementById("verification-email").textContent = email;
  }

  let resendAvailableAt = Date.now() + 30000;
  let codeExpiresAt = Date.now() + 10 * 60 * 1000;
  let isVerified = false;
  let hasNotifiedExpiry = false;

  const updateCountdown = () => {
    if (isVerified) {
      return;
    }
    const validityRemaining = Math.max(0, Math.ceil((codeExpiresAt - Date.now()) / 1000));
    const minutes = String(Math.floor(validityRemaining / 60)).padStart(2, "0");
    const seconds = String(validityRemaining % 60).padStart(2, "0");
    validityCountdown.textContent = minutes + ":" + seconds;
    const isExpired = validityRemaining === 0;
    document.getElementById("code-validity").classList.toggle("is-expired", isExpired);
    verifyButton.disabled = isExpired;
    codeInput.disabled = isExpired;
    if (isExpired) {
      status.textContent = "Your code has expired. Resend a code to try again.";
      if (!hasNotifiedExpiry) {
        window.TmisToast.show(status.textContent, "warning");
        hasNotifiedExpiry = true;
      }
    }
    const remaining = Math.max(0, Math.ceil((resendAvailableAt - Date.now()) / 1000));
    resendButton.disabled = remaining > 0;
    countdown.textContent = remaining > 0
      ? 'Available in 00:' + String(remaining).padStart(2, "0")
      : "You can request another code.";
  };

  const clearError = () => {
    error.hidden = true;
    codeInput.removeAttribute("aria-invalid");
  };

  codeInput.addEventListener("input", () => {
    codeInput.value = codeInput.value.replace(/[^0-9]/g, "").slice(0, 6);
    clearError();
  });

  codeInput.addEventListener("paste", (event) => {
    const pastedCode = event.clipboardData.getData("text").replace(/[^0-9]/g, "");
    if (pastedCode) {
      event.preventDefault();
      codeInput.value = pastedCode.slice(0, 6);
      clearError();
    }
  });

  codeInput.addEventListener("invalid", () => {
    codeInput.setAttribute("aria-invalid", "true");
    error.textContent = "Enter the complete 6-digit code.";
    error.hidden = false;
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (isVerified) {
      return;
    }
    if (Date.now() >= codeExpiresAt) {
      updateCountdown();
      return;
    }
    if (codeInput.value !== "123456") {
      error.textContent = "That code doesn't match. Check the six digits and try again.";
      window.TmisToast.show(error.textContent, "error");
      error.hidden = false;
      codeInput.setAttribute("aria-invalid", "true");
      codeInput.focus();
      codeInput.select();
      return;
    }

    clearError();
    isVerified = true;
    status.textContent = "Code entry complete.";
    status.focus();
    window.TmisToast.show("Code entry complete.", "success");
    verifyButton.textContent = "Verification complete ✓";
    verifyButton.disabled = true;
    codeInput.readOnly = true;
    resendButton.disabled = true;
    countdown.textContent = "";
    validityCountdown.textContent = "Verified";
    window.clearInterval(countdownInterval);
    window.location.replace(new URL("../admin/dashboard/dashboard.html", window.location.href).href);
  });

  resendButton.addEventListener("click", () => {
    if (isVerified || Date.now() < resendAvailableAt) {
      return;
    }
    resendAvailableAt = Date.now() + 30000;
    codeExpiresAt = Date.now() + 10 * 60 * 1000;
    hasNotifiedExpiry = false;
    updateCountdown();
    codeInput.value = "";
    clearError();
    status.textContent = "Enter your six-digit code to continue.";
    window.TmisToast.show(status.textContent, "success");
    codeInput.focus();
  });

  updateCountdown();
  if (new URLSearchParams(window.location.hash.slice(1)).get("step") === "signin") {
    window.TmisToast.show("Enter your six-digit email verification code.", "success");
  }

  let countdownInterval = window.setInterval(updateCountdown, 1000);
  window.addEventListener("pagehide", () => window.clearInterval(countdownInterval));
  window.addEventListener("pageshow", () => {
    updateCountdown();
    window.clearInterval(countdownInterval);
    if (!isVerified) {
      countdownInterval = window.setInterval(updateCountdown, 1000);
    }
  });
})();




