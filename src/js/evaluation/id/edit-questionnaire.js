document.addEventListener('DOMContentLoaded', () => {
  const configs = {
    'pre-test': ['tmis-pre-test-questionnaires', 'preTestRegisterForm'],
    'post-test': ['tmis-post-test-questionnaires', 'postTestRegisterForm'],
    'training-evaluation': ['tmis-training-evaluation-questionnaires', 'trainingEvaluationForm'],
    'rp-evaluation': ['tmis-rp-evaluation-questionnaires', 'rpEvaluationForm'],
  };
  const config = configs[document.body.dataset.questionnaireType];
  if (!config) return;
  const form = document.getElementById(config[1]);
  const id = new URLSearchParams(location.search).get('id');
  if (!form) return;
  let exists = false;
  try {
    const saved = JSON.parse(localStorage.getItem(config[0]) || '[]');
    exists = Boolean(id && Array.isArray(saved) && saved.some((item) => item?.id === id));
  } catch { /* Show the same unavailable state for unreadable saved data. */ }
  if (!exists) {
    form.replaceWith(Object.assign(document.createElement('div'), {
      className: 'card edit-questionnaire-unavailable',
      innerHTML: '<i class="bi bi-exclamation-circle" aria-hidden="true"></i><p>This questionnaire could not be found. Select an existing record from the list.</p><a href="../details/list-questionnaire.html">Back to Questionnaire List</a>',
    }));
    return;
  }
  const description = document.querySelector('.content-info');
  if (description) description.textContent = 'Update this questionnaire and save the changes to the existing record.';
});
