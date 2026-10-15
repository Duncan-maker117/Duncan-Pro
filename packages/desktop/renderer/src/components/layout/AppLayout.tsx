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
  const location = useLocation();

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

  if (!hydrated) {
    const lsToken = localStorage.getItem('bidmaster_token');
    if (!lsToken) {
      return <Navigate to="/login" replace />;
    }
  } else if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="app-shell" style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {mobileMenuOpen && <button className="mobile-menu-backdrop" aria-label="关闭菜单" onClick={() => setMobileMenuOpen(false)} />}
      <Sidebar mobileMenuOpen={mobileMenuOpen} />
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'var(--color-bg)' }}>
        <Header onMobileMenuClick={toggleMobileMenu} mobileMenuOpen={mobileMenuOpen} />
        <main className="app-main" style={{ flex: 1, overflow: 'auto', padding: '20px 24px', background: 'var(--color-bg)', minWidth: 0 }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
