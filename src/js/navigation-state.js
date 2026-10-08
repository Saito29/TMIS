document.addEventListener('DOMContentLoaded', () => {
  const normalizePath = (path) =>
    decodeURIComponent(path).replace(/\/+$/, '').toLocaleLowerCase();
  const currentPath = normalizePath(window.location.pathname);
  const navigation = document.querySelectorAll(
    '.app-header a[href], .app-mobile-menu a[href]'
  );
  navigation.forEach((link) => {
    link.classList.remove('active-page');
    link.removeAttribute('aria-current');
  });

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
