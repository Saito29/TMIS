/* Shared header and mobile navigation behavior. */
document.addEventListener('DOMContentLoaded', () => {
  const mobileMainCollapses = {
    participantMobile: ['createParticipantMobile', 'updateParticipantMobile', 'detailsParticipantMobile'],
    trainingMobile: ['createTrainingMobile', 'updateTrainingMobile', 'detailsTrainingMobile'],
    evaluationMobile: ['createEvaluationMobile', 'encodeEvaluationMobile', 'updateEvaluationMobile', 'detailsEvaluationMobile'],
    administrationMobile: ['createAdministrationMobile', 'updateAdministrationMobile', 'detailsAdministrationMobile'],
  };
  const headerMainCollapses = {
    participantHeaderCollapse: ['createParticipantHeaderCollapse', 'updateParticipantHeaderCollapse', 'detailsParticipantHeaderCollapse'],
    trainingHeaderCollapse: ['createTrainingHeaderCollapse', 'updateTrainingHeaderCollapse', 'detailsTrainingHeaderCollapse'],
    evaluationHeaderCollapse: ['createEvaluationHeaderCollapse', 'encodeEvaluationHeaderCollapse', 'updateEvaluationHeaderCollapse', 'detailsEvaluationHeaderCollapse'],
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
    Object.entries(groups).forEach(([mainId, nestedIds]) => {
      document.getElementById(mainId)?.addEventListener('show.bs.collapse', () => {
        Object.entries(groups).forEach(([otherId, otherNestedIds]) => {
          if (otherId === mainId) return;
          hideCollapse(document.getElementById(otherId));
          otherNestedIds.forEach((id) => hideCollapse(document.getElementById(id)));
        });
      });
      nestedIds.forEach((nestedId) => {
        document.getElementById(nestedId)?.addEventListener('show.bs.collapse', () => {
          nestedIds.filter((otherId) => otherId !== nestedId).forEach((otherId) => hideCollapse(document.getElementById(otherId)));
        });
      });
    });
  };
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