import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api'

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const nav = useNavigate()

  const submit = async e => {
    e.preventDefault()
    try {
      const { data } = await api.post('/auth/signup', form)
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      nav('/')
    } catch (err) {
      setError(err.response?.data?.error || 'Signup failed')
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#0e0e0e',
      backgroundImage: 'radial-gradient(ellipse at 80% 50%, rgba(255,107,53,0.04) 0%, transparent 60%)'
    }}>
      <div style={{ width: 420 }}>
        <div style={{ marginBottom: 40 }}>
          <h1 style={{ fontFamily: 'Syne', fontSize: 36, fontWeight: 800, letterSpacing: '-1px' }}>
            task<span style={{ color: '#c8f135' }}>flow</span>
          </h1>
          <p style={{ color: '#888', marginTop: 8, fontSize: 14 }}>Create your account</p>
        </div>

        <div className="card" style={{ borderColor: '#222' }}>
          {[['name', 'Full Name', 'text', 'Jane Doe'],
            ['email', 'Email', 'email', 'jane@company.com'],
            ['password', 'Password', 'password', '••••••••']].map(([key, label, type, ph]) => (
            <div className="form-group" key={key}>
              <label>{label}</label>
              <input type={type} placeholder={ph}
                value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} />
            </div>
          ))}
          {error && <p className="error">{error}</p>}
          <button className="btn btn-primary" style={{ width: '100%', marginTop: 8 }} onClick={submit}>
            Create Account →
          </button>
        </div>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: '#888' }}>
          Already have one? <Link to="/login" style={{ color: '#c8f135' }}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}