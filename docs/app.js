(() => {
  const pageNames = {
    workbench: '工作台',
    interpret: '招标解读',
    generate: '投标生成',
    check: '投标检查',
    format: '文档输出',
    news: '资讯中心',
    settings: '平台设置',
    report: '样例报告',
    preview: '界面预览',
  };
  const pages = Object.keys(pageNames);
  const steps = ['file', 'parse', 'analysis', 'finish'];
  const templates = {
    letter: { title: '投标函', description: '可先确定目录与责任人，再对照招标文件逐条填写。', chapters: ['投标函', '法定代表人身份证明', '授权委托书', '投标承诺书'] },
    qualification: { title: '资格审查', description: '根据招标文件核对企业、人员和业绩证明。', chapters: ['企业资质证明', '项目负责人资格', '类似项目业绩', '人员配备与社保证明'] },
    technical: { title: '技术标', description: '技术方案需紧扣评标办法，由专业人员编写和复核。', chapters: ['项目理解与设计思路', '勘察实施方案', '质量与进度控制', '安全与风险措施'] },
    commercial: { title: '商务标', description: '报价项目、计算口径和限价应回到招标文件核对。', chapters: ['报价汇总表', '分项报价说明', '商务偏离表', '成本与履约说明'] },
    service: { title: '售后服务', description: '服务承诺应与实际履约能力相符。', chapters: ['服务响应机制', '培训计划', '应急处理', '质量保修承诺'] },
  };
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
    window.scrollTo({ top: 0, behavior: 'auto' });
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

  document.querySelectorAll('[data-template]').forEach((button) => {
    button.addEventListener('click', () => {
      const selected = templates[button.dataset.template];
      if (!selected) return;
      document.querySelectorAll('[data-template]').forEach((item) => {
        const active = item === button;
        item.classList.toggle('active', active);
        item.setAttribute('aria-pressed', String(active));
      });
      document.getElementById('template-title').textContent = selected.title;
      document.getElementById('template-description').textContent = selected.description;
      document.getElementById('template-chapters').replaceChildren(...selected.chapters.map((chapter) => {
        const item = document.createElement('li');
        item.textContent = chapter;
        return item;
      }));
    });
  });

  document.querySelectorAll('[data-check]').forEach((button) => {
    button.addEventListener('click', () => {
      const category = button.dataset.check;
      document.querySelectorAll('[data-check]').forEach((item) => {
        const active = item === button;
        item.classList.toggle('active', active);
        item.setAttribute('aria-pressed', String(active));
      });
      document.querySelectorAll('[data-check-category]').forEach((card) => {
        card.hidden = category !== 'all' && card.dataset.checkCategory !== category;
      });
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
