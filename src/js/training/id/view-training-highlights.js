document.addEventListener('DOMContentLoaded', () => {
  const panel = document.getElementById('highlights-panel');
  if (!panel) return;
  panel.innerHTML = `
    <div class="training-bottom-grid">
      <article class="training-card">
      <h3>Key Highlights</h3>
      <ul>
      <li>Participants actively engaged during the hands-on demonstration.</li>
      <li>Significant improvement from pre-test to post-test.</li>
      <li>High satisfaction rating for the resource person and training conduct.</li>
      <li>Participants expressed interest in advanced GAP topics.</li>
      </ul>
      </article>
      <article class="training-card">
      <h3>Ways Forward</h3>
      <ul>
      <li>Conduct follow-up training on advanced GAP practices.</li>
      <li>Provide supplementary materials and reference guides.</li>
      <li>Monitor implementation of learned practices in the field.</li>
      <li>Organize site visit to model farms.</li>
      </ul>
      </article>
      </div>
  `;
});
