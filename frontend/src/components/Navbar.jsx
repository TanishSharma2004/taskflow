import { Link, useNavigate, useLocation } from 'react-router-dom'

export default function Navbar() {
  const nav = useNavigate()
  const loc = useLocation()
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  const logout = () => {
    localStorage.clear()
    nav('/login')
  }

  return (
    <nav style={{
      background: '#0e0e0e',
      borderBottom: '1px solid #2a2a2a',
      padding: '14px 32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 50
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
        <span style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 20, color: '#c8f135', letterSpacing: '-0.5px' }}>
          task<span style={{ color: '#fff' }}>flow</span>
        </span>
        <div style={{ display: 'flex', gap: 4 }}>
          {[['/', 'Dashboard'], ['/projects', 'Projects']].map(([path, label]) => (
            <Link key={path} to={path} style={{
              padding: '6px 14px',
              borderRadius: 6,
              fontSize: 13,
              textDecoration: 'none',
              background: loc.pathname === path ? '#1e1e1e' : 'transparent',
              color: loc.pathname === path ? '#c8f135' : '#888',
              transition: 'all 0.15s'
            }}>{label}</Link>
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontSize: 13, color: '#888' }}>{user.name}</span>
        <button className="btn btn-ghost" style={{ padding: '6px 14px', fontSize: 12 }} onClick={logout}>
          Logout
        </button>
      </div>
    </nav>
  )
}