document.addEventListener('DOMContentLoaded', () => {
  const normalizePath = (path) => {
    try { return decodeURIComponent(path).replace(/\/+$/, '').toLowerCase(); }
    catch { return path.replace(/\/+$/, '').toLowerCase(); }
  };
  const currentPath = normalizePath(window.location.pathname);
  const navigation = document.querySelectorAll(
    '.app-header a[href], .app-mobile-menu a[href]'
  );
  navigation.forEach((link) => {
    link.classList.remove('active-page');
    link.removeAttribute('aria-current');
  });

  // Highlight ancestors without opening menus on every page load.
  // Bootstrap controls their open state when the user clicks a section.
  const activateParents = (link) => {
    let parent = link.parentElement;
    while (parent && !parent.matches('.app-header, .app-mobile-menu')) {
      if (parent.classList.contains('collapse') && parent.id) {
        const scope = parent.closest('.app-header, .app-mobile-menu');
        scope?.querySelectorAll('[data-bs-target]').forEach((trigger) => {
          if (trigger.getAttribute('data-bs-target') !== `#${parent.id}`) return;
          trigger.classList.add('active-page');
        });
      }
      parent = parent.parentElement;
    }
  };

  navigation.forEach((link) => {
    const href = link.getAttribute('href');
    if (!href || href === '#' || href.startsWith('#')) return;

    let target;
    try {
      target = new URL(href, window.location.href);
    } catch (error) {
      console.error(`Unable to resolve navigation link "${href}".`, error);
      return;
    }

    if (
      target.origin !== window.location.origin ||
      normalizePath(target.pathname) !== currentPath
    ) {
      return;
    }

    link.classList.add('active-page');
    link.setAttribute('aria-current', 'page');
    activateParents(link);

    const desktopSection = link.closest(
      '.app-navigation-bar .navbar-nav > .nav-item'
    );
    const mobileSection = link.closest(
      '.app-mobile-menu .mobile-nav > .mobile-list-navigation'
    );
    const section = desktopSection || mobileSection;
    const sectionLink = section?.querySelector(':scope > .nav-link');

    if (sectionLink && sectionLink !== link) {
      sectionLink.classList.add('active-page');
    }
  });
});
