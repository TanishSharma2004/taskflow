import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const nav = useNavigate()

  const submit = async e => {
    e.preventDefault()
    try {
      const { data } = await api.post('/auth/login', form)
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      nav('/')
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed')
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#0e0e0e',
      backgroundImage: 'radial-gradient(ellipse at 20% 50%, rgba(200,241,53,0.04) 0%, transparent 60%)'
    }}>
      <div style={{ width: 420 }}>
        <div style={{ marginBottom: 40 }}>
          <h1 style={{ fontFamily: 'Syne', fontSize: 36, fontWeight: 800, letterSpacing: '-1px' }}>
            task<span style={{ color: '#c8f135' }}>flow</span>
          </h1>
          <p style={{ color: '#888', marginTop: 8, fontSize: 14 }}>Sign in to your workspace</p>
        </div>

        <div className="card" style={{ borderColor: '#222' }}>
          <div className="form-group">
            <label>Email</label>
            <input type="email" placeholder="you@company.com"
              value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" placeholder="••••••••"
              value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
          </div>
          {error && <p className="error">{error}</p>}
          <button className="btn btn-primary" style={{ width: '100%', marginTop: 8 }} onClick={submit}>
            Sign In →
          </button>
        </div>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: '#888' }}>
          No account? <Link to="/signup" style={{ color: '#c8f135' }}>Create one</Link>
        </p>
      </div>
    </div>
  )
}