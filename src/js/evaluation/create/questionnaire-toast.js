(() => {
  let timer;
  window.showQuestionnaireToast = (message, type = 'success') => {
    let toast = document.getElementById('questionnaireToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'questionnaireToast';
      toast.className = 'questionnaire-toast';
      toast.setAttribute('role', 'status');
      toast.setAttribute('aria-live', 'polite');
      const icon = document.createElement('i');
      icon.className = 'bi';
      icon.setAttribute('aria-hidden', 'true');
      const text = document.createElement('span');
      const close = document.createElement('button');
      close.type = 'button';
      close.className = 'questionnaire-toast-close';
      close.setAttribute('aria-label', 'Dismiss notification');
      close.innerHTML = '<i class="bi bi-x-lg" aria-hidden="true"></i>';
      close.addEventListener('click', () => { clearTimeout(timer); toast.classList.remove('is-visible'); });
      toast.append(icon, text, close);
      document.body.append(toast);
    }
    clearTimeout(timer);
    toast.classList.toggle('is-error', type === 'error');
    toast.setAttribute('role', type === 'error' ? 'alert' : 'status');
    toast.firstElementChild.className = `bi ${type === 'error' ? 'bi-exclamation-circle-fill' : 'bi-check-circle-fill'}`;
    toast.children[1].textContent = message;
    toast.classList.remove('is-visible');
    requestAnimationFrame(() => toast.classList.add('is-visible'));
    timer = setTimeout(() => toast.classList.remove('is-visible'), 5000);
  };
})();
