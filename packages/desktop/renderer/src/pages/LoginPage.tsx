import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../services/api';
import { useAppStore } from '../stores/appStore';

export default function LoginPage() {
  const navigate = useNavigate();
  const { setUser, setToken } = useAppStore();
  const [email, setEmail] = useState('admin@bidmaster.pro');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await authApi.login(email, password);
      const { token, user } = res.data;
      if (!token || !user) {
        setError('登录请求没有得到平台的正常回复。请在 Safari 重新打开演示链接，完成邮箱验证码后再登录。');
        return;
      }
      localStorage.setItem('bidmaster_token', token);
      localStorage.setItem('bidmaster_user', JSON.stringify(user));
      setToken(token);
      setUser(user);
      navigate('/dashboard');
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const detail = err.response?.data?.detail;
        if (typeof detail === 'string') {
          setError(detail);
        } else if (err.response?.status === 403 || err.response?.status === 302 || err.response?.status === 401) {
          setError('登录请求被外层访问验证拦住了。请在 Safari 重新打开演示链接，完成邮箱验证码后再登录。');
        } else if (!err.response) {
          setError('手机没有连通登录服务。请在 Safari 重新打开演示链接，检查网络后重试。');
        } else {
          setError(`平台暂时无法处理登录（HTTP ${err.response.status}）。请稍后重试。`);
        }
      } else {
        setError('登录时出现异常，请刷新页面重试。');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* SVG Background */}
      <img
        src="/login-bg.svg"
        alt=""
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }}
      />

      {/* Animated floating glow overlays */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1 }}>
        <div style={{
          position: 'absolute', top: '12%', right: '10%',
          width: '220px', height: '220px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)',
          animation: 'loginFloat1 8s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute', bottom: '18%', right: '28%',
          width: '160px', height: '160px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(26,86,219,0.07) 0%, transparent 70%)',
          animation: 'loginFloat2 10s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute', top: '55%', left: '4%',
          width: '120px', height: '120px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(147,197,253,0.06) 0%, transparent 70%)',
          animation: 'loginFloat3 12s ease-in-out infinite',
        }} />
      </div>

      {/* Login Card */}
      <div style={{
        width: 'min(420px, calc(100vw - 32px))',
        background: 'rgba(255,255,255,0.97)',
        borderRadius: '16px',
        padding: 'clamp(24px, 5vw, 40px)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1)',
        position: 'relative',
        zIndex: 10,
        backdropFilter: 'blur(20px)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <img src="/duncan-avatar.jpg" alt="Duncan pro" style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 16, marginBottom: 16, boxShadow: '0 4px 16px rgba(59,130,246,0.25)' }} />
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a', margin: 0 }}>
            Duncan pro
          </h1>
          <p style={{ fontSize: '14px', color: '#64748b', marginTop: '8px' }}>
            全流程智能招投标平台
          </p>
        </div>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              fontSize: '13px', fontWeight: 500, color: '#374151',
              display: 'block', marginBottom: '6px',
            }}>
              平台登录邮箱（不是收验证码的邮箱）
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="请输入邮箱"
              required
              style={{
                width: '100%', padding: '10px 14px',
                border: '1px solid #d1d5db', borderRadius: '8px',
                fontSize: '14px', boxSizing: 'border-box',
                outline: 'none', transition: 'border-color 0.2s',
              }}
              onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{
              fontSize: '13px', fontWeight: 500, color: '#374151',
              display: 'block', marginBottom: '6px',
            }}>
              密码
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="请输入密码"
              required
              style={{
                width: '100%', padding: '10px 14px',
                border: '1px solid #d1d5db', borderRadius: '8px',
                fontSize: '14px', boxSizing: 'border-box',
                outline: 'none', transition: 'border-color 0.2s',
              }}
              onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ marginTop: 8, background: 'none', border: 0, color: '#2563eb', fontSize: 12, cursor: 'pointer' }}>
              {showPassword ? '隐藏密码' : '显示密码，核对输入'}
            </button>
          </div>

          <p style={{ marginTop: -12, marginBottom: 20, fontSize: 12, color: '#64748b', lineHeight: 1.6 }}>
            邮箱验证码只用于打开演示链接。这里请使用上方平台邮箱；演示密码在电脑的 Duncan-Pro 文件夹中双击“查看演示密码.bat”查看。
          </p>

          {error && (
            <div style={{
              marginBottom: '16px', padding: '10px 14px',
              background: '#fef2f2', border: '1px solid #fecaca',
              borderRadius: '8px', fontSize: '13px', color: '#dc2626',
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: '12px',
              background: loading ? '#94a3b8' : 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
              color: 'white', border: 'none', borderRadius: '8px',
              fontSize: '15px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'opacity 0.2s',
              boxShadow: loading ? 'none' : '0 4px 16px rgba(59,130,246,0.4)',
            }}
          >
            {loading ? '登录中...' : '登 录'}
          </button>
        </form>

        <p style={{ marginTop: 24, textAlign: 'center', fontSize: 11, color: '#94a3b8' }}>
          基于 BidMaster Pro 开源项目改编 · AGPL-3.0 · <a href="/duncan-pro-source.zip" download>下载对应源码</a>
        </p>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes loginFloat1 {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-20px) scale(1.05); }
        }
        @keyframes loginFloat2 {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(15px) scale(1.08); }
        }
        @keyframes loginFloat3 {
          0%, 100% { transform: translateX(0px); }
          50% { transform: translateX(20px); }
        }
      `}</style>
    </div>
  );
}
