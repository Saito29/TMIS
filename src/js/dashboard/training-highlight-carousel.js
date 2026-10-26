// Dashboard highlight handoff: replace the IndexedDB/default slide content with
// sanitized API data when highlights are stored on the server. Update image paths
// and fallback text here; the carousel markup and layout live in dashboardv2.html.
(() => {
  if (!window.indexedDB) return;

  function showSlide(index, item) {
    const carousel = document.getElementById('communityFeedbackCarousel');
    if (!carousel || carousel.querySelector('.dashboard-training-highlight')) return;

    const defaults = [
      { image: '../../../assets/img/ricefield_with_farmer.png', heading: 'Learning through hands-on practice', description: 'Participants explored GAP concepts through demonstrations and practical discussion.', quote: 'The hands-on demonstration helped us understand how to apply GAP practices on our farms.' },
      { image: '../../../assets/img/ricefield_with_farmer-Picsart-AiImageEnhancer.png', heading: 'Bring the lessons back to the farm', description: 'Follow-up guidance and field visits can help farmers apply what they learned.', quote: 'Simple guides and follow-up visits will help us put the lessons into practice.' }
    ];
    const content = {...defaults[index], ...item};
    const article = document.createElement('article');
    article.className = 'carousel-item dashboard-training-highlight active';
    const image = document.createElement('img');
    image.className = 'community-feedback-image';
    image.alt = index === 0 ? 'Key Highlights training slide' : 'Ways Forward training slide';
    if (content.imageBlob instanceof Blob) {
      image.src = URL.createObjectURL(content.imageBlob);
      window.addEventListener('pagehide', () => URL.revokeObjectURL(image.src), {once:true});
    } else {
      const path = content.image?.startsWith('../../../../') ? `../../../${content.image.slice(12)}` : content.image;
      image.src = new URL(path, document.baseURI).href;
    }

    const overlay = document.createElement('div');
    overlay.className = 'community-feedback-overlay';
    const topline = document.createElement('div');
    topline.className = 'community-feedback-topline';
    const label = document.createElement('span');
    label.className = 'community-feedback-label';
    label.textContent = index === 0 ? 'Key Highlights' : 'Ways Forward';
    topline.append(label);
    const copy = document.createElement('div');
    copy.className = 'community-feedback-copy';
    const heading = document.createElement('h3');
    heading.textContent = content.heading || '';
    if (content.headingSize) heading.style.fontSize = `${content.headingSize}px`;
    const description = document.createElement('p');
    description.textContent = content.description || '';
    if (content.bodySize) description.style.fontSize = `${content.bodySize}px`;
    const quote = document.createElement('blockquote');
    quote.className = 'community-feedback-quote';
    quote.textContent = content.quote ? `“${content.quote}”` : '';
    if (content.quoteSize) quote.style.fontSize = `${content.quoteSize}px`;
    copy.append(heading, description);
    if (content.quote) copy.append(quote);
    const caption = document.createElement('div');
    caption.className = 'community-feedback-caption';
    const title = document.createElement('h5');
    title.textContent = content.trainingTitle || 'Good Agricultural Practices (GAP) · Training recap';
    caption.append(title);
    overlay.append(topline, copy, caption);
    article.append(image, overlay);

    const inner = carousel.querySelector('.carousel-inner');
    inner.querySelector('.carousel-item.active')?.classList.remove('active');
    inner.prepend(article);
    const indicators = carousel.querySelector('.carousel-indicators');
    if (indicators) {
      indicators.querySelectorAll('[data-bs-slide-to]').forEach((button, offset) => {
        button.dataset.bsSlideTo = String(offset + 1);
        button.classList.remove('active');
        button.removeAttribute('aria-current');
      });
      const button = document.createElement('button');
      button.type = 'button';
      button.dataset.bsTarget = '#communityFeedbackCarousel';
      button.dataset.bsSlideTo = '0';
      button.className = 'active';
      button.setAttribute('aria-current', 'true');
      button.setAttribute('aria-label', `Show ${index === 0 ? 'Key Highlights' : 'Ways Forward'} slide`);
      indicators.prepend(button);
    }
  }

  const request = indexedDB.open('tmis-training-highlights', 1);
  request.onupgradeneeded = () => {
    if (!request.result.objectStoreNames.contains('slides')) request.result.createObjectStore('slides');
  };
  request.onsuccess = () => {
    const db = request.result;
    const transaction = db.transaction('slides', 'readonly');
    const store = transaction.objectStore('slides');
    const choice = store.get('edit-training-dashboard-slide');
    const slides = [store.get('edit-training-0'), store.get('edit-training-1')];
    transaction.oncomplete = () => {
      db.close();
      const index = choice.result;
      if (index !== 0 && index !== 1) return;
      const render = () => {
        if (!document.getElementById('communityFeedbackCarousel')) return false;
        showSlide(index, slides[index].result);
        return true;
      };
      if (render()) return;
      const observer = new MutationObserver(() => { if (render()) observer.disconnect(); });
      observer.observe(document.body, {childList:true, subtree:true});
    };
  };
})();
