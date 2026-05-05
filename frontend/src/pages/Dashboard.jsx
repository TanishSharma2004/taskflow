import { useEffect, useState } from 'react'
import api from '../api'

export default function Dashboard() {
  const [data, setData] = useState(null)
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  useEffect(() => {
    api.get('/tasks/dashboard').then(r => setData(r.data)).catch(() => {})
  }, [])

  const statuses = data?.byStatus || []
  const getCount = s => statuses.find(x => x.status === s)?.count || 0

  return (
    <div className="page">
      <div className="mb-4">
        <h2 style={{ fontFamily: 'Syne', fontSize: 28, fontWeight: 700 }}>
          Hey, {user.name?.split(' ')[0]} 👋
        </h2>
        <p className="text-muted mt-2">Here's what's happening across your projects.</p>
      </div>

      <div className="grid-3 mb-4">
        {[
          { label: 'Total Tasks', value: data?.total || 0, color: '#c8f135' },
          { label: 'Overdue', value: data?.overdue || 0, color: '#ff4545' },
          { label: 'Done', value: getCount('done'), color: '#5fb3ff' },
        ].map(s => (
          <div className="card" key={s.label} style={{ borderLeft: `3px solid ${s.color}` }}>
            <p className="text-muted mb-1" style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{s.label}</p>
            <p style={{ fontFamily: 'Syne', fontSize: 40, fontWeight: 800, color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid-2">
        <div className="card">
          <h3 style={{ fontFamily: 'Syne', marginBottom: 16, fontSize: 16 }}>Tasks by Status</h3>
          {['todo', 'inprogress', 'done'].map(s => (
            <div key={s} style={{ marginBottom: 12 }}>
              <div className="flex justify-between mb-1" style={{ fontSize: 13 }}>
                <span style={{ textTransform: 'capitalize', color: '#aaa' }}>{s === 'inprogress' ? 'In Progress' : s}</span>
                <span style={{ color: '#c8f135' }}>{getCount(s)}</span>
              </div>
              <div style={{ background: '#222', borderRadius: 4, height: 6, overflow: 'hidden' }}>
                <div style={{
                  width: data?.total > 0 ? `${(getCount(s) / data.total) * 100}%` : '0%',
                  height: '100%',
                  background: s === 'done' ? '#c8f135' : s === 'inprogress' ? '#5fb3ff' : '#444',
                  borderRadius: 4,
                  transition: 'width 0.5s'
                }} />
              </div>
            </div>
          ))}
        </div>

        <div className="card">
          <h3 style={{ fontFamily: 'Syne', marginBottom: 16, fontSize: 16 }}>Tasks per User</h3>
          {data?.perUser?.length === 0 && <p className="text-muted">No data yet.</p>}
          {data?.perUser?.map(u => (
            <div key={u.name} className="flex justify-between items-center mb-3">
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: '#222', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, fontWeight: 600, color: '#c8f135', border: '1px solid #2a2a2a'
              }}>
                {u.name?.[0]}
              </div>
              <span style={{ flex: 1, marginLeft: 10, fontSize: 13 }}>{u.name}</span>
              <span style={{ color: '#c8f135', fontWeight: 600 }}>{u.task_count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}