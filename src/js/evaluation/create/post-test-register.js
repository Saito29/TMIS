document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('postTestRegisterForm');
  const status = document.getElementById('postTestRegisterStatus');
  if (!form || !status) return;
  const storageKey = 'tmis-post-test-questionnaires';
  let editId = new URLSearchParams(location.search).get('id');
  if (editId) {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || '[]');
      const item = Array.isArray(saved) ? saved.find((entry) => entry.id === editId) : null;
      if (item) {
        form.elements.training_questionnaire.value = item.trainingQuestionnaire || '';
        form.elements.region.value = item.region || '';
        if (item.region) window.syncQuestionnaireOffice?.();
        form.elements.implementing_office.value = item.implementingOffice || '';
        form.elements.total_items.value = item.totalItems || '';
        form.elements.description.value = item.description || '';
      }
    } catch { window.showQuestionnaireToast('The questionnaire could not be loaded.', 'error'); }
  }

  form.addEventListener('invalid', () => {
    window.showQuestionnaireToast('Complete the required fields before saving the post-test questionnaire.', 'error');
  }, true);

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    const record = {
      id: editId || crypto.randomUUID(),
      trainingQuestionnaire: form.elements.training_questionnaire.value.trim(),
      implementingOffice: form.elements.implementing_office.value,
      region: form.elements.region.value,
      totalItems: Number(form.elements.total_items.value),
      description: form.elements.description.value.trim(),
      createdAt: new Date().toISOString(),
    };

    if (!record.trainingQuestionnaire || !Number.isSafeInteger(record.totalItems) || record.totalItems < 1) {
      status.textContent = 'Enter a questionnaire name and a positive whole number of items.';
      window.showQuestionnaireToast(status.textContent, 'error');
      status.hidden = false;
      return;
    }

    try {
      const records = JSON.parse(localStorage.getItem(storageKey) || '[]');
      const index = editId ? records.findIndex((item) => item.id === editId) : -1;
      if (editId && index < 0) throw new Error('Questionnaire missing');
      if (index < 0) records.push(record);
      else { record.createdAt = records[index].createdAt || record.createdAt; records[index] = record; }
      localStorage.setItem(storageKey, JSON.stringify(records));
      if (document.body.classList.contains('questionnaire-edit-page')) {
        status.textContent = 'Post-test questionnaire updated.';
        window.showQuestionnaireToast(status.textContent);
        form.querySelector('[type="submit"]').disabled = true;
        window.setTimeout(() => { location.href = '../details/list-questionnaire.html'; }, 700);
        return;
      }
      form.reset();
      if (editId) { editId = null; history.replaceState(null, '', location.pathname); }
      status.textContent = 'Post-test questionnaire registered.';
      window.showQuestionnaireToast(status.textContent);
    } catch {
      status.textContent = 'The questionnaire could not be saved. Please try again.';
      window.showQuestionnaireToast(status.textContent, 'error');
    }
    status.hidden = false;
  });
});
