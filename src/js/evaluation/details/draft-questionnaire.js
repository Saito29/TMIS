document.addEventListener('DOMContentLoaded', () => {
  const rows = document.getElementById('draftQuestionnaireRows');
  const status = document.getElementById('draftQuestionnaireStatus');
  const sources = [
    { key: 'tmis-rp-evaluation-questionnaires', type: 'Resource Person Evaluation', path: 'rp-evaluation-register.html' },
    { key: 'tmis-training-evaluation-questionnaires', type: 'Training Evaluation', path: 'training-evaluation-register.html' },
  ];
  let records = [];
  try {
    sources.forEach((source) => {
      const saved = JSON.parse(localStorage.getItem(source.key) || '[]');
      if (Array.isArray(saved)) {
        records.push(...saved.filter((record) => record?.status === 'Draft' && record.id)
          .map((record) => ({ ...record, draftType: source.type, editPath: source.path })));
      }
    });
  } catch {
    status.textContent = 'Drafts could not be loaded from this browser.';
    return;
  }

  records.sort((a, b) => String(b.updatedAt || '').localeCompare(String(a.updatedAt || '')));
  if (!records.length) {
    const row = document.createElement('tr');
    const cell = document.createElement('td');
    cell.colSpan = 6;
    cell.className = 'empty';
    cell.textContent = 'No saved drafts yet.';
    row.append(cell);
    rows.append(row);
    return;
  }

  records.forEach((record) => {
    const row = document.createElement('tr');
    const values = [
      record.questionnaireName || 'Untitled questionnaire',
      record.draftType,
      record.office || '—',
      String(Array.isArray(record.questions) ? record.questions.length : 0),
      record.updatedAt && !Number.isNaN(Date.parse(record.updatedAt))
        ? new Date(record.updatedAt).toLocaleString()
        : '—',
    ];
    values.forEach((value) => {
      const cell = document.createElement('td');
      cell.textContent = value;
      row.append(cell);
    });
    const action = document.createElement('td');
    const link = document.createElement('a');
    link.href = `../create/${record.editPath}?id=${encodeURIComponent(record.id)}`;
    link.textContent = 'Continue editing';
    action.append(link);
    row.append(action);
    rows.append(row);
  });
  status.textContent = `${records.length} draft questionnaire${records.length === 1 ? '' : 's'}`;
});

document.addEventListener('DOMContentLoaded', () => {
  const rows = document.getElementById('draftEncodingRows');
  const status = document.getElementById('draftEncodingStatus');
  if (!rows || !status) return;
  let drafts;
  try {
    drafts = [
      { key: 'tmis-pre-test-encoded', type: 'Pre-test', path: 'pre-test.html' },
      { key: 'tmis-post-test-encoded', type: 'Post-test', path: 'post-test.html' },
      { key: 'tmis-training-evaluation-encoded', type: 'Training Evaluation', path: 'training-evaluation.html' },
      { key: 'tmis-rp-evaluation-encoded', type: 'Resource Person Evaluation', path: 'rp-evaluation.html' },
    ].flatMap(source => {
      const saved = JSON.parse(localStorage.getItem(source.key) || '[]');
      return Array.isArray(saved) ? saved.filter(record => record?.status === 'draft' && record.id).map(record => ({ ...record, draftType: source.type, editPath: source.path })) : [];
    });
  } catch {
    status.textContent = 'Encoding drafts could not be loaded from this browser.';
    return;
  }
  drafts.sort((a, b) => String(b.savedAt || '').localeCompare(String(a.savedAt || '')));
  if (!drafts.length) {
    const row = document.createElement('tr');
    const cell = document.createElement('td');
    cell.colSpan = 7;
    cell.className = 'empty';
    cell.textContent = 'No saved encoding drafts yet.';
    row.append(cell);
    rows.append(row);
  }
  drafts.forEach(record => {
    const row = document.createElement('tr');
    const progress = Array.isArray(record.ratings) ? `${record.ratings.filter(item => item.rating != null).length} / ${record.ratings.length} rated` : record.score == null ? 'Not entered' : `${record.score}${record.totalItems ? ` / ${record.totalItems}` : ''}`;
    const values = [record.farmerName || 'Farmer not selected', record.draftType, record.questionnaireName || 'Questionnaire not selected', record.farmerAssociation || '—', progress, record.savedAt && !Number.isNaN(Date.parse(record.savedAt)) ? new Date(record.savedAt).toLocaleString() : '—'];
    values.forEach(value => { const cell = document.createElement('td'); cell.textContent = value; row.append(cell); });
    const action = document.createElement('td');
    const link = document.createElement('a');
    link.href = `../encode/${record.editPath}?draft=${encodeURIComponent(record.id)}`;
    link.textContent = 'Continue encoding';
    action.append(link);
    row.append(action);
    rows.append(row);
  });
  status.textContent = `${drafts.length} encoding draft${drafts.length === 1 ? '' : 's'}`;
});
