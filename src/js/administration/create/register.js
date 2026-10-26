// Developer: Registration currently writes to localStorage key `tmis-users`.
// Replace the submit read/duplicate-email check/write below with create-user API calls;
// keep `fields`, review labels, and server validation aligned with the form controls.
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('userRegisterForm');
  if (!form) return;
  // Remove notices created by the previous form version during a live reload.
  document.querySelectorAll('#userFormMessage, .user-form-message, .user-field-error').forEach((notice) => notice.remove());
  const steps = [...form.querySelectorAll('.user-step')];
  const indicators = [...document.querySelectorAll('#userWizardSteps [data-step]')];
  const back = document.getElementById('userBack');
  const next = document.getElementById('userNext');
  const submit = document.getElementById('userSubmit');
  const again = document.getElementById('userAgain');
  const toastElement = document.getElementById('userRegisterToast');
  const toast = toastElement && window.bootstrap?.Toast
    ? window.bootstrap.Toast.getOrCreateInstance(toastElement, { delay: 5500 })
    : null;
  const toastDetails = {
    success: { title: 'Registration saved', icon: 'bi-check-circle-fill' },
    warning: { title: 'Check registration', icon: 'bi-exclamation-triangle-fill' },
    error: { title: 'Registration error', icon: 'bi-x-circle-fill' },
  };
  // All status feedback is announced by this toast. Invalid controls keep only
  // a visual outline and focus; no notification text is inserted into the form.
  function showToast(text, type = 'warning') {
    if (!toast) return;
    const detail = toastDetails[type] || toastDetails.warning;
    toastElement.classList.remove('is-success', 'is-warning', 'is-error');
    toastElement.classList.add(`is-${type}`);
    toastElement.setAttribute('role', type === 'error' ? 'alert' : 'status');
    toastElement.setAttribute('aria-live', type === 'error' ? 'assertive' : 'polite');
    document.getElementById('userRegisterToastTitle').textContent = detail.title;
    document.getElementById('userRegisterToastIcon').className = `bi ${detail.icon}`;
    document.getElementById('userRegisterToastBody').textContent = text;
    toast.show();
  }
  const regionSelect = form.elements.region;
  const officeSelect = form.elements.office;
  const dateInput = form.elements.dateOfBirth;
  // Keep the native date input for keyboard entry and validation; this visible
  // button opens its picker because the browser-supplied icon is theme-dependent.
  document.getElementById('userDatePickerButton')?.addEventListener('click', () => {
    try {
      if (typeof dateInput.showPicker === 'function') dateInput.showPicker();
      else { dateInput.focus(); dateInput.click(); }
    } catch { dateInput.focus(); }
  });
  // Use the user's local calendar day so a date near midnight remains valid.
  const today = new Date();
  dateInput.max = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  let step = 0;

  const fields = ['firstName', 'middleName', 'lastName', 'suffix', 'dateOfBirth', 'email', 'phone', 'role', 'office', 'region', 'position'];
  // Backend handoff: load allowed roles and offices from server policy; validate
  // them again on submit. A selected role in this browser must never grant access.
  const allowedRoles = new Set(['System Administrator', 'Data Encoder', 'Program Administrator', 'Program Head']);
  const officeTypes = [
    'DA Regional Field Office', 'DA-SAAD', 'DA-AMIA', 'DA-Livestock',
    'DA-HVCDP', 'DA-Rice Program', 'DA-Corn Program', 'DA-ATI',
  ];
  function syncOffices() {
    const region = regionSelect.value;
    officeSelect.replaceChildren(new Option(region ? 'Select an office or organization' : 'Select a region first', ''));
    officeSelect.disabled = !region;
    if (region) officeTypes.forEach((office) => officeSelect.add(new Option(office, office)));
  }
  regionSelect.addEventListener('change', syncOffices);
  syncOffices();
  const value = (name) => form.elements[name].value.trim();
  // Keep the invalid field in focus while the toast explains the correction.
  // Apply server validation errors to the matching control when an API is added.
  function clearFieldError(input) {
    input.classList.remove('is-invalid');
    input.removeAttribute('aria-invalid');
  }
  function showFieldError(input, text) {
    clearFieldError(input);
    input.classList.add('is-invalid');
    input.setAttribute('aria-invalid', 'true');
    input.focus();
    showToast(text, input.validity.typeMismatch ? 'error' : 'warning');
  }
  form.addEventListener('input', (event) => { if (event.target.matches('input, select')) clearFieldError(event.target); });
  form.addEventListener('change', (event) => { if (event.target.matches('input, select')) clearFieldError(event.target); });
  function validateCurrent() {
    for (const input of steps[step].querySelectorAll('input, select')) {
      if (input.required && !input.value.trim()) {
        showFieldError(input, `Enter or select ${input.labels?.[0]?.textContent.replace('*', '').trim().toLowerCase() || 'this value'}.`);
        return false;
      }
      if (!input.checkValidity()) {
        showFieldError(input, input.validity.typeMismatch ? 'Enter a valid work email address.' : input.validationMessage);
        return false;
      }
    }
    return true;
  }
  function review() {
    const labels = [
      ['Full name', [value('firstName'), value('middleName'), value('lastName'), value('suffix')].filter(Boolean).join(' ')],
      ['Date of birth', value('dateOfBirth') || '—'],
      ['Work email', value('email')], ['Mobile number', value('phone') || '—'],
      ['User role', value('role')], ['Region', value('region')],
      ['Office / organization', value('office')], ['Position', value('position') || '—'],
      ['Registration status', 'Pending approval'],
    ];
    const list = document.getElementById('userReview');
    list.replaceChildren(...labels.map(([label, text]) => {
      const row = document.createElement('div');
      const term = document.createElement('dt');
      const description = document.createElement('dd');
      term.textContent = label;
      description.textContent = text;
      row.append(term, description);
      return row;
    }));
  }
  function render(moveFocus = false) {
    steps.forEach((section, index) => { section.hidden = index !== step; });
    indicators.forEach((item, index) => {
      item.classList.toggle('is-current', index === step);
      item.classList.toggle('is-completed', index < step);
      if (index === step) item.setAttribute('aria-current', 'step');
      else item.removeAttribute('aria-current');
    });
    back.hidden = step === 0;
    next.hidden = step === steps.length - 1;
    submit.hidden = step !== steps.length - 1;
    again.hidden = true;
    if (step === steps.length - 1) review();
    // Put keyboard and screen-reader users at the newly visible step heading.
    const heading = steps[step].querySelector('h5');
    if (moveFocus && heading) {
      heading.setAttribute('tabindex', '-1');
      heading.focus({ preventScroll: true });
    }
  }
  next.addEventListener('click', () => {
    if (!validateCurrent()) return;
    step++;
    render(true);
  });
  back.addEventListener('click', () => { step--; render(true); });
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (step !== steps.length - 1) return;
    if (!allowedRoles.has(value('role'))) {
      step = 1;
      render();
      showToast('Select one of the four supported user roles.', 'warning');
      form.elements.role.focus();
      return;
    }
    if (!regionSelect.value || !officeSelect.value || ![...officeSelect.options].some((option) => option.value === officeSelect.value && option.value)) {
      step = 1;
      render();
      showToast('Select a region and an office or organization from its list.', 'warning');
      officeSelect.focus();
      return;
    }
    try {
      const key = 'tmis-users';
      const saved = JSON.parse(localStorage.getItem(key) || '[]');
      if (!Array.isArray(saved)) throw new Error('Invalid user data');
      const email = value('email').toLowerCase();
      if (saved.some((user) => String(user.email || '').toLowerCase() === email)) {
        step = 0;
        render();
        showToast('This email is already registered in this browser.', 'warning');
        form.elements.email.focus();
        return;
      }
      const now = new Date().toISOString();
      const record = Object.fromEntries(fields.map((name) => [name, value(name)]));
      record.email = email;
      record.id = globalThis.crypto?.randomUUID?.() || `USR-${Date.now()}`;
      record.status = 'Pending approval';
      record.createdAt = now;
      record.updatedAt = now;
      localStorage.setItem(key, JSON.stringify([...saved, record]));
      steps.forEach((section) => { section.hidden = true; });
      indicators.forEach((item) => { item.classList.remove('is-current'); item.classList.add('is-completed'); item.removeAttribute('aria-current'); });
      back.hidden = true;
      next.hidden = true;
      submit.hidden = true;
      again.hidden = false;
      showToast(`Registration saved for ${record.firstName} ${record.lastName}. Status: Pending approval.`, 'success');
    } catch { showToast('The registration could not be saved. Please try again.', 'error'); }
  });
  again.addEventListener('click', () => { form.reset(); syncOffices(); step = 0; render(true); });
  render();
});
