document.addEventListener('DOMContentLoaded', () => {
  const tabs = [...document.querySelectorAll('#rpTabs [role="tab"]')];
  function activate(tab, focus = false) {
    tabs.forEach(button => {
      const selected = button === tab;
      button.classList.toggle('active', selected);
      button.setAttribute('aria-selected', String(selected));
      button.tabIndex = selected ? 0 : -1;
      document.getElementById(button.getAttribute('aria-controls')).hidden = !selected;
    });
    if (focus) tab.focus();
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activate(tab));
    tab.addEventListener('keydown', event => {
      let next = index;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      else if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = tabs.length - 1;
      else return;
      event.preventDefault(); activate(tabs[next], true);
    });
  });
  activate(tabs[0]);

  const id = new URLSearchParams(location.search).get('id');
  let records = [];
  try { const stored = JSON.parse(localStorage.getItem('tmis-resource-persons') || '[]'); if (Array.isArray(stored)) records = stored; }
  catch { /* A missing or invalid saved list shows the empty state. */ }
  const record = records.find(item => item.id === id);
  const missing = document.getElementById('rpMissing');
  const content = document.getElementById('rpContent');
  if (!record) {
    missing.hidden = false; content.hidden = true;
    document.getElementById('rpEditLink').hidden = true;
    return;
  }
  const value = key => String(record[key] || '').trim();
  const displayName = [
    ...(value('title') === 'RAgr' ? [] : [value('title')]),
    value('first_name'), value('middle_name'), value('last_name'), value('suffix'),
    ...(value('title') === 'RAgr' ? ['RAgr'] : []),
  ].filter(Boolean).join(' ');
  document.getElementById('rpName').textContent = displayName || 'Resource Person';
  document.getElementById('rpHeroId').textContent = value('id') || '—';
  document.getElementById('rpHeroOffice').textContent = value('office') || 'Not provided';
  const registered = record.savedAt ? new Date(record.savedAt) : null;
  document.getElementById('rpRegistered').textContent = registered && !Number.isNaN(registered.getTime())
    ? registered.toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Not available';
  document.getElementById('rpStatus').textContent = value('status') || 'Active';
  document.getElementById('rpStatus').classList.toggle('is-inactive', value('status') === 'Inactive');
  document.getElementById('rpEditLink').href = `edit-rp.html?id=${encodeURIComponent(id)}`;
  document.querySelectorAll('[data-rp-field]').forEach(node => {
    const field = node.dataset.rpField;
    node.textContent = value(field) || 'Not provided';
  });
  const email = document.getElementById('rpEmailValue');
  if (value('email')) {
    const link = document.createElement('a'); link.href = `mailto:${value('email')}`; link.textContent = value('email');
    email.replaceChildren(link);
  }
  const phone = document.getElementById('rpPhoneValue');
  if (value('phone')) {
    const link = document.createElement('a'); link.href = `tel:${value('phone').replace(/[^+\d]/g, '')}`; link.textContent = value('phone');
    phone.replaceChildren(link);
  }
  for (const key of ['qualification', 'expertise']) {
    const list = document.getElementById(key === 'qualification' ? 'rpQualifications' : 'rpExpertise');
    const parts = value(key).split(/[\n;,]+/).map(part => part.trim()).filter(Boolean);
    list.replaceChildren();
    if (!parts.length) {
      const item = document.createElement('li'); item.className = 'rp-list-empty'; item.textContent = 'Not provided'; list.append(item);
    } else parts.forEach(part => { const item = document.createElement('li'); item.textContent = part; list.append(item); });
  }
  missing.hidden = true; content.hidden = false;
});
