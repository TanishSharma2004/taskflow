import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../api'

const STATUSES = ['todo', 'inprogress', 'done']
const STATUS_LABELS = { todo: 'To Do', inprogress: 'In Progress', done: 'Done' }

export default function Tasks() {
  const { id } = useParams()
  const [tasks, setTasks] = useState([])
  const [members, setMembers] = useState([])
  const [myRole, setMyRole] = useState('member')
  const [modal, setModal] = useState(false)
  const [memberModal, setMemberModal] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [form, setForm] = useState({ title: '', description: '', due_date: '', priority: 'medium', assigned_to: '' })
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  const load = async () => {
    const [t, m] = await Promise.all([
      api.get(`/tasks/project/${id}`),
      api.get(`/projects/${id}/members`)
    ])
    setTasks(t.data)
    setMembers(m.data)
    const me = m.data.find(x => x.id === user.id)
    if (me) setMyRole(me.role)
  }

  useEffect(() => { load() }, [id])

  const createTask = async () => {
    if (!form.title) return
    await api.post('/tasks', { ...form, project_id: id, assigned_to: form.assigned_to || null })
    setModal(false)
    setForm({ title: '', description: '', due_date: '', priority: 'medium', assigned_to: '' })
    load()
  }

  const updateStatus = async (taskId, status) => {
    await api.patch(`/tasks/${taskId}/status`, { status })
    load()
  }

  const addMember = async () => {
    await api.post(`/projects/${id}/members`, { email: inviteEmail })
    setInviteEmail('')
    setMemberModal(false)
    load()
  }

  const removeMember = async userId => {
    await api.delete(`/projects/${id}/members/${userId}`)
    load()
  }

  const isOverdue = due => due && new Date(due) < new Date() 

  return (
    <div className="page">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 style={{ fontFamily: 'Syne', fontSize: 28, fontWeight: 700 }}>Tasks</h2>
          <p className="text-muted mt-2">
            Your role: <span style={{ color: myRole === 'admin' ? '#c8f135' : '#5fb3ff' }}>{myRole}</span>
          </p>
        </div>
        <div className="flex gap-2">
          {myRole === 'admin' && (
            <>
              <button className="btn btn-ghost" onClick={() => setMemberModal(true)}>Manage Members</button>
              <button className="btn btn-primary" onClick={() => setModal(true)}>+ Add Task</button>
            </>
          )}
        </div>
      </div>

      {/* Kanban columns */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
        {STATUSES.map(col => (
          <div key={col}>
            <div className="flex items-center gap-2 mb-3">
              <span className={`tag tag-${col}`}>{STATUS_LABELS[col]}</span>
              <span style={{ fontSize: 12, color: '#555' }}>
                {tasks.filter(t => t.status === col).length}
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {tasks.filter(t => t.status === col).map(task => (
                <div key={task.id} className="card" style={{
                  borderLeft: `3px solid ${task.priority === 'high' ? '#ff4545' : task.priority === 'medium' ? '#ff6b35' : '#2a2a2a'}`,
                  padding: 14
                }}>
                  <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 6 }}>{task.title}</p>
                  {task.description && <p className="text-muted" style={{ fontSize: 12, marginBottom: 8 }}>{task.description}</p>}
                  <div className="flex items-center gap-2 mb-2" style={{ flexWrap: 'wrap' }}>
                    <span className={`tag tag-${task.priority}`}>{task.priority}</span>
                    {task.assigned_name && (
                      <span style={{ fontSize: 11, color: '#666' }}>→ {task.assigned_name}</span>
                    )}
                  </div>
                  {task.due_date && (
                    <p style={{ fontSize: 11, color: isOverdue(task.due_date) ? '#ff4545' : '#555', marginBottom: 8 }}>
                      {isOverdue(task.due_date) ? '⚠ ' : '📅 '}
                      {new Date(task.due_date).toLocaleDateString()}
                    </p>
                  )}
                  <select value={task.status}
                    onChange={e => updateStatus(task.id, e.target.value)}
                    style={{ fontSize: 12, padding: '4px 8px' }}>
                    {STATUSES.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                  </select>
                </div>
              ))}
              {tasks.filter(t => t.status === col).length === 0 && (
                <div style={{
                  border: '1px dashed #222', borderRadius: 8, padding: '30px 0',
                  textAlign: 'center', color: '#444', fontSize: 12
                }}>empty</div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Create Task Modal */}
      {modal && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>New Task</h3>
            {[['title', 'Title', 'text', 'e.g. Design homepage'],
              ['description', 'Description', 'text', '']].map(([key, label, type, ph]) => (
              <div className="form-group" key={key}>
                <label>{label}</label>
                {key === 'description'
                  ? <textarea rows={2} placeholder={ph} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} />
                  : <input type={type} placeholder={ph} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} />
                }
              </div>
            ))}
            <div className="grid-2">
              <div className="form-group">
                <label>Due Date</label>
                <input type="date" value={form.due_date} onChange={e => setForm({ ...form, due_date: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Priority</label>
                <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Assign To</label>
              <select value={form.assigned_to} onChange={e => setForm({ ...form, assigned_to: e.target.value })}>
                <option value="">Unassigned</option>
                {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            </div>
            <div className="flex gap-2 mt-3">
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={createTask}>Create Task</button>
              <button className="btn btn-ghost" onClick={() => setModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Members Modal */}
      {memberModal && (
        <div className="modal-overlay" onClick={() => setMemberModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>Team Members</h3>
            <div style={{ marginBottom: 20 }}>
              {members.map(m => (
                <div key={m.id} className="flex justify-between items-center mb-3">
                  <div>
                    <p style={{ fontSize: 14 }}>{m.name}</p>
                    <p style={{ fontSize: 12, color: '#555' }}>{m.email}</p>
                  </div>
                  <div className="flex gap-2 items-center">
                    <span className={`tag tag-${m.role === 'admin' ? 'inprogress' : 'todo'}`}>{m.role}</span>
                    {m.id !== user.id && (
                      <button className="btn btn-danger" style={{ padding: '4px 10px', fontSize: 11 }}
                        onClick={() => removeMember(m.id)}>Remove</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="form-group">
              <label>Invite by Email</label>
              <input placeholder="colleague@company.com"
                value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} />
            </div>
            <div className="flex gap-2 mt-2">
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={addMember}>Add Member</button>
              <button className="btn btn-ghost" onClick={() => setMemberModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}