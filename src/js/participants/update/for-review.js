// FOR REVIEW TABLE MODULE: client-side records, filters, ordering, pagination, workflow actions, and export.
document.addEventListener('DOMContentLoaded', () => {
  const records = [
    { id: 'TRN-2026-001', title: 'Climate-Smart Rice Production', type: 'Technical Training', date: '2026-09-24', location: 'DA Training Center', municipality: 'Lucena City', province: 'Quezon', trainer: 'Dr. Maria Santos', participants: 35, submitted: '2026-09-14', status: 'For Review' },
    { id: 'TRN-2026-002', title: 'Organic Vegetable Farming', type: 'Technical Training', date: '2026-09-28', location: 'Candelaria Gymnasium', municipality: 'Candelaria', province: 'Quezon', trainer: 'Engr. Ramon Cruz', participants: 28, submitted: '2026-09-15', status: 'For Review' },
    { id: 'TRN-2026-003', title: 'Farm Financial Management', type: 'Capability Building', date: '2026-10-03', location: 'Tiaong Municipal Hall', municipality: 'Tiaong', province: 'Quezon', trainer: 'Ms. Lea Mendoza', participants: 42, submitted: '2026-09-15', status: 'For Review' },
    { id: 'TRN-2026-004', title: 'Post-Harvest Handling', type: 'Technical Training', date: '2026-10-08', location: 'Sariaya Agri Hub', municipality: 'Sariaya', province: 'Quezon', trainer: 'Mr. Noel Garcia', participants: 30, submitted: '2026-09-16', status: 'For Review' },
    { id: 'TRN-2026-005', title: 'Digital Marketing for Farmers', type: 'Capability Building', date: '2026-10-11', location: 'Tayabas Convention Center', municipality: 'Tayabas City', province: 'Quezon', trainer: 'Ms. Karen Lim', participants: 25, submitted: '2026-09-16', status: 'For Review' },
    { id: 'TRN-2026-006', title: 'Coconut Value-Adding Workshop', type: 'Skills Training', date: '2026-10-15', location: 'Gumaca People’s Hall', municipality: 'Gumaca', province: 'Quezon', trainer: 'Mr. Carlo Reyes', participants: 38, submitted: '2026-09-17', status: 'For Review' },
    { id: 'TRN-2026-007', title: 'Integrated Pest Management', type: 'Technical Training', date: '2026-10-18', location: 'Mauban Civic Center', municipality: 'Mauban', province: 'Quezon', trainer: 'Dr. Ana Villanueva', participants: 32, submitted: '2026-09-17', status: 'For Review' },
    { id: 'TRN-2026-008', title: 'Farmers Association Leadership', type: 'Capability Building', date: '2026-10-22', location: 'Infanta Training Hall', municipality: 'Infanta', province: 'Quezon', trainer: 'Mr. Joel Ramos', participants: 45, submitted: '2026-09-18', status: 'For Review' },
    { id: 'TRN-2026-009', title: 'Good Agricultural Practices', type: 'Technical Training', date: '2026-10-25', location: 'Lopez Municipal Gym', municipality: 'Lopez', province: 'Quezon', trainer: 'Engr. Sofia Diaz', participants: 40, submitted: '2026-09-18', status: 'For Review' },
    { id: 'TRN-2026-010', title: 'Food Processing and Packaging', type: 'Skills Training', date: '2026-11-02', location: 'Lucban Covered Court', municipality: 'Lucban', province: 'Quezon', trainer: 'Ms. Irene Flores', participants: 26, submitted: '2026-09-18', status: 'For Review' },
    { id: 'TRN-2026-011', title: 'Livestock Health Management', type: 'Technical Training', date: '2026-11-06', location: 'Pagbilao Agri Center', municipality: 'Pagbilao', province: 'Quezon', trainer: 'Dr. Paulo Torres', participants: 31, submitted: '2026-09-18', status: 'For Review' },
    { id: 'TRN-2026-012', title: 'Community-Based Seed Banking', type: 'Skills Training', date: '2026-11-10', location: 'Atimonan Multi-purpose Hall', municipality: 'Atimonan', province: 'Quezon', trainer: 'Ms. Grace Aquino', participants: 36, submitted: '2026-09-18', status: 'For Review' }
  ];
  // Deterministic demo records keep the full table usable without a live API.
  // They deliberately span types, years, locations, and trainers for filter testing.
  const demoTopics = [
    'Rice Production', 'Vegetable Farming', 'Financial Literacy', 'Basic Bookkeeping',
    'Enterprise Development', 'Coconut Processing', 'Poultry Production', 'Farm Machinery Safety',
    'Post-Harvest Management', 'Digital Marketing', 'Organic Fertilizer Making', 'Cooperative Leadership'
  ];
  const demoTypes = ['Technical Training', 'Livelihood Training', 'Financial Literacy', 'Bookkeeping', 'Entrepreneurship', 'Agricultural Training', 'Capacity Building', 'Skills Training'];
  const demoSites = [
    ['Baybay City Agriculture Office', 'Baybay City', 'Leyte'], ['Davao del Sur Provincial Training Center', 'Digos City', 'Davao del Sur'],
    ['Bohol Farmers Training Hall', 'Carmen', 'Bohol'], ['Nueva Ecija Agri-Park', 'Muñoz', 'Nueva Ecija'],
    ['Bukidnon State University Extension Hall', 'Malaybalay City', 'Bukidnon'], ['Iloilo Provincial Capitol Training Room', 'Pototan', 'Iloilo'],
    ['Benguet Agri Center', 'La Trinidad', 'Benguet'], ['Isabela Multi-Purpose Hall', 'Ilagan City', 'Isabela'],
    ['Camarines Sur Livelihood Center', 'Pili', 'Camarines Sur'], ['Negros Occidental Farmers Hub', 'Kabankalan City', 'Negros Occidental'],
    ['North Cotabato Training Pavilion', 'Kidapawan City', 'Cotabato'], ['Palawan State University Extension Center', 'Puerto Princesa City', 'Palawan']
  ];
  const demoTrainers = ['Dr. Liza Manalo', 'Engr. Victor dela Cruz', 'Ms. Aileen Bautista', 'Mr. Jerome Navarro', 'Dr. Celeste Ramos', 'Ms. Rina Mercado', 'Mr. Dennis Valdez', 'Engr. Faith Castillo', 'Ms. Hazel Soriano', 'Dr. Mark Villareal', 'Mr. Paolo Bernardo', 'Ms. Teresa Lacuesta'];
  for (let index = 13; index <= 120; index += 1) {
    const offset = index - 13;
    const year = 2024 + (offset % 3);
    const month = String((offset * 3 % 12) + 1).padStart(2, '0');
    const day = String((offset * 7 % 25) + 1).padStart(2, '0');
    const submittedDay = String(Math.max(1, Number(day) - ((offset % 5) + 1))).padStart(2, '0');
    const site = demoSites[offset % demoSites.length];
    records.push({
      id: `DEMO-TRN-${year}-${String(index).padStart(3, '0')}`,
      title: `Demo ${demoTopics[offset % demoTopics.length]} Workshop ${Math.floor(offset / demoTopics.length) + 1}`,
      type: demoTypes[offset % demoTypes.length],
      date: `${year}-${month}-${day}`,
      location: site[0], municipality: site[1], province: site[2],
      trainer: demoTrainers[offset % demoTrainers.length],
      participants: 18 + ((offset * 7) % 53),
      submitted: `${year}-${month}-${submittedDay}`,
      status: 'For Review'
    });
  }
  const state = { page: 1, perPage: 10, global: '', type: '', year: '', columns: {}, sorts: [], selectedId: null };
  const $ = (selector, context = document) => context.querySelector(selector);
  const $$ = (selector, context = document) => [...context.querySelectorAll(selector)];
  const body = $('#forReviewTableBody');
  const stateBox = $('#reviewTableState');
  const forwardModal = new bootstrap.Modal($('#reviewForwardModal'));
  const toast = new bootstrap.Toast($('#reviewToast'));
  ['#reviewForwardModal'].forEach((selector) => {
    $(selector).addEventListener('show.bs.modal', () => document.body.classList.add('review-modal-open'));
    $(selector).addEventListener('hidden.bs.modal', () => document.body.classList.remove('review-modal-open'));
  });
  $$('[data-bs-toggle="tooltip"]').forEach((element) => new bootstrap.Tooltip(element));

  const formatDate = (value) => new Intl.DateTimeFormat('en-PH', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(`${value}T00:00:00`));
  const unique = (key) => [...new Set(records.map((record) => record[key]))].sort();
  const populateSelect = (selector, values) => $(selector).insertAdjacentHTML('beforeend', values.map((value) => `<option value="${value}">${value}</option>`).join(''));
  populateSelect('#trainingTypeFilter', unique('type'));
  populateSelect('#yearFilter', [...new Set(records.map((record) => record.date.slice(0, 4)))].sort().reverse());
  populateSelect('[data-column="type"]', unique('type'));
  populateSelect('[data-column="municipality"]', unique('municipality'));
  populateSelect('[data-column="province"]', unique('province'));

  const filteredRecords = () => records.filter((record) => {
    const haystack = Object.values(record).join(' ').toLowerCase();
    // This queue defaults to records in For Review; the Status footer filter
    // can still be used to inspect a record after it has been forwarded.
    if (!state.columns.status && record.status !== 'For Review') return false;
    if (state.global && !haystack.includes(state.global.toLowerCase())) return false;
    if (state.type && record.type !== state.type) return false;
    if (state.year && !record.date.startsWith(state.year)) return false;
    return Object.entries(state.columns).every(([key, value]) => {
      if (!value) return true;
      return String(record[key]).toLowerCase().includes(String(value).toLowerCase());
    });
  });

  const sortedRecords = () => {
    const result = filteredRecords();
    if (!state.sorts.length) return result;
    return [...result].sort((left, right) => {
      for (const { key, direction } of state.sorts) {
        const leftValue = left[key];
        const rightValue = right[key];
        const comparison = typeof leftValue === 'number'
          ? leftValue - rightValue
          : String(leftValue).localeCompare(String(rightValue), undefined, { numeric: true, sensitivity: 'base' });
        if (comparison) return direction === 'asc' ? comparison : -comparison;
      }
      return 0;
    });
  };

  const syncWorkflowTotals = () => {
    const totals = records.reduce((result, record) => {
      result[record.status] = (result[record.status] || 0) + 1;
      return result;
    }, {});
    const workflowCounts = {
      'training-total': totals['For Review'] || 0,
      'training-total-approval': totals['For Approval'] || 0,
      'training-total-acceptance': totals['For Acceptance'] || 0,
      'training-total-approved': totals.Approved || 0,
      'training-total-rejected': totals.Rejected || 0
    };
    Object.entries(workflowCounts).forEach(([id, total]) => {
      const element = document.getElementById(id);
      if (element) element.textContent = total;
    });
    $('#summaryTotalReview').textContent = workflowCounts['training-total'];
  };

  const pageItems = (page, totalPages) => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, index) => index + 1);
    const items = [1];
    if (page > 3) items.push('…');
    for (let number = Math.max(2, page - 1); number <= Math.min(totalPages - 1, page + 1); number += 1) items.push(number);
    if (page < totalPages - 2) items.push('…');
    items.push(totalPages);
    return [...new Set(items)];
  };

  const renderPagination = (container, total) => {
    const totalPages = state.perPage === 'all' ? 1 : Math.max(1, Math.ceil(total / state.perPage));
    const start = total ? (state.perPage === 'all' ? 1 : ((state.page - 1) * state.perPage) + 1) : 0;
    const end = state.perPage === 'all' ? total : Math.min(state.page * state.perPage, total);
    container.innerHTML = `<span>Showing ${start}–${end} of ${total} record${total === 1 ? '' : 's'}</span><div class="pagination-controls"><label class="visually-hidden" for="${container.id}Rows">Rows per page</label><select id="${container.id}Rows" data-pagination-size><option value="10">10</option><option value="20">20</option><option value="50">50</option><option value="100">100</option><option value="500">500</option><option value="all">All</option></select><button type="button" data-page="prev" ${state.page === 1 || state.perPage === 'all' ? 'disabled' : ''} aria-label="Previous page"><i class="bi bi-chevron-left"></i></button>${pageItems(state.page, totalPages).map((item) => item === '…' ? '<span class="px-1">…</span>' : `<button type="button" data-page="${item}" class="${item === state.page ? 'active' : ''}" ${state.perPage === 'all' ? 'disabled' : ''}>${item}</button>`).join('')}<button type="button" data-page="next" ${state.page === totalPages || state.perPage === 'all' ? 'disabled' : ''} aria-label="Next page"><i class="bi bi-chevron-right"></i></button></div>`;
    $('[data-pagination-size]', container).value = state.perPage;
  };

  const render = () => {
    const filtered = sortedRecords();
    const totalPages = state.perPage === 'all' ? 1 : Math.max(1, Math.ceil(filtered.length / state.perPage));
    state.page = Math.min(state.page, totalPages);
    const visible = state.perPage === 'all' ? filtered : filtered.slice((state.page - 1) * state.perPage, state.page * state.perPage);
    body.innerHTML = visible.map((record) => `<tr><td><div class="table-row-actions"><button class="btn table-action-button forward-action" data-action="forward" data-id="${record.id}" data-bs-toggle="tooltip" data-bs-title="Review and forward" aria-label="Review and forward ${record.id}"><i class="bi bi-send-fill"></i></button><button class="btn table-action-button view-action" data-action="view" data-id="${record.id}" data-bs-toggle="tooltip" data-bs-title="View training details" aria-label="View ${record.id}"><i class="bi bi-eye-fill"></i></button><a class="btn table-action-button edit-action" href="edit_training.html?id=${encodeURIComponent(record.id)}" data-bs-toggle="tooltip" data-bs-title="Edit training" aria-label="Edit ${record.id}"><i class="bi bi-pencil-fill"></i></a></div></td><td>${record.id}</td><td>${record.title}</td><td>${record.type}</td><td>${formatDate(record.date)}</td><td>${record.location}</td><td>${record.municipality}</td><td>${record.province}</td><td>${record.trainer}</td><td>${record.participants}</td><td>${formatDate(record.submitted)}</td><td><span class="status-badge ${record.status === 'For Review' ? 'status-review' : 'status-approval'}">${record.status}</span></td></tr>`).join('');
    stateBox.hidden = filtered.length > 0;
    if (!filtered.length) stateBox.innerHTML = `<i class="bi bi-search"></i><strong>${records.length ? 'No records match the current filters.' : 'No training records are currently available for review.'}</strong><br><span>Adjust or clear your filters and try again.</span>`;
    syncWorkflowTotals();
    $('#summaryRowsPerPage').textContent = state.perPage === 'all' ? 'All' : state.perPage;
    $('#summaryVisibleRows').textContent = visible.length;
    renderPagination($('#reviewPaginationTop'), filtered.length);
    renderPagination($('#reviewPaginationBottom'), filtered.length);
    $$('.sortable-column').forEach((header) => {
      const sort = state.sorts.find((item) => item.key === header.dataset.sort);
      header.setAttribute('aria-sort', sort ? (sort.direction === 'asc' ? 'ascending' : 'descending') : 'none');
      header.classList.toggle('is-sorted', Boolean(sort));
      header.querySelector('i').className = `bi ${sort ? (sort.direction === 'asc' ? 'bi-sort-up' : 'bi-sort-down') : 'bi-arrow-down-up'}`;
    });
    $$('[data-bs-toggle="tooltip"]', body).forEach((element) => new bootstrap.Tooltip(element));
  };

  const showToast = (message) => { $('#reviewToastMessage').textContent = message; toast.show(); };
  const selected = () => records.find((record) => record.id === state.selectedId);
  const openForward = (record) => {
    state.selectedId = record.id;
    const fields = [['Training ID', record.id], ['Training title', record.title], ['Training type', record.type], ['Training date', formatDate(record.date)], ['Location', `${record.location}, ${record.municipality}, ${record.province}`], ['Trainer / resource person', record.trainer], ['Participant count', record.participants], ['Current status', record.status]];
    $('#reviewForwardDetails').innerHTML = fields.map(([label, value]) => `<dt>${label}</dt><dd>${value}</dd>`).join('');
    forwardModal.show();
  };
  $('#reviewGlobalSearch').addEventListener('input', (event) => { state.global = event.target.value; state.page = 1; render(); });
  $('#trainingTypeFilter').addEventListener('change', (event) => { state.type = event.target.value; state.page = 1; render(); });
  $('#yearFilter').addEventListener('change', (event) => { state.year = event.target.value; state.page = 1; render(); });
  $$('.column-filter').forEach((input) => input.addEventListener('input', (event) => { state.columns[event.target.dataset.column] = event.target.value; state.page = 1; render(); }));
  $('#clearReviewFilters').addEventListener('click', () => { state.global = ''; state.type = ''; state.year = ''; state.columns = {}; state.page = 1; $('#reviewGlobalSearch').value = ''; $('#trainingTypeFilter').value = ''; $('#yearFilter').value = ''; $$('.column-filter').forEach((input) => { input.value = ''; }); render(); });
  $('#refreshReviewTable').addEventListener('click', () => { body.innerHTML = ''; stateBox.hidden = false; stateBox.innerHTML = '<i class="bi bi-arrow-clockwise"></i><strong>Refreshing training records…</strong>'; window.setTimeout(() => { render(); showToast('Training records refreshed.'); }, 350); });
  $('#exportReviewTable').addEventListener('click', () => { const exportRows = sortedRecords().map(({ id, title, type, date, location, municipality, province, trainer, participants, submitted, status }) => ({ 'Training ID': id, 'Training Title': title, 'Training Type': type, 'Training Date': date, Location: location, Municipality: municipality, Province: province, 'Trainer / Resource Person': trainer, 'No. of Participants': participants, 'Date Submitted': submitted, Status: status })); if (!exportRows.length) { showToast('There are no filtered records to export.'); return; } if (window.XLSX) { const sheet = XLSX.utils.json_to_sheet(exportRows); const book = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(book, sheet, 'For Review'); XLSX.writeFile(book, 'TMIS_For_Review.xlsx'); showToast('Filtered training records exported to Excel.'); } else { showToast('Excel export is unavailable. Please check your internet connection and try again.'); } });
  $$('#reviewPaginationTop, #reviewPaginationBottom').forEach((container) => container.addEventListener('click', (event) => { const button = event.target.closest('[data-page]'); if (!button || button.disabled) return; const totalPages = Math.max(1, Math.ceil(filteredRecords().length / (state.perPage === 'all' ? 1 : state.perPage))); state.page = button.dataset.page === 'prev' ? Math.max(1, state.page - 1) : button.dataset.page === 'next' ? Math.min(totalPages, state.page + 1) : Number(button.dataset.page); render(); }));
  $$('#reviewPaginationTop, #reviewPaginationBottom').forEach((container) => container.addEventListener('change', (event) => { if (!event.target.matches('[data-pagination-size]')) return; state.perPage = event.target.value === 'all' ? 'all' : Number(event.target.value); state.page = 1; render(); }));
  body.addEventListener('click', (event) => { const button = event.target.closest('[data-action]'); if (!button) return; const record = records.find((item) => item.id === button.dataset.id); if (button.dataset.action === 'forward') openForward(record); if (button.dataset.action === 'view') window.location.href = `training_details.html?id=${encodeURIComponent(record.id)}`; });
  const sortColumn = (header, append) => {
    const key = header.dataset.sort;
    const existing = state.sorts.find((item) => item.key === key);
    if (!append) state.sorts = existing ? [existing] : [];
    if (existing) existing.direction = existing.direction === 'asc' ? 'desc' : 'asc';
    else state.sorts.push({ key, direction: 'asc' });
    state.page = 1;
    render();
  };
  $$('.sortable-column').forEach((header) => {
    header.addEventListener('click', (event) => sortColumn(header, event.shiftKey));
    header.addEventListener('keydown', (event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); sortColumn(header, event.shiftKey); } });
  });
  $('#confirmForwardButton').addEventListener('click', () => { const record = selected(); if (!record) return; if (!window.confirm(`Forward ${record.id} for approval?`)) return; record.status = 'For Approval'; forwardModal.hide(); render(); showToast(`${record.id} was forwarded for approval.`); });
  render();
});
