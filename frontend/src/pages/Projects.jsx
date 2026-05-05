import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'

export default function Projects() {
  const [projects, setProjects] = useState([])
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState({ name: '', description: '' })
  const nav = useNavigate()

  const load = () => api.get('/projects').then(r => setProjects(r.data))

  useEffect(() => { load() }, [])

  const create = async () => {
    if (!form.name) return
    await api.post('/projects', form)
    setForm({ name: '', description: '' })
    setModal(false)
    load()
  }

  return (
    <div className="page">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 style={{ fontFamily: 'Syne', fontSize: 28, fontWeight: 700 }}>Projects</h2>
          <p className="text-muted mt-2">Your workspaces</p>
        </div>
        <button className="btn btn-primary" onClick={() => setModal(true)}>+ New Project</button>
      </div>

      {projects.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: 60 }}>
          <p style={{ fontSize: 40, marginBottom: 12 }}>📋</p>
          <p className="text-muted">No projects yet. Create one to get started.</p>
        </div>
      )}

      <div className="grid-2">
        {projects.map(p => (
          <div className="card" key={p.id} style={{ cursor: 'pointer', transition: 'border 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#c8f135'}
            onMouseLeave={e => e.currentTarget.style.borderColor = '#2a2a2a'}
            onClick={() => nav(`/projects/${p.id}/tasks`)}>
            <div className="flex justify-between items-center mb-2">
              <h3 style={{ fontFamily: 'Syne', fontSize: 18, fontWeight: 700 }}>{p.name}</h3>
              <span className={`tag ${p.role === 'admin' ? 'tag-inprogress' : 'tag-todo'}`}>{p.role}</span>
            </div>
            <p className="text-muted" style={{ fontSize: 13 }}>{p.description || 'No description'}</p>
            <p style={{ marginTop: 12, fontSize: 11, color: '#555' }}>
              Admin: {p.admin_name}
            </p>
          </div>
        ))}
      </div>

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>New Project</h3>
            <div className="form-group">
              <label>Project Name</label>
              <input placeholder="e.g. Website Redesign"
                value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea rows={3} placeholder="What is this project about?"
                value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="flex gap-2 mt-3">
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={create}>Create</button>
              <button className="btn btn-ghost" onClick={() => setModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}