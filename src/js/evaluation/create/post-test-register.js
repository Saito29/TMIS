document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('postTestRegisterForm');
  const status = document.getElementById('postTestRegisterStatus');
  if (!form || !status) return;

  form.addEventListener('invalid', () => {
    window.showQuestionnaireToast('Complete the required fields before saving the post-test questionnaire.', 'error');
  }, true);

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    const record = {
      id: crypto.randomUUID(),
      trainingQuestionnaire: form.elements.training_questionnaire.value.trim(),
      implementingOffice: form.elements.implementing_office.value,
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
      const key = 'tmis-post-test-questionnaires';
      const records = JSON.parse(localStorage.getItem(key) || '[]');
      records.push(record);
      localStorage.setItem(key, JSON.stringify(records));
      form.reset();
      status.textContent = 'Post-test questionnaire registered.';
      window.showQuestionnaireToast(status.textContent);
    } catch {
      status.textContent = 'The questionnaire could not be saved. Please try again.';
      window.showQuestionnaireToast(status.textContent, 'error');
    }
    status.hidden = false;
  });
});
