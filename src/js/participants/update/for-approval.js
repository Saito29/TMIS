document.addEventListener('DOMContentLoaded', () => {
  const seed = [
    [
      'FMR-2026-001',
      'Villa Esperanza FA',
      'Member',
      'Dela Cruz',
      'Juan',
      'Santos',
      'Male',
      'Alabat',
      'Villa Esperanza',
      'For Review',
      2026,
    ],
    [
      'FMR-2026-002',
      'Perez Farmers Association',
      'Member',
      'Santos',
      'Maria',
      'Reyes',
      'Female',
      'Perez',
      'Villamanzano Sur',
      'For Approval',
      2026,
    ],
    [
      'FMR-2025-003',
      'Jomalig Farmers Association',
      'Officer',
      'Reyes',
      'Pedro',
      'Garcia',
      'Male',
      'Jomalig',
      'Apad',
      'Approved',
      2025,
    ],
    [
      'FMR-2026-004',
      'Alabat Farmers Association',
      'Member',
      'Mendoza',
      'Ana',
      'Cruz',
      'Female',
      'Alabat',
      'Villa Norte',
      'For Review',
      2026,
    ],
    [
      'FMR-2024-005',
      'Perez Farmers Association',
      'Member',
      'Ramos',
      'Roberto',
      'Diaz',
      'Male',
      'Perez',
      'Villamanzano Sur',
      'Approved',
      2024,
    ],
    [
      'FMR-2026-006',
      'Patnanungan Agricultural Cooperative',
      'Secretary',
      'Villanueva',
      'Liza',
      'Aquino',
      'Female',
      'Patnanungan',
      'Amaga',
      'For Review',
      2026,
    ],
    [
      'FMR-2025-007',
      'Alabat Farmers Association',
      'Member',
      'Garcia',
      'Elena',
      'Torres',
      'Female',
      'Alabat',
      'Caglate',
      'For Review',
      2025,
    ],
    [
      'FMR-2024-008',
      'Jomalig Farmers Association',
      'Member',
      'Navarro',
      'Rico',
      'Flores',
      'Male',
      'Jomalig',
      'Bukal',
      'For Review',
      2024,
    ],
  ];
  const organizations = [
    'Villa Esperanza FA',
    'Perez Farmers Association',
    'Jomalig Farmers Association',
    'Alabat Farmers Association',
    'Patnanungan Agricultural Cooperative',
  ];
  const municipalities = [
    ['Alabat', 'Villa Esperanza'],
    ['Perez', 'Villamanzano Sur'],
    ['Jomalig', 'Apad'],
    ['Alabat', 'Villa Norte'],
    ['Patnanungan', 'Amaga'],
  ];
  for (let n = 9; n <= 48; n++) {
    const y = 2024 + (n % 3),
      loc = municipalities[n % municipalities.length];
    seed.push([
      `FMR-${y}-${String(n).padStart(3, '0')}`,
      organizations[n % organizations.length],
      n % 6 === 0 ? 'Officer' : 'Member',
      ['Cruz', 'Bautista', 'Mercado', 'Aquino', 'Castillo'][n % 5],
      ['Carlo', 'Grace', 'Noel', 'Irene', 'Paolo'][n % 5],
      'Santos',
      n % 2 ? 'Male' : 'Female',
      loc[0],
      loc[1],
      n % 4 === 0 ? 'For Approval' : n % 7 === 0 ? 'Approved' : 'For Review',
      y,
    ]);
  }
  const records = seed.map(
    (
      [
        id,
        organization,
        role,
        lastName,
        firstName,
        middleName,
        sex,
        municipality,
        barangay,
        status,
        yearCovered,
      ],
      i
    ) => ({
      id,
      organization,
      role,
      lastName,
      firstName,
      middleName,
      suffix: '',
      birthDate: `198${i % 9}-0${(i % 8) + 1}-1${i % 9}`,
      sex,
      civilStatus: i % 2 ? 'Married' : 'Single',
      nationality: 'Filipino',
      placeOfBirth: `${municipality}, Quezon`,
      province: 'Quezon',
      district: ['Jomalig', 'Patnanungan'].includes(municipality)
        ? '1st District'
        : '2nd District',
      municipality,
      barangay,
      sitio: `Purok ${(i % 5) + 1}`,
      fourPs: i % 3 ? 'No' : 'Yes',
      pwd: i % 7 ? 'No' : 'Yes',
      indigenousGroup: ['Jomalig', 'Patnanungan'].includes(municipality)
        ? 'Yes'
        : 'No',
      tribeName: ['Jomalig', 'Patnanungan'].includes(municipality)
        ? 'Agta'
        : '—',
      dietaryRestriction: 'None',
      seniorCitizen: i % 8 ? 'No' : 'Yes',
      yearCovered,
      profileStatus: i % 11 ? 'Active' : 'Inactive',
      status,
      registered: `${yearCovered}-09-${String((i % 20) + 1).padStart(2, '0')}`,
    })
  );
  const $ = (s, c = document) => c.querySelector(s),
    $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const body = $('#forReviewTableBody'),
    empty = $('#reviewTableState'),
    toast = new bootstrap.Toast($('#reviewToast')),
    modal = new bootstrap.Modal($('#reviewForwardModal'));
  const state = {
    page: 1,
    perPage: 10,
    global: '',
    organization: '',
    barangay: '',
    year: '',
    columns: {},
    sort: null,
    selected: null,
  };
  const values = (key) =>
    [...new Set(records.map((r) => r[key]))].sort((a, b) =>
      String(a).localeCompare(String(b), undefined, { numeric: true })
    );
  const fill = (sel, key) => {
    const el = $(sel);
    if (el)
      el.insertAdjacentHTML(
        'beforeend',
        values(key)
          .map((v) => `<option value="${v}">${v}</option>`)
          .join('')
      );
  };
  fill('#organizationFilter', 'organization');
  fill('#barangayFilter', 'barangay');
  fill('#yearCoveredFilter', 'yearCovered');
  $$('select.column-filter').forEach((el) =>
    fill(`[data-column="${el.dataset.column}"]`, el.dataset.column)
  );
  const date = (v) =>
    new Intl.DateTimeFormat('en-PH', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(`${v}T00:00:00`));
  const notify = (title, message, blocked = false) => {
    $('#reviewToastTitle').textContent = title;
    $('#reviewToastMessage').textContent = message;
    $('#reviewToastTime').textContent = new Intl.DateTimeFormat('en-PH', {
      hour: 'numeric',
      minute: '2-digit',
    }).format(new Date());
    $('#reviewToastIcon').className =
      `bi ${blocked ? 'bi-exclamation-triangle-fill' : 'bi-check-circle-fill'}`;
    $('#reviewToast').classList.toggle('review-toast-blocked', blocked);
    toast.show();
  };
  const requirements = (r) => [
    { name: 'Farmer Profiling Form', complete: true },
    { name: 'Valid ID', complete: true },
    {
      name: 'Proof of Farm Ownership / Tenure',
      complete: r.id !== 'FMR-2026-004',
    },
    {
      name: 'Association Membership Document',
      complete: r.id !== 'FMR-2026-006',
    },
    { name: 'Supporting Attachment', complete: true },
  ];
  // FILTER FOR APPROVAL STATUS - This is the key change for for-approval page
  const filtered = () =>
    records.filter(
      (r) =>
        r.status === 'For Approval' &&
        (!state.global ||
          Object.values(r).join(' ').toLowerCase().includes(state.global)) &&
        (!state.organization || r.organization === state.organization) &&
        (!state.barangay || r.barangay === state.barangay) &&
        (!state.year || String(r.yearCovered) === state.year) &&
        Object.entries(state.columns).every(
          ([k, v]) => !v || String(r[k]).toLowerCase().includes(v.toLowerCase())
        )
    );
  const sorted = () => {
    const rows = filtered();
    if (!state.sort) return rows;
    const { key, dir } = state.sort;
    return [...rows].sort((a, b) => {
      const n = String(a[key]).localeCompare(String(b[key]), undefined, {
        numeric: true,
        sensitivity: 'base',
      });
      return dir === 'asc' ? n : -n;
    });
  };
  const pagination = (id, total, pages) => {
    const el = $('#' + id),
      all = state.perPage === 'all',
      start = total ? (all ? 1 : (state.page - 1) * state.perPage + 1) : 0,
      end = all ? total : Math.min(state.page * state.perPage, total);
    const nums = Array.from({ length: pages }, (_, i) => i + 1).filter(
      (n) =>
        pages <= 7 || n === 1 || n === pages || Math.abs(n - state.page) <= 1
    );
    const controls = all
      ? ''
      : `<button data-page="prev" ${state.page === 1 ? 'disabled' : ''}><i class="bi bi-chevron-left"></i></button>${nums.map((n, i) => `${i && n - nums[i - 1] > 1 ? '<span>…</span>' : ''}<button data-page="${n}" class="${n === state.page ? 'active' : ''}">${n}</button>`).join('')}<button data-page="next" ${state.page === pages ? 'disabled' : ''}><i class="bi bi-chevron-right"></i></button>`;
    el.innerHTML = `<span>Showing ${start}–${end} of ${total} farmers</span><div class="pagination-controls"><label class="visually-hidden" for="${id}Rows">Rows per page</label><select id="${id}Rows" data-page-size><option value="10">10</option><option value="25">25</option><option value="50">50</option><option value="100">100</option><option value="all">All</option></select>${controls}</div>`;
    $('[data-page-size]', el).value = state.perPage;
  };
  const render = () => {
    const all = sorted(),
      pages =
        state.perPage === 'all'
          ? 1
          : Math.max(1, Math.ceil(all.length / state.perPage));
    if (state.page > pages) state.page = 1;
    const rows =
      state.perPage === 'all'
        ? all
        : all.slice(
            (state.page - 1) * state.perPage,
            state.page * state.perPage
          );
    body.innerHTML = rows
      .map(
        (r) =>
          `<tr><td><div class="table-row-actions"><button class="btn table-action-button forward-action" data-forward="${r.id}" title="Approve and forward"><i class="bi bi-send-fill"></i></button><a class="btn table-action-button view-action" href="farmer-profile-details.html?id=${encodeURIComponent(r.id)}" title="View farmer profile"><i class="bi bi-eye-fill"></i></a><a class="btn table-action-button edit-action" href="edit-farmer-profile.html?id=${encodeURIComponent(r.id)}" title="Edit farmer profile"><i class="bi bi-pencil-fill"></i></a></div></td><td>${r.id}</td><td>${r.organization}</td><td>${r.role}</td><td>${r.lastName}</td><td>${r.firstName}</td><td>${r.middleName}</td><td>—</td><td>${date(r.birthDate)}</td><td>${r.sex}</td><td>${r.civilStatus}</td><td>${r.nationality}</td><td>${r.placeOfBirth}</td><td>${r.province}</td><td>${r.district}</td><td>${r.municipality}</td><td>${r.barangay}</td><td>${r.sitio}</td><td>${r.fourPs}</td><td>${r.pwd}</td><td>${r.indigenousGroup}</td><td>${r.tribeName}</td><td>${r.dietaryRestriction}</td><td>${r.seniorCitizen}</td><td>${r.yearCovered}</td><td>${date(r.registered)}</td><td><span class="status-badge status-review">${r.profileStatus}</span></td><td><span class="status-badge status-approval">${r.status}</span></td></tr>`
      )
      .join('');
    empty.hidden = Boolean(rows.length);
    if (!rows.length)
      empty.innerHTML =
        '<i class="bi bi-search"></i><strong>No farmer profiles match the current filters.</strong>';
    $('#summaryTotalReview').textContent = filtered().length;
    $('#summaryRowsPerPage').textContent = state.perPage;
    $('#summaryVisibleRows').textContent = rows.length;
    pagination('reviewPaginationTop', all.length, pages);
    pagination('reviewPaginationBottom', all.length, pages);
    $$('.sortable-column').forEach((h) => {
      const active = state.sort?.key === h.dataset.sort;
      h.querySelector('i').className =
        `bi ${active ? (state.sort.dir === 'asc' ? 'bi-sort-up' : 'bi-sort-down') : 'bi-arrow-down-up'}`;
    });
  };
  const refresh = () => {
    state.page = 1;
    render();
  };
  $('#reviewGlobalSearch').addEventListener('input', (e) => {
    state.global = e.target.value.toLowerCase();
    refresh();
  });
  [
    ['#organizationFilter', 'organization'],
    ['#barangayFilter', 'barangay'],
    ['#yearCoveredFilter', 'year'],
  ].forEach(([s, k]) =>
    $(s).addEventListener('change', (e) => {
      state[k] = e.target.value;
      refresh();
    })
  );
  $$('.column-filter').forEach((el) =>
    el.addEventListener('input', (e) => {
      state.columns[e.target.dataset.column] = e.target.value;
      refresh();
    })
  );
  $('#clearReviewFilters').addEventListener('click', () => {
    state.global = state.organization = state.barangay = state.year = '';
    state.columns = {};
    $('#reviewGlobalSearch').value = '';
    $$('.toolbar-filter select,.column-filter').forEach((e) => (e.value = ''));
    refresh();
  });
  $$('.sortable-column').forEach((h) =>
    h.addEventListener('click', () => {
      state.sort =
        state.sort?.key === h.dataset.sort
          ? {
              key: h.dataset.sort,
              dir: state.sort.dir === 'asc' ? 'desc' : 'asc',
            }
          : { key: h.dataset.sort, dir: 'asc' };
      refresh();
    })
  );
  $$('#reviewPaginationTop,#reviewPaginationBottom').forEach((el) => {
    el.addEventListener('click', (e) => {
      const b = e.target.closest('[data-page]');
      if (!b || b.disabled) return;
      const pages =
        state.perPage === 'all'
          ? 1
          : Math.max(1, Math.ceil(sorted().length / state.perPage));
      state.page =
        b.dataset.page === 'prev'
          ? state.page - 1
          : b.dataset.page === 'next'
            ? Math.min(pages, state.page + 1)
            : Number(b.dataset.page);
      render();
    });
    el.addEventListener('change', (e) => {
      if (e.target.matches('[data-page-size]')) {
        state.perPage =
          e.target.value === 'all' ? 'all' : Number(e.target.value);
        refresh();
      }
    });
  });
  body.addEventListener('click', (e) => {
    const b = e.target.closest('[data-forward]');
    if (!b) return;
    state.selected = records.find((r) => r.id === b.dataset.forward);
    const reqs = requirements(state.selected),
      missing = reqs.filter((x) => !x.complete);
    $('#reviewForwardModalLabel').textContent =
      'Approve Farmer Profile';
    $('#reviewForwardDetails').innerHTML =
      `<dt>Farmer ID / Core ID</dt><dd>${state.selected.id}</dd><dt>Farmer</dt><dd>${state.selected.firstName} ${state.selected.lastName}</dd><dt>Farmer Status</dt><dd><span class="status-badge status-approval">${state.selected.status}</span></dd><dt class="w-100 mt-3">Requirements / Attachments</dt><dd class="w-100"><div class="requirements-panel"><ul>${reqs.map((x) => `<li><i class="bi ${x.complete ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'}"></i>${x.name}<span>${x.complete ? 'Completed' : 'Incomplete'}</span></li>`).join('')}</ul>${missing.length ? `<p class="submission-blocked">Submission blocked: ${missing.map((x) => x.name).join(', ')} is incomplete.</p>` : ''}</div></dd>`;
    $('#confirmForwardButton').disabled = missing.length > 0;
    modal.show();
  });
  $('#confirmForwardButton').addEventListener('click', () => {
    if (!state.selected) return;
    const missing = requirements(state.selected).filter((x) => !x.complete);
    if (missing.length) {
      notify(
        'Submission Blocked',
        'Submission blocked: required attachment is incomplete.',
        true
      );
      return;
    }
    // Move to "For Acceptance" status
    state.selected.status = 'For Acceptance';
    modal.hide();
    refresh();
    notify(
      'Farmer Profile Approved',
      'Farmer profile approved and submitted for acceptance.'
    );
  });
  $('#refreshReviewTable').addEventListener('click', () => {
    refresh();
    notify(
      'Farmer Profiles Refreshed',
      'Farmer profiles refreshed successfully.'
    );
  });
  $('#exportReviewTable').addEventListener('click', () => {
    if (!window.XLSX) return;
    const rows = sorted();
    const sheet = XLSX.utils.aoa_to_sheet([
      ['farmer_profile_for_approval'],
      ['data_exported'],
      [],
    ]);
    XLSX.utils.sheet_add_json(sheet, rows, { origin: 'A4' });
    const book = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(book, sheet, 'farmer_profile_for_approval');
    XLSX.writeFile(book, 'farmer_profile_for_approval.xlsx');
  });
  render();
});