import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, FileText, X, Menu } from 'lucide-react';

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { id: 'dashboard',      label: 'Dashboard',       icon: LayoutDashboard, path: '/admindashboard' },
    { id: 'usermanagement', label: 'User Management',  icon: Users,           path: '/usermanagement' },
    // { id: 'filemanagement', label: 'File Management',  icon: FileText,        path: '/admin/filemanagement' },
  ];

  const currentPath = location.pathname;

  const s = {
    root: {
      display: 'flex',
      height: '100vh',
      backgroundColor: '#f3f4f6',
      fontFamily: 'sans-serif',
      overflow: 'hidden',
    },

    // ── Sidebar ──────────────────────────────────────────────────
    sidebar: {
      width: sidebarOpen ? '256px' : '0px',
      minWidth: sidebarOpen ? '256px' : '0px',
      backgroundColor: '#111827',
      color: '#ffffff',
      transition: 'width 0.3s ease, min-width 0.3s ease',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
    },
    sidebarHeader: {
      padding: '16px',
      borderBottom: '1px solid #374151',
      whiteSpace: 'nowrap',
    },
    sidebarTitle: {
      fontSize: '20px',
      fontWeight: '700',
      margin: 0,
    },
    nav: {
      padding: '16px',
    },
    navList: {
      listStyle: 'none',
      margin: 0,
      padding: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
    },
    navBtn: (isActive) => ({
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px 16px',
      borderRadius: '8px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
      whiteSpace: 'nowrap',
      transition: 'background-color 0.2s',
      backgroundColor: isActive ? '#2563eb' : 'transparent',
      color: isActive ? '#ffffff' : '#d1d5db',
    }),

    // ── Main area ────────────────────────────────────────────────
    main: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    },

    // ── Header ───────────────────────────────────────────────────
    header: {
      backgroundColor: '#ffffff',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      flexShrink: 0,
    },
    headerInner: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px 24px',
    },
    menuToggle: {
      padding: '8px',
      borderRadius: '8px',
      border: 'none',
      background: 'none',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      color: '#111827',
    },
    headerRight: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
    },
    adminLabel: {
      fontSize: '14px',
      color: '#4b5563',
    },
    avatar: {
      width: '40px',
      height: '40px',
      backgroundColor: '#2563eb',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#ffffff',
      fontWeight: '600',
      fontSize: '16px',
    },

    // ── Page content ─────────────────────────────────────────────
    content: {
      flex: 1,
      overflowY: 'auto',
    },
  };

  return (
    <div style={s.root}>
      {/* Sidebar */}
      <aside style={s.sidebar}>
        <div style={s.sidebarHeader}>
          <h2 style={s.sidebarTitle}>Admin Panel</h2>
        </div>
        <nav style={s.nav}>
          <ul style={s.navList}>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath === item.path;
              return (
                <li key={item.id}>
                  <button onClick={() => navigate(item.path)} style={s.navBtn(isActive)}>
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div style={s.main}>
        {/* Header */}
        <header style={s.header}>
          <div style={s.headerInner}>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} style={s.menuToggle}>
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <div style={s.headerRight}>
              <span style={s.adminLabel}>Admin User</span>
              <div style={s.avatar}>A</div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main style={s.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}