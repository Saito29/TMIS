// Read the same tmis-users records as the administration tables. Prefer the
// connected session ID; for this prototype, resolve the displayed profile-menu
// identity to one unique registration and retain its stable ID in this tab.
document.addEventListener('DOMContentLoaded', () => {
  const $ = id => document.getElementById(id);
  const tabs = [...document.querySelectorAll('[data-profile-tab]')];
  let events = [], activeSource = 'all', securityEvents = [], displayedUser = null;
  const formatDate = (value, birthday = false) => {
    if (!value) return 'Not available';
    const date = new Date(birthday ? `${String(value).slice(0, 10)}T00:00:00+08:00` : value);
    return Number.isNaN(date.getTime()) ? 'Not available' : new Intl.DateTimeFormat('en-PH', { dateStyle: 'medium', ...(!birthday ? { timeStyle: 'short' } : {}), timeZone: 'Asia/Manila' }).format(date);
  };
  function showTab(key, focus = false) {
    if (!tabs.some(tab => tab.dataset.profileTab === key)) key = 'account';
    tabs.forEach(tab => {
      const active = tab.dataset.profileTab === key;
      tab.setAttribute('aria-selected', String(active)); tab.tabIndex = active ? 0 : -1;
      $(`${tab.dataset.profileTab}-panel`).hidden = !active;
      if (active && focus) tab.focus();
    });
    if (key === 'logs') renderLogs();
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => { history.replaceState(null, '', `#${tab.dataset.profileTab}`); showTab(tab.dataset.profileTab); });
    tab.addEventListener('keydown', event => {
      const next = event.key === 'ArrowRight' ? (index + 1) % tabs.length : event.key === 'ArrowLeft' ? (index + tabs.length - 1) % tabs.length : event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : null;
      if (next === null) return;
      event.preventDefault(); history.replaceState(null, '', `#${tabs[next].dataset.profileTab}`); showTab(tabs[next].dataset.profileTab, true);
    });
  });
  window.addEventListener('hashchange', () => showTab(location.hash.slice(1)));
  function details(container, entries) {
    $(container).replaceChildren(...entries.map(([label, value]) => {
      const row = document.createElement('div'), term = document.createElement('dt'), text = document.createElement('dd');
      term.textContent = label; text.textContent = value || 'Not provided'; row.append(term, text); return row;
    }));
  }
  function renderLogs() {
    const query = $('myLogSearch').value.trim().toLowerCase();
    const category = $('myLogCategory').value;
    const sources = [...document.querySelectorAll('[data-log-source]')];
    ['all', 'account', 'resource', 'association'].forEach(source => {
      $(`logCount-${source}`).textContent = events.filter(event => source === 'all' || event.source === source).length;
    });
    sources.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.logSource === activeSource)));
    const filtered = events.filter(event => (activeSource === 'all' || event.source === activeSource)
      && (!category || event.category === category)
      && `${event.title} ${event.detail} ${event.actor} ${event.reference} ${event.status} ${formatDate(event.date)}`.toLowerCase().includes(query));
    $('myLogBody').replaceChildren(...filtered.map(event => {
      const article = document.createElement('article'); article.className = 'self-activity-entry';
      const marker = document.createElement('span'); marker.className = `self-activity-marker ${event.category}`;
      const icon = document.createElement('i'); icon.className = `bi ${{ registration: 'bi-person-plus', profile: 'bi-person-vcard', status: 'bi-arrow-left-right', attachment: 'bi-paperclip' }[event.category] || 'bi-clock-history'}`;
      icon.setAttribute('aria-hidden', 'true'); marker.append(icon);
      const content = document.createElement('div'); content.className = 'self-activity-content';
      const top = document.createElement('div'); top.className = 'self-activity-top';
      const title = document.createElement('h3'); title.textContent = event.title;
      const badge = document.createElement('span'); badge.className = 'self-activity-badge'; badge.textContent = event.status || event.category;
      top.append(title, badge);
      const description = document.createElement('p'); description.textContent = event.detail;
      const meta = document.createElement('div'); meta.className = 'self-activity-meta';
      const actor = document.createElement('span'); actor.textContent = `By ${event.actor || 'Not recorded'}`;
      const reference = document.createElement('span'); reference.textContent = event.reference || 'No reference';
      const time = document.createElement('time'); time.dateTime = event.date; time.textContent = formatDate(event.date);
      meta.append(actor, reference, time); content.append(top, description, meta); article.append(marker, content); return article;
    }));
    $('myLogCount').textContent = `${filtered.length} of ${events.length} activities`;
    $('myLogEmpty').hidden = filtered.length > 0;
    $('myLogEmpty').textContent = events.length ? 'No activities match your search or filters.' : 'No saved activity logs are available for your account yet.';
  }
  function collectLogs(user) {
    if (!user) return [];
    const logs = [];
    const validDate = value => value && !Number.isNaN(Date.parse(value));
    const normalize = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
    const identity = normalize([user.firstName, user.middleName, user.lastName, user.suffix].filter(Boolean).join(' '));
    const readLogs = record => [...(Array.isArray(record.activityLogs) ? record.activityLogs : []), ...(Array.isArray(record.activity_logs) ? record.activity_logs : [])];
    function add(log, source, reference) {
      if (!log || !validDate(log.date || log.createdAt || log.timestamp)) return;
      logs.push({ title: String(log.title || 'Activity recorded'), detail: String(log.description || log.detail || ''), category: String(log.category || 'profile'), date: log.date || log.createdAt || log.timestamp, actor: String(log.actor || 'Not recorded'), reference: String(log.reference || reference || ''), status: String(log.status || 'Recorded'), source });
    }
    readLogs(user).forEach(log => add(log, 'account', user.id));
    if (validDate(user.createdAt) && !logs.some(log => log.category === 'registration')) add({ category: 'registration', title: 'Account registered', description: 'Registration record created.', date: user.createdAt, status: 'Registered' }, 'account', user.id);
    if (validDate(user.decidedAt) && !logs.some(log => log.date === user.decidedAt && log.category === 'status')) add({ category: 'status', title: 'Access decision recorded', description: 'An account approval decision was saved.', date: user.decidedAt }, 'account', user.id);
    if (validDate(user.updatedAt) && user.updatedAt !== user.createdAt && !logs.some(log => log.date === user.updatedAt)) add({ category: 'profile', title: 'Account updated', description: 'Most recent saved account update.', date: user.updatedAt, status: 'Updated' }, 'account', user.id);
    for (const [key, source] of [['tmis-resource-persons', 'resource'], ['tmis-farmer-associations', 'association']]) {
      try {
        const records = JSON.parse(localStorage.getItem(key) || '[]');
        if (!Array.isArray(records)) continue;
        records.forEach(record => readLogs(record || {}).forEach(log => {
          const actorId = log?.actorId || log?.userId || log?.actor_id;
          if (actorId ? actorId === user.id : identity && normalize(log?.actor) === identity) add(log, source, record.id);
        }));
      } catch { /* One unavailable module does not hide the account history. */ }
    }
    return [...new Map(logs.map(log => [[log.source, log.reference, log.date, log.title, log.detail].join('|'), log])).values()].sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
  }
  function load() {
    let user = null;
    $('myProfileNotice').hidden = false;
    $('myProfileNotice').textContent = 'Your signed-in account is not connected yet. Personal details will appear here when it is available.';
    try {
      const id = window.TMIS_SESSION?.userId || sessionStorage.getItem('tmis-current-user-id');
      const users = JSON.parse(localStorage.getItem('tmis-users') || '[]');
      if (!Array.isArray(users)) throw new Error('Invalid account records');
      if (id) {
        user = window.TMIS_SESSION?.user || users.find(record => record?.id === id) || null;
      } else {
        const normalize = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
        const menuName = normalize(document.querySelector('.app-profile .profile-name')?.textContent
          || document.querySelector('.mobile-user-name-role .user-name')?.textContent);
        const matches = menuName ? users.filter(record => {
          if (!record?.id || !record.firstName || !record.lastName) return false;
          const middle = String(record.middleName || '').trim();
          const middleInitials = middle.split(/\s+/).filter(Boolean).map(part => part.charAt(0)).join(' ');
          return [middle, middleInitials].some(part => normalize([record.firstName, part, record.lastName, record.suffix].filter(Boolean).join(' ')) === menuName);
        }) : [];
        if (matches.length === 1) {
          user = matches[0];
          sessionStorage.setItem('tmis-current-user-id', user.id);
        } else {
          $('myProfileNotice').textContent = matches.length > 1
            ? 'More than one registration matches your profile name. Connect your account using its User ID to show the correct details.'
            : 'No user-table record matches the name in your profile menu. Check your registered name with your administrator.';
        }
      }
      if (id && !user) $('myProfileNotice').textContent = 'Your account record is unavailable. Contact your administrator for help.';
    } catch { $('myProfileNotice').textContent = 'Your profile could not be loaded. Refresh the page or contact your administrator.'; }
    displayedUser = user;
    // Backend profile transfer is retained for future integration.
    // $('exportMyAccountProfile').hidden = !user || !!window.TmisAuth?.getSession()?.authenticated;
    $('exportMyAccountProfile').hidden = true;
    const fullName = user ? [user.firstName, user.middleName, user.lastName, user.suffix].filter(Boolean).join(' ') : 'Your account';
    $('myProfileName').textContent = fullName || 'Your account';
    $('myProfileAvatar').textContent = user ? [user.firstName, user.lastName].map(part => String(part || '').charAt(0)).join('').toUpperCase() || 'U' : 'U';
    $('myProfileEmail').textContent = user?.email || 'Account details are not connected yet.';
    $('myProfileRole').textContent = user?.role || 'Role not available';
    $('myProfileOffice').textContent = user?.office || 'Not available';
    const rawStatus = String(user?.status || '').trim();
    const state = /^(approved|accepted|approved\s*&\s*accepted|active)$/i.test(rawStatus) ? ['Active', 'active'] : /^inactive$/i.test(rawStatus) ? ['Inactive', 'inactive'] : /^(pending approval|for[ -]review)$/i.test(rawStatus) ? ['For approval', 'pending'] : rawStatus ? [rawStatus, 'inactive'] : ['Not connected', 'inactive'];
    $('myProfileStatus').textContent = state[0]; $('myProfileStatus').className = `self-status ${state[1]}`;
    if (user) $('myProfileNotice').hidden = true;
    details('myPersonalDetails', [['First name', user?.firstName], ['Middle name', user?.middleName], ['Last name', user?.lastName], ['Extension', user?.suffix], ['Date of birth', formatDate(user?.dateOfBirth, true)], ['Work email', user?.email], ['Mobile number', user?.phone]]);
    details('myAccountDetails', [['User ID', user?.id], ['User role', user?.role], ['Region', user?.region], ['Office / organization', user?.office], ['Position', user?.position], ['Account status', state[0]], ['Registered date', formatDate(user?.createdAt)], ['Last updated', formatDate(user?.updatedAt)]]);
    events = [...collectLogs(user), ...securityEvents].sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
    renderLogs();
  }
  const passwordForm = $('passwordChangeForm');
  const passwordRules = [
    ['length', 'At least 8 characters', value => Array.from(value).length >= 8],
    ['upper', 'One uppercase letter', value => /[A-Z]/.test(value)],
    ['lower', 'One lowercase letter', value => /[a-z]/.test(value)],
    ['special', 'One special character', value => /[^\p{L}\p{N}\s]/u.test(value)],
    ['number', 'One number', value => /[0-9]/.test(value)],
  ];
  function updatePasswordRequirements() {
    const password = $('password-new').value;
    let count = 0;
    passwordRules.forEach(([key, label, check]) => {
      const met = check(password); count += Number(met);
      $(`password-rule-${key}`).dataset.met = String(met);
      $(`password-rule-${key}`).setAttribute('aria-label', `${label}: ${met ? 'met' : 'not met'}`);
    });
    $('passwordRequirementSummary').textContent = `${count} of 5 requirements met.`;
    const confirmation = $('password-confirm').value;
    const matches = !!confirmation && confirmation === password;
    $('passwordMatchStatus').dataset.match = confirmation ? String(matches) : 'empty';
    $('passwordMatchStatus').textContent = !confirmation ? 'Re-enter your new password to confirm it.' : matches ? 'Passwords match.' : 'Passwords do not match.';
  }
  ['new', 'confirm'].forEach(key => {
    $(`password-${key}`).addEventListener('input', updatePasswordRequirements);
    $(`password-${key}`).addEventListener('change', updatePasswordRequirements);
  });
  updatePasswordRequirements();

  function clearPasswords() {
    passwordForm.reset();
    ['new', 'confirm'].forEach(key => {
      $(`password-${key}`).type = 'password';
      const toggle = $(`toggle-password-${key}`);
      toggle.setAttribute('aria-pressed', 'false');
      toggle.setAttribute('aria-label', `Show ${key === 'confirm' ? 'confirm new' : key} password`);
      toggle.firstElementChild.className = 'bi bi-eye';
    });
    $('passwordFormStatus').textContent = '';
    updatePasswordRequirements();
  }
  ['new', 'confirm'].forEach(key => {
    $(`toggle-password-${key}`).addEventListener('click', () => {
      const input = $(`password-${key}`), toggle = $(`toggle-password-${key}`);
      const visible = input.type === 'password';
      input.type = visible ? 'text' : 'password';
      toggle.setAttribute('aria-pressed', String(visible));
      toggle.setAttribute('aria-label', `${visible ? 'Hide' : 'Show'} ${key === 'confirm' ? 'confirm new' : key} password`);
      toggle.firstElementChild.className = visible ? 'bi bi-eye-slash' : 'bi bi-eye';
    });
  });
  passwordForm.addEventListener('submit', event => {
    event.preventDefault();
    if (!window.TmisAuth?.getSession()?.authenticated) $('passwordFormStatus').textContent = 'Password updates are disabled in frontend preview mode.';
  });
  $('cancelPasswordChange').addEventListener('click', () => { clearPasswords(); $('passwordSection').open = false; });
  $('passwordSection').addEventListener('toggle', () => { if (!$('passwordSection').open) clearPasswords(); });
  window.addEventListener('pagehide', clearPasswords);
  window.addEventListener('tmis:session', () => { securityEvents = []; load(); });
  window.addEventListener('tmis:security-logs', event => { securityEvents = event.detail || []; load(); });
  $('exportMyAccountProfile').addEventListener('click', () => {
    if (!displayedUser) return;
    const fields = ['id','firstName','middleName','lastName','suffix','dateOfBirth','email','phone','region','office','position','createdAt','updatedAt'];
    const profile = Object.fromEntries(fields.map(field => [field, displayedUser[field] || '']));
    const url = URL.createObjectURL(new Blob([JSON.stringify(profile, null, 2)], { type: 'application/json' }));
    const link = document.createElement('a'); link.href = url; link.download = 'tmis-profile-transfer.json'; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
  $('refreshMyProfile').addEventListener('click', load);
  $('myLogSearch').addEventListener('input', renderLogs);
  $('myLogCategory').addEventListener('change', renderLogs);
  document.querySelectorAll('[data-log-source]').forEach(button => button.addEventListener('click', () => { activeSource = button.dataset.logSource; renderLogs(); }));
  window.addEventListener('storage', event => { if (!event.key || ['tmis-users', 'tmis-resource-persons', 'tmis-farmer-associations'].includes(event.key)) load(); });
  load(); showTab(location.hash.slice(1));
});
