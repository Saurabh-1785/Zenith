'use client'
import { useEffect, useState } from 'react'

export default function Tasks() {
  const [tasks, setTasks] = useState([])
  const [form, setForm] = useState({ name: '', required_skills: '', estimated_effort: '', minimum_capacity_needed: '', priority: '', deadline: '' })
  const [message, setMessage] = useState('')

  const fetchTasks = () => {
    fetch('http://localhost:3000/tasks')
      .then(r => r.json())
      .then(setTasks)
  }

  useEffect(() => { fetchTasks() }, [])

  const handleSubmit = async () => {
    const res = await fetch('http://localhost:3000/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name,
        required_skills: form.required_skills.split(',').map(s => s.trim()),
        estimated_effort: parseInt(form.estimated_effort),
        minimum_capacity_needed: parseInt(form.minimum_capacity_needed),
        priority: parseInt(form.priority),
        deadline: form.deadline
      })
    })
    const data = await res.json()
    if (data.id) {
      setMessage('Task created successfully! ✅')
      setForm({ name: '', required_skills: '', estimated_effort: '', minimum_capacity_needed: '', priority: '', deadline: '' })
      fetchTasks()
    }
  }

  const priorityColor = (p) => {
    if (p >= 5) return '#ef4444'
    if (p >= 3) return '#f59e0b'
    return '#10b981'
  }

  const priorityLabel = (p) => {
    if (p >= 5) return 'CRITICAL'
    if (p >= 3) return 'HIGH'
    return 'MEDIUM'
  }

  const cardStyle = { background: '#1e293b', borderRadius: '12px', padding: '24px', border: '1px solid #334155' }
  const inputStyle = { width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: '#e2e8f0', fontSize: '14px', marginBottom: '12px' }

  return (
    <div>
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>Tasks</h2>
      <p style={{ color: '#64748b', marginBottom: '32px' }}>Manage tasks waiting to be allocated</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>

        {/* Add Form */}
        <div style={cardStyle}>
          <h3 style={{ marginBottom: '20px', color: '#e2e8f0' }}>Add Task</h3>

          <label style={{ color: '#94a3b8', fontSize: '13px' }}>Task Name</label>
          <input style={inputStyle} placeholder="e.g. Build Login API" value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })} />

          <label style={{ color: '#94a3b8', fontSize: '13px' }}>Required Skills (comma separated)</label>
          <input style={inputStyle} placeholder="e.g. javascript, nodejs" value={form.required_skills}
            onChange={e => setForm({ ...form, required_skills: e.target.value })} />

          <label style={{ color: '#94a3b8', fontSize: '13px' }}>Estimated Effort (hours)</label>
          <input style={inputStyle} placeholder="e.g. 10" type="number" value={form.estimated_effort}
            onChange={e => setForm({ ...form, estimated_effort: e.target.value })} />

          <label style={{ color: '#94a3b8', fontSize: '13px' }}>Minimum Capacity Needed (hours)</label>
          <input style={inputStyle} placeholder="e.g. 10" type="number" value={form.minimum_capacity_needed}
            onChange={e => setForm({ ...form, minimum_capacity_needed: e.target.value })} />

          <label style={{ color: '#94a3b8', fontSize: '13px' }}>Priority (1-5)</label>
          <input style={inputStyle} placeholder="5 = Critical, 1 = Low" type="number" value={form.priority}
            onChange={e => setForm({ ...form, priority: e.target.value })} />

          <label style={{ color: '#94a3b8', fontSize: '13px' }}>Deadline</label>
          <input style={inputStyle} type="date" value={form.deadline}
            onChange={e => setForm({ ...form, deadline: e.target.value })} />

          <button onClick={handleSubmit} style={{
            width: '100%', padding: '12px', borderRadius: '8px',
            background: '#6366f1', color: 'white', border: 'none',
            fontWeight: '600', cursor: 'pointer', fontSize: '15px'
          }}>
            Add Task
          </button>

          {message && <p style={{ color: '#10b981', marginTop: '12px', fontSize: '14px' }}>{message}</p>}
        </div>

        {/* Tasks List */}
        <div style={cardStyle}>
          <h3 style={{ marginBottom: '20px', color: '#e2e8f0' }}>All Tasks ({tasks.length})</h3>
          {tasks.length === 0 ? (
            <p style={{ color: '#64748b' }}>No tasks yet</p>
          ) : (
            tasks.map((t, i) => (
              <div key={i} style={{
                padding: '16px', borderRadius: '8px',
                background: '#0f172a', marginBottom: '12px',
                border: '1px solid #334155'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontWeight: '600', color: '#e2e8f0' }}>{t.name}</span>
                  <span style={{
                    padding: '4px 10px', borderRadius: '20px', fontSize: '12px',
                    fontWeight: '600', background: priorityColor(t.priority) + '22',
                    color: priorityColor(t.priority)
                  }}>
                    {priorityLabel(t.priority)}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#64748b', marginBottom: '8px' }}>
                  <span>⏱ {t.estimated_effort} hrs</span>
                  <span>📅 {new Date(t.deadline).toLocaleDateString()}</span>
                  <span style={{ color: t.status === 'ALLOCATED' ? '#10b981' : '#f59e0b' }}>● {t.status}</span>
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {JSON.parse(t.required_skills).map((skill, j) => (
                    <span key={j} style={{
                      padding: '4px 10px', borderRadius: '20px',
                      background: '#1e1b4b', color: '#6366f1',
                      fontSize: '12px', fontWeight: '500'
                    }}>{skill}</span>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}