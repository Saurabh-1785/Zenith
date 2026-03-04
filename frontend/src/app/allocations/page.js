'use client'
import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

const API = 'http://localhost:5000'

export default function Allocations() {
  const [allocations, setAllocations] = useState([])
  const [resources, setResources] = useState([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [metrics, setMetrics] = useState(null)

  const fetchData = () => {
    fetch(`${API}/allocations`).then(r => r.json()).then(setAllocations).catch(err => console.error('Failed to fetch allocations:', err))
    fetch(`${API}/resources`).then(r => r.json()).then(setResources).catch(err => console.error('Failed to fetch resources:', err))
  }

  useEffect(() => { fetchData() }, [])

  const runAllocation = async () => {
    setLoading(true)
    setMessage('')
    try {
      const res = await fetch(`${API}/allocate`, { method: 'POST' })
      const data = await res.json()

      if (data.error) {
        setMessage(`❌ ${data.error}`)
      } else {
        setMessage(`✅ ${data.allocations.length} tasks allocated, ${data.unallocated.length} unallocated`)
        setMetrics(data.metrics)
        fetchData()
      }
    } catch (err) {
      setMessage(`❌ Error: ${err.message}`)
    }
    setLoading(false)
  }

  const chartData = resources.map(r => ({
    name: r.name,
    used: r.total_capacity - r.available_capacity,
    available: r.available_capacity
  }))

  const cardStyle = { background: '#1e293b', borderRadius: '12px', padding: '24px', border: '1px solid #334155' }

  return (
    <div>
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>Allocations</h2>
      <p style={{ color: '#64748b', marginBottom: '32px' }}>Run the allocation engine and see results</p>

      {/* Run Button */}
      <div style={{ ...cardStyle, marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h3 style={{ color: '#e2e8f0', marginBottom: '4px' }}>Run Allocation Engine</h3>
          <p style={{ color: '#64748b', fontSize: '14px' }}>Assigns all pending tasks to best available resources</p>
        </div>
        <button onClick={runAllocation} disabled={loading} style={{
          padding: '12px 28px', borderRadius: '8px',
          background: loading ? '#334155' : '#6366f1',
          color: 'white', border: 'none',
          fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer',
          fontSize: '15px', minWidth: '160px'
        }}>
          {loading ? '⏳ Running...' : '⚡ Run Allocator'}
        </button>
      </div>

      {message && (
        <div style={{
          ...cardStyle, marginBottom: '24px',
          borderColor: message.includes('✅') ? '#10b981' : '#ef4444',
          color: message.includes('✅') ? '#10b981' : '#ef4444',
          fontSize: '15px'
        }}>
          {message}
        </div>
      )}

      {metrics && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
          {[
            { label: 'Total Capacity', value: metrics.total_capacity + ' hrs' },
            { label: 'Used Capacity', value: metrics.used_capacity + ' hrs' },
            { label: 'Utilization', value: metrics.utilization_percentage },
          ].map(m => (
            <div key={m.label} style={cardStyle}>
              <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '8px' }}>{m.label}</p>
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#6366f1' }}>{m.value}</p>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>

        {/* Chart */}
        <div style={cardStyle}>
          <h3 style={{ marginBottom: '24px', color: '#e2e8f0' }}>Resource Capacity Chart</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }} />
              <Bar dataKey="used" name="Used" stackId="a" fill="#6366f1" radius={[0, 0, 4, 4]} />
              <Bar dataKey="available" name="Available" stackId="a" fill="#334155" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Allocations List */}
        <div style={cardStyle}>
          <h3 style={{ marginBottom: '20px', color: '#e2e8f0' }}>All Allocations ({allocations.length})</h3>
          {allocations.length === 0 ? (
            <p style={{ color: '#64748b' }}>No allocations yet — run the engine!</p>
          ) : (
            <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
              {allocations.map((a, i) => (
                <div key={i} style={{
                  padding: '12px', borderRadius: '8px',
                  background: '#0f172a', marginBottom: '8px',
                  border: '1px solid #334155',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                }}>
                  <div>
                    <p style={{ color: '#e2e8f0', fontWeight: '600', fontSize: '14px' }}>{a.task_name}</p>
                    <p style={{ color: '#64748b', fontSize: '12px' }}>Priority {a.priority} · {new Date(a.deadline).toLocaleDateString()}</p>
                  </div>
                  <span style={{
                    padding: '6px 12px', borderRadius: '20px',
                    background: '#1e1b4b', color: '#6366f1',
                    fontSize: '13px', fontWeight: '600'
                  }}>{a.resource_name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}