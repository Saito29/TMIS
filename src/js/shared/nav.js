/* Shared header and mobile navigation behavior. */
document.addEventListener('DOMContentLoaded', () => {
  const mobileMainCollapses = {
    participantMobile: ['createParticipantMobile', 'updateParticipantMobile', 'detailsParticipantMobile', 'createFarmerAssociationMobile', 'detailsFarmerAssociationMobile'],
    trainingMobile: ['createTrainingMobile', 'updateTrainingMobile', 'detailsTrainingMobile', 'createFacilitatorRpMobile', 'detailsFacilitatorRpMobile'],
    evaluationMobile: ['createEvaluationMobile', 'encodeEvaluationMobile', 'encodedResultsMobile', 'detailsEvaluationMobile'],
    administrationMobile: ['createAdministrationMobile', 'updateAdministrationMobile', 'detailsAdministrationMobile'],
  };
  const headerMainCollapses = {
    participantHeaderCollapse: ['createParticipantHeaderCollapse', 'updateParticipantHeaderCollapse', 'detailsParticipantHeaderCollapse', 'createFarmerAssociationHeaderCollapse', 'detailsFarmerAssociationHeaderCollapse'],
    trainingHeaderCollapse: ['createTrainingHeaderCollapse', 'updateTrainingHeaderCollapse', 'detailsTrainingHeaderCollapse', 'createFacilitatorRpHeaderCollapse', 'detailsFacilitatorRpHeaderCollapse'],
    evaluationHeaderCollapse: ['createEvaluationHeaderCollapse', 'encodeEvaluationHeaderCollapse', 'encodedResultsHeaderCollapse', 'detailsEvaluationHeaderCollapse'],
    administrationHeaderCollapse: ['createAdministrationHeaderCollapse', 'updateAdministrationHeaderCollapse', 'detailsAdministrationHeaderCollapse'],
  };

  const notificationDetailModal = document.getElementById('notificationDetailModal');
  const updateUnreadNotificationCount = () => {
    const unreadCount = document.querySelectorAll('.notification-menu-item.is-unread').length;
    const notificationCount = document.querySelector('.notification-count');
    const notificationSubtitle = document.querySelector('.notification-menu-subtitle');
    if (notificationCount) {
      notificationCount.textContent = unreadCount;
      notificationCount.hidden = unreadCount === 0;
    }
    if (notificationSubtitle) notificationSubtitle.textContent = `${unreadCount} unread update${unreadCount === 1 ? '' : 's'}`;
  };

  document.querySelectorAll('.notification-menu-item').forEach((item) => {
    item.addEventListener('click', () => {
      const { notificationType, notificationTime, notificationTitle, notificationDescription, notificationAction } = item.dataset;
      const detailFields = {
        notificationDetailType: notificationType,
        notificationDetailTime: notificationTime,
        notificationDetailModalLabel: notificationTitle,
        notificationDetailDescription: notificationDescription,
        notificationDetailAction: notificationAction,
      };
      Object.entries(detailFields).forEach(([id, value]) => {
        const field = document.getElementById(id);
        if (field) field.textContent = value;
      });
      item.classList.remove('is-unread');
      updateUnreadNotificationCount();
    });
  });

  document.querySelector('.notification-mark-read')?.addEventListener('click', () => {
    document.querySelectorAll('.notification-menu-item.is-unread').forEach((item) => item.classList.remove('is-unread'));
    updateUnreadNotificationCount();
  });
  document.querySelector('.notification-clear-all')?.addEventListener('click', () => {
    const notificationMenuList = document.querySelector('.notification-menu-list');
    if (!notificationMenuList) return;
    notificationMenuList.replaceChildren();
    const emptyState = document.createElement('p');
    emptyState.className = 'notification-empty-state';
    emptyState.textContent = 'You have no notifications.';
    notificationMenuList.append(emptyState);
    updateUnreadNotificationCount();
  });
  notificationDetailModal?.addEventListener('show.bs.modal', () => document.body.classList.add('notification-modal-open'));
  notificationDetailModal?.addEventListener('hidden.bs.modal', () => {
    document.body.classList.remove('notification-modal-open');
    document.querySelector('.notification-btn')?.focus();
  });

  const hideCollapse = (element) => {
    if (!element?.classList.contains('show') || typeof bootstrap === 'undefined') return;
    bootstrap.Collapse.getOrCreateInstance(element, { toggle: false }).hide();
  };
  const bindCollapseGroup = (groups) => {
    let activeMainId = null;
    Object.entries(groups).forEach(([mainId, nestedIds]) => {
      const main = document.getElementById(mainId);
      let activeNestedId = null;
      main?.addEventListener('show.bs.collapse', (event) => {
        if (event.target !== main) return;
        activeMainId = mainId;
        Object.entries(groups).forEach(([otherId, otherNestedIds]) => {
          if (otherId === mainId) return;
          hideCollapse(document.getElementById(otherId));
          otherNestedIds.forEach((id) => hideCollapse(document.getElementById(id)));
        });
      });
      main?.addEventListener('shown.bs.collapse', (event) => {
        if (event.target === main && activeMainId !== mainId) hideCollapse(main);
      });
      nestedIds.forEach((nestedId) => {
        const nested = document.getElementById(nestedId);
        nested?.addEventListener('show.bs.collapse', (event) => {
          if (event.target !== nested) return;
          activeNestedId = nestedId;
          nestedIds.filter((otherId) => otherId !== nestedId).forEach((otherId) => hideCollapse(document.getElementById(otherId)));
        });
        nested?.addEventListener('shown.bs.collapse', (event) => {
          if (event.target === nested && activeNestedId !== nestedId) hideCollapse(nested);
        });
      });
    });
  };
  const addEncodedResultsNavigation = () => {
    const script = document.querySelector('script[src$="/src/js/shared/nav.js"]');
    if (!script) return;
    const base = new URL('../../../app/admin/evaluation/details/', script.src);
    const links = [
      ['encoded-pre-test.html', 'Pre-test'],
      ['encoded-post-test.html', 'Post-test'],
      ['encoded-training-evaluation.html', 'Training Evaluation'],
      ['encoded-rp-evaluation.html', 'Resource Person Evaluation'],
    ];
    const desktopDetails = document.getElementById('detailsEvaluationHeaderCollapse');
    const desktopTrigger = desktopDetails?.previousElementSibling;
    if (desktopTrigger && !document.getElementById('encodedResultsHeaderCollapse')) {
      const trigger = document.createElement('a');
      trigger.href = '#';
      trigger.className = 'header-collapse-item';
      trigger.setAttribute('role', 'button');
      trigger.setAttribute('data-bs-toggle', 'collapse');
      trigger.setAttribute('data-bs-target', '#encodedResultsHeaderCollapse');
      trigger.setAttribute('aria-expanded', 'false');
      trigger.setAttribute('aria-controls', 'encodedResultsHeaderCollapse');
      trigger.innerHTML = '<i class="bi bi-clipboard-check"></i><span>Encoded Results</span><i class="bi bi-chevron-down ms-auto"></i>';
      const panel = document.createElement('div');
      panel.className = 'collapse';
      panel.id = 'encodedResultsHeaderCollapse';
      const menu = document.createElement('div');
      menu.className = 'header-sub-collapse-menu';
      links.forEach(([file, label]) => {
        const link = document.createElement('a');
        link.href = new URL(file, base).href;
        link.className = 'header-sub-collapse-item';
        link.innerHTML = '<i class="bi bi-card-checklist"></i><span></span>';
        link.querySelector('span').textContent = label;
        menu.append(link);
      });
      panel.append(menu);
      desktopTrigger.before(trigger, panel);
    }
    const mobileDetails = document.getElementById('detailsEvaluationMobile')?.closest('li.mobile-list-navigation');
    if (mobileDetails && !document.getElementById('encodedResultsMobile')) {
      const section = document.createElement('li');
      section.className = 'mobile-list-navigation';
      section.innerHTML = '<a href="#" class="nav-link" data-bs-toggle="collapse" data-bs-target="#encodedResultsMobile" aria-controls="encodedResultsMobile" aria-expanded="false"><i class="bi bi-clipboard-check"></i><span>Encoded Results</span><i class="bi bi-chevron-down ms-auto"></i></a><ul class="collapse mobile-submenu" id="encodedResultsMobile"></ul>';
      const menu = section.querySelector('ul');
      links.forEach(([file, label]) => {
        const item = document.createElement('li');
        item.className = 'mobile-subnav-panel-navigation';
        const link = document.createElement('a');
        link.href = new URL(file, base).href;
        link.className = 'nav-link';
        link.innerHTML = '<i class="bi bi-card-checklist"></i><span></span>';
        link.querySelector('span').textContent = label;
        item.append(link);
        menu.append(item);
      });
      mobileDetails.before(section);
    }
  };
  addEncodedResultsNavigation();
  bindCollapseGroup(mobileMainCollapses);
  bindCollapseGroup(headerMainCollapses);

  document.querySelectorAll('.offcanvas').forEach((offcanvas) => {
    offcanvas.addEventListener('show.bs.offcanvas', () => {
      document.querySelectorAll('.offcanvas.show').forEach((openOffcanvas) => {
        if (openOffcanvas !== offcanvas && typeof bootstrap !== 'undefined') bootstrap.Offcanvas.getOrCreateInstance(openOffcanvas).hide();
      });
    });
    offcanvas.addEventListener('hidden.bs.offcanvas', () => {
      Object.values(mobileMainCollapses).flat().forEach((id) => hideCollapse(document.getElementById(id)));
    });
  });

  updateUnreadNotificationCount();
});
