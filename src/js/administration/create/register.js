document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('userRegisterForm');
  if (!form) return;
  const steps = [...form.querySelectorAll('.user-step')];
  const indicators = [...document.querySelectorAll('#userWizardSteps [data-step]')];
  const back = document.getElementById('userBack');
  const next = document.getElementById('userNext');
  const submit = document.getElementById('userSubmit');
  const message = document.getElementById('userFormMessage');
  const regionSelect = form.elements.region;
  const officeSelect = form.elements.office;
  let step = 0;

  const fields = ['firstName', 'middleName', 'lastName', 'suffix', 'email', 'phone', 'role', 'office', 'region', 'position'];
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
  const showMessage = (text, error = false) => {
    message.textContent = text;
    message.dataset.state = error ? 'error' : 'success';
    message.hidden = false;
  };
  const clearMessage = () => { message.hidden = true; message.textContent = ''; };
  function validateCurrent() {
    for (const input of steps[step].querySelectorAll('input, select')) {
      if (input.required && !input.value.trim()) { input.focus(); input.reportValidity(); return false; }
      if (!input.checkValidity()) { input.focus(); input.reportValidity(); return false; }
    }
    return true;
  }
  function review() {
    const labels = [
      ['Full name', [value('firstName'), value('middleName'), value('lastName'), value('suffix')].filter(Boolean).join(' ')],
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
  function render() {
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
    if (step === steps.length - 1) review();
    clearMessage();
  }
  next.addEventListener('click', () => {
    if (!validateCurrent()) return;
    step++;
    render();
  });
  back.addEventListener('click', () => { step--; render(); });
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (step !== steps.length - 1) return;
    if (!allowedRoles.has(value('role'))) {
      step = 1;
      render();
      showMessage('Select one of the four supported user roles.', true);
      form.elements.role.focus();
      return;
    }
    if (!regionSelect.value || !officeSelect.value || ![...officeSelect.options].some((option) => option.value === officeSelect.value && option.value)) {
      step = 1;
      render();
      showMessage('Select a region and an office or organization from its list.', true);
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
        showMessage('This email is already registered in this browser.', true);
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
      showMessage(`Registration saved for ${record.firstName} ${record.lastName}. Status: Pending approval.`);
      const again = document.createElement('button');
      again.type = 'button';
      again.className = 'btn user-next-button mt-3';
      again.textContent = 'Register another user';
      message.after(again);
      again.addEventListener('click', () => { again.remove(); form.reset(); syncOffices(); step = 0; render(); });
    } catch { showMessage('The registration could not be saved. Please try again.', true); }
  });
  render();
});
