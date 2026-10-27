import { useEffect, useState } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useAppStore } from '../../stores/appStore';
import { projectApi } from '../../services/api';

export default function AppLayout() {
  const token = useAppStore((s) => s.token);
  const hydrated = useAppStore((s) => s._hydrated);
  const setProjects = useAppStore((s) => s.setProjects);
  const sidebarCollapsed = useAppStore((s) => s.sidebarCollapsed);
  const toggleSidebar = useAppStore((s) => s.toggleSidebar);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoMessage, setDemoMessage] = useState('');
  const location = useLocation();
  const isDemo = import.meta.env.VITE_STATIC_DEMO === 'true';

  useEffect(() => {
    if (!isDemo) return;
    const notify = (event: Event) => setDemoMessage((event as CustomEvent<string>).detail);
    window.addEventListener('duncan-demo-blocked', notify);
    return () => window.removeEventListener('duncan-demo-blocked', notify);
  }, [isDemo]);

  useEffect(() => { setMobileMenuOpen(false); }, [location.pathname]);

  const toggleMobileMenu = () => {
    if (!mobileMenuOpen && sidebarCollapsed) toggleSidebar();
    setMobileMenuOpen((open) => !open);
  };

  useEffect(() => {
    let aborted = false;
    projectApi.list()
      .then((res) => {
        if (aborted) return;
        const list = res.data?.projects || res.data || [];
        setProjects(Array.isArray(list) ? list : []);
      })
      .catch(() => {
        if (!aborted) setProjects([]);
      });
    return () => { aborted = true; };
  }, [setProjects]);

  if (!isDemo && !hydrated) {
    const lsToken = localStorage.getItem('bidmaster_token');
    if (!lsToken) {
      return <Navigate to="/login" replace />;
    }
  } else if (!isDemo && !token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className={`app-shell${isDemo ? ' static-demo' : ''}`} style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {mobileMenuOpen && <button className="mobile-menu-backdrop" aria-label="关闭菜单" onClick={() => setMobileMenuOpen(false)} />}
      <Sidebar mobileMenuOpen={mobileMenuOpen} />
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'var(--color-bg)' }}>
        <Header onMobileMenuClick={toggleMobileMenu} mobileMenuOpen={mobileMenuOpen} />
        <main className="app-main" style={{ flex: 1, overflow: 'auto', padding: '20px 24px', background: 'var(--color-bg)', minWidth: 0 }}>
          {isDemo && <div role="note" style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 8, padding: '10px 14px', marginBottom: 16, color: '#1e40af', fontSize: 12, lineHeight: 1.6 }}>
            <strong>在线演示：</strong>使用预置公开样例，可浏览界面、切换模板与查看解读结果。暂不上传文件、实时调用 AI 或运行审核，请勿输入密钥。
            {' '}<a href={`${import.meta.env.BASE_URL}sample-report.html`} target="_blank" rel="noreferrer" style={{ color: '#1d4ed8', textDecoration: 'underline' }}>查看样例报告</a>
            {demoMessage && <div role="status" style={{ color: '#9a3412', marginTop: 6 }}>{demoMessage}</div>}
          </div>}
          <Outlet />
        </main>
      </div>
    </div>
  );
}
