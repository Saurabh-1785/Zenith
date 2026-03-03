'use client'
import { useEffect, useState } from 'react'

export default function Resources() {
  const [resources, setResources] = useState([])
  const [form, setForm] = useState({ name: '', skills: '', total_capacity: '' })
  const [message, setMessage] = useState('')

  const fetchResources = () => {
    fetch('http://localhost:3000/resources')
      .then(r => r.json())
      .then(setResources)
  }

  useEffect(() => { fetchResources() }, [])

  const handleSubmit = async () => {
    const res = await fetch('http://localhost:3000/resources', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name,
        skills: form.skills.split(',').map(s => s.trim()),
        total_capacity: parseInt(form.total_capacity)
      })
    })
    const data = await res.json()
    if (data.id) {
      setMessage('Resource created successfully! ✅')
      setForm({ name: '', skills: '', total_capacity: '' })
      fetchResources()
    }
  }

  const cardStyle = { background: '#1e293b', borderRadius: '12px', padding: '24px', border: '1px solid #334155' }
  const inputStyle = { width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: '#e2e8f0', fontSize: '14px', marginBottom: '12px' }

  return (
    <div>
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>Resources</h2>
      <p style={{ color: '#64748b', marginBottom: '32px' }}>Manage your engineers and their skills</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>

        {/* Add Form */}
        <div style={cardStyle}>
          <h3 style={{ marginBottom: '20px', color: '#e2e8f0' }}>Add Resource</h3>

          <label style={{ color: '#94a3b8', fontSize: '13px' }}>Name</label>
          <input style={inputStyle} placeholder="e.g. Alice" value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })} />

          <label style={{ color: '#94a3b8', fontSize: '13px' }}>Skills (comma separated)</label>
          <input style={inputStyle} placeholder="e.g. javascript, nodejs" value={form.skills}
            onChange={e => setForm({ ...form, skills: e.target.value })} />

          <label style={{ color: '#94a3b8', fontSize: '13px' }}>Total Capacity (hours)</label>
          <input style={inputStyle} placeholder="e.g. 40" type="number" value={form.total_capacity}
            onChange={e => setForm({ ...form, total_capacity: e.target.value })} />

          <button onClick={handleSubmit} style={{
            width: '100%', padding: '12px', borderRadius: '8px',
            background: '#6366f1', color: 'white', border: 'none',
            fontWeight: '600', cursor: 'pointer', fontSize: '15px'
          }}>
            Add Resource
          </button>

          {message && <p style={{ color: '#10b981', marginTop: '12px', fontSize: '14px' }}>{message}</p>}
        </div>

        {/* Resources List */}
        <div style={cardStyle}>
          <h3 style={{ marginBottom: '20px', color: '#e2e8f0' }}>All Resources ({resources.length})</h3>
          {resources.length === 0 ? (
            <p style={{ color: '#64748b' }}>No resources yet</p>
          ) : (
            resources.map((r, i) => (
              <div key={i} style={{
                padding: '16px', borderRadius: '8px',
                background: '#0f172a', marginBottom: '12px',
                border: '1px solid #334155'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontWeight: '600', color: '#e2e8f0' }}>{r.name}</span>
                  <span style={{ color: '#10b981', fontSize: '14px' }}>
                    {r.available_capacity}/{r.total_capacity} hrs left
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {JSON.parse(r.skills).map((skill, j) => (
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