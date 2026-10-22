(() => {
  const pageNames = {
    workbench: '工作台',
    interpret: '招标解读',
    report: '样例报告',
    preview: '界面预览',
  };
  const pages = Object.keys(pageNames);
  const steps = ['file', 'parse', 'analysis', 'finish'];
  const sidebar = document.getElementById('sidebar');
  const menuButton = document.getElementById('menu-button');
  const backdrop = document.getElementById('sidebar-backdrop');

  function closeMenu() {
    sidebar.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', '打开菜单');
    backdrop.hidden = true;
  }

  function showPage(name, updateHash = true) {
    const page = pages.includes(name) ? name : 'workbench';
    for (const candidate of pages) {
      const active = candidate === page;
      const section = document.getElementById(`page-${candidate}`);
      section.hidden = !active;
      section.classList.toggle('active', active);
      document.querySelectorAll(`[data-page="${candidate}"]`).forEach((button) => {
        button.classList.toggle('active', active);
        if (active) button.setAttribute('aria-current', 'page');
        else button.removeAttribute('aria-current');
      });
    }
    document.getElementById('breadcrumb-current').textContent = pageNames[page];
    document.title = `${pageNames[page]} · Duncan pro 在线体验`;
    closeMenu();
    if (updateHash && location.hash !== `#${page}`) history.replaceState(null, '', `#${page}`);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  function showStep(step) {
    const selected = steps.includes(step) ? step : 'file';
    for (const candidate of steps) {
      const active = candidate === selected;
      const content = document.getElementById(`step-${candidate}`);
      content.hidden = !active;
      content.classList.toggle('active', active);
      const button = document.querySelector(`[data-step="${candidate}"]`);
      button.classList.toggle('active', active);
      button.setAttribute('aria-selected', String(active));
      button.tabIndex = active ? 0 : -1;
    }
  }

  document.querySelectorAll('[data-page], [data-go]').forEach((button) => {
    button.addEventListener('click', () => {
      showPage(button.dataset.page || button.dataset.go);
    });
  });
  document.querySelectorAll('[data-step], [data-next-step]').forEach((button) => {
    button.addEventListener('click', () => {
      showStep(button.dataset.step || button.dataset.nextStep);
    });
  });
  document.querySelector('.step-tabs').addEventListener('keydown', (event) => {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
    event.preventDefault();
    const current = steps.findIndex((step) => document.querySelector(`[data-step="${step}"]`).classList.contains('active'));
    const next = (current + (event.key === 'ArrowRight' ? 1 : -1) + steps.length) % steps.length;
    showStep(steps[next]);
    document.querySelector(`[data-step="${steps[next]}"]`).focus();
  });

  menuButton.addEventListener('click', () => {
    const open = !sidebar.classList.contains('open');
    sidebar.classList.toggle('open', open);
    backdrop.hidden = !open;
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? '关闭菜单' : '打开菜单');
  });
  backdrop.addEventListener('click', closeMenu);
  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });
  window.addEventListener('hashchange', () => showPage(location.hash.slice(1), false));

  showPage(location.hash.slice(1), false);
})();
