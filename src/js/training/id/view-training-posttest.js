document.addEventListener('DOMContentLoaded', () => {
  const panel = document.getElementById('posttest-panel');
  const items = window.trainingAssessments?.list('posttest') || [];
  if (!panel) return;

  const roster = [
    ['Juan Santos Dela Cruz', 'FMR-2025-001'], ['Pedro Garcia Reyes', 'FMR-2025-002'],
    ['Carlo Ramos Mendoza', 'FMR-2025-003'], ['Maria Reyes Santos', 'FMR-2025-004'],
    ['Rogelio Cruz Bautista', 'FMR-2025-005'], ['Antonio Lopez Ramos', 'FMR-2025-006'],
    ['Jose Aquino Garcia', 'FMR-2025-007'], ['Roberto Diaz Flores', 'FMR-2025-008'],
    ['Ana Cruz Villanueva', 'FMR-2025-009'], ['Mark Santos Navarro', 'FMR-2025-010'],
    ['Noel Mercado Castillo', 'FMR-2025-011'], ['Daniel Reyes Aquino', 'FMR-2025-012'],
    ['Paolo Cruz Mercado', 'FMR-2025-013'], ['Francisco Garcia Torres', 'FMR-2025-014'],
    ['Emmanuel Ramos Perez', 'FMR-2025-015'], ['Elena Santos Lopez', 'FMR-2025-016'],
    ['Rico Bautista Domingo', 'FMR-2025-017'], ['Eduardo Diaz Cruz', 'FMR-2025-018'],
    ['Rommel Aquino Rivera', 'FMR-2025-019'], ['Nestor Reyes Fernandez', 'FMR-2025-020'],
    ['Grace Mercado Gonzales', 'FMR-2025-021'], ['Joel Cruz Salazar', 'FMR-2025-022'],
    ['Albert Flores Pascual', 'FMR-2025-023'], ['Michael Ramos Valdez', 'FMR-2025-024'],
  ];
  const escape = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const trainingTitle = document.querySelector('#overview-panel .training-title-row h2')?.textContent.trim() || 'Training';
  // Example participant scores. The questionnaire metadata has no individual scores yet.
  const scoreRows = items.map((item, itemIndex) => {
    if (!item.itemCount || item.averageCorrect === null) return [];
    const count = itemIndex === 0 ? 20 : roster.length;
    const target = Math.round(item.averageCorrect * count);
    const scores = Array.from({length:count}, (_, index) => Math.max(0, Math.min(item.itemCount, Math.round(item.averageCorrect) + (index % 5) - 2)));
    let difference = target - scores.reduce((sum, score) => sum + score, 0);
    for (let cursor = 0; difference !== 0 && cursor < count * item.itemCount; cursor++) {
      const index = cursor % count;
      const adjustment = Math.sign(difference);
      if (scores[index] + adjustment < 0 || scores[index] + adjustment > item.itemCount) continue;
      scores[index] += adjustment;
      difference -= adjustment;
    }
    return roster.slice(0, count).map(([name, id], index) => ({name, id, score:scores[index]}));
  });
  let selectedIndex = 0;
  let search = '';
  panel.innerHTML = `<section class="posttest-results-card training-card" aria-labelledby="posttestResultsTitle"><header class="training-evaluation-header"><div class="training-evaluation-heading"><span class="training-evaluation-icon"><i class="bi bi-file-earmark-text" aria-hidden="true"></i></span><div><span class="training-evaluation-eyebrow">Knowledge assessment</span><h2 id="posttestResultsTitle">Post-Test Questionnaires</h2><p>View participant scores for the selected post-test.</p></div></div><div class="posttest-select-wrap"><label for="posttestQuestionnaireSelect">Post-test questionnaire</label><select id="posttestQuestionnaireSelect" class="form-select">${items.map((item, index) => `<option value="${index}">${escape(item.name)}</option>`).join('')}</select></div></header>${items.length ? `<div class="posttest-selected-heading"><span class="posttest-selected-icon"><i class="bi bi-journal-check" aria-hidden="true"></i></span><div><strong id="posttestSelectedTitle"></strong><small id="posttestSelectedMeta"></small></div><span class="training-evaluation-sample">Sample participant scores</span></div><div class="training-evaluation-summary"><div><span>Participants scored</span><strong id="posttestParticipantCount"></strong></div><div><span>Questionnaire items</span><strong id="posttestItemCount"></strong></div><div><span>Average score</span><strong id="posttestAverageScore"></strong></div></div><div class="posttest-table-toolbar"><div><h3>Participant results</h3><p>Scores are shown for the selected questionnaire only.</p></div><label class="posttest-search"><i class="bi bi-search" aria-hidden="true"></i><span class="visually-hidden">Search participants</span><input id="posttestParticipantSearch" class="form-control" type="search" placeholder="Search participant" autocomplete="off"></label></div><div class="training-evaluation-table-wrap table-responsive"><table class="table posttest-results-table"><thead><tr><th scope="col">Participant full name</th><th scope="col">Training title</th><th scope="col">Post-test score</th><th scope="col">Percentage</th></tr></thead><tbody id="posttestResultsBody"></tbody></table></div><p id="posttestResultsCount" class="posttest-results-count" role="status" aria-live="polite"></p>` : '<div class="posttest-empty">No post-test questionnaires are linked to this training.</div>'}</section>`;
  if (!items.length) return;
  const $ = selector => panel.querySelector(selector);
  function render() {
    const item = items[selectedIndex];
    const rows = scoreRows[selectedIndex];
    const average = rows.length ? rows.reduce((sum, row) => sum + row.score, 0) / rows.length : null;
    const shown = rows.filter(row => `${row.name} ${row.id}`.toLowerCase().includes(search));
    $('#posttestQuestionnaireSelect').value = String(selectedIndex);
    $('#posttestSelectedTitle').textContent = item.name;
    $('#posttestSelectedMeta').textContent = `${item.id} Â· ${trainingTitle}`;
    $('#posttestParticipantCount').innerHTML = `${rows.length} <small>/ ${roster.length}</small>`;
    $('#posttestItemCount').textContent = item.itemCount ?? 'â€”';
    $('#posttestAverageScore').innerHTML = average === null ? 'No scores yet' : `${average.toFixed(2)} <small>/ ${item.itemCount} (${(average / item.itemCount * 100).toFixed(1)}%)</small>`;
    $('#posttestResultsBody').innerHTML = shown.length ? shown.map((row, index) => `<tr><th scope="row"><span class="posttest-row-number">${String(index + 1).padStart(2,'0')}</span><span><strong>${escape(row.name)}</strong><small>${escape(row.id)}</small></span></th><td>${escape(trainingTitle)}</td><td><span class="posttest-score">${row.score} <small>/ ${item.itemCount}</small></span></td><td>${(row.score / item.itemCount * 100).toFixed(1)}%</td></tr>`).join('') : `<tr><td colspan="4" class="posttest-empty">${rows.length ? 'No participants match your search.' : 'No participant scores are available for this questionnaire.'}</td></tr>`;
    $('#posttestResultsCount').textContent = `Showing ${shown.length} of ${rows.length} scored participants`;
  }
  $('#posttestQuestionnaireSelect').addEventListener('change', event => { selectedIndex = Number(event.target.value); search = ''; $('#posttestParticipantSearch').value = ''; render(); });
  $('#posttestParticipantSearch').addEventListener('input', event => { search = event.target.value.trim().toLowerCase(); render(); });
  render();
});


