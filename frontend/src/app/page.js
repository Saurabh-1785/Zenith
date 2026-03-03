'use client'
import { useEffect, useState } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'

const COLORS = ['#6366f1', '#334155']

export default function Dashboard() {
  const [resources, setResources] = useState([])
  const [tasks, setTasks] = useState([])
  const [allocations, setAllocations] = useState([])

  useEffect(() => {
    fetch('http://localhost:3000/resources').then(r => r.json()).then(setResources)
    fetch('http://localhost:3000/tasks').then(r => r.json()).then(setTasks)
    fetch('http://localhost:3000/allocations').then(r => r.json()).then(setAllocations)
  }, [])

  const totalCapacity = resources.reduce((sum, r) => sum + r.total_capacity, 0)
  const usedCapacity = resources.reduce((sum, r) => sum + (r.total_capacity - r.available_capacity), 0)
  const utilizationPercent = totalCapacity ? ((usedCapacity / totalCapacity) * 100).toFixed(1) : 0

  const pendingTasks = tasks.filter(t => t.status === 'PENDING').length
  const allocatedTasks = tasks.filter(t => t.status === 'ALLOCATED').length

  const chartData = [
    { name: 'Used', value: usedCapacity },
    { name: 'Available', value: totalCapacity - usedCapacity },
  ]

  const cardStyle = {
    background: '#1e293b',
    borderRadius: '12px',
    padding: '24px',
    border: '1px solid #334155'
  }

  return (
    <div>
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>Dashboard</h2>
      <p style={{ color: '#64748b', marginBottom: '32px' }}>Overview of your allocation system</p>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
        {[
          { label: 'Total Resources', value: resources.length, color: '#6366f1' },
          { label: 'Total Tasks', value: tasks.length, color: '#06b6d4' },
          { label: 'Pending Tasks', value: pendingTasks, color: '#f59e0b' },
          { label: 'Allocated Tasks', value: allocatedTasks, color: '#10b981' },
        ].map(stat => (
          <div key={stat.label} style={cardStyle}>
            <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '8px' }}>{stat.label}</p>
            <p style={{ fontSize: '32px', fontWeight: 'bold', color: stat.color }}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Chart Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div style={cardStyle}>
          <h3 style={{ marginBottom: '24px', color: '#e2e8f0' }}>Capacity Utilization</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={chartData} cx="50%" cy="50%" innerRadius={70} outerRadius={100} dataKey="value">
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <p style={{ textAlign: 'center', fontSize: '28px', fontWeight: 'bold', color: '#6366f1', marginTop: '8px' }}>
            {utilizationPercent}%
          </p>
          <p style={{ textAlign: 'center', color: '#64748b', fontSize: '14px' }}>Overall Utilization</p>
        </div>

        <div style={cardStyle}>
          <h3 style={{ marginBottom: '24px', color: '#e2e8f0' }}>Recent Allocations</h3>
          {allocations.length === 0 ? (
            <p style={{ color: '#64748b' }}>No allocations yet</p>
          ) : (
            allocations.slice(0, 5).map((a, i) => (
              <div key={i} style={{
                display: 'flex', justifyContent: 'space-between',
                padding: '12px 0', borderBottom: '1px solid #334155'
              }}>
                <span style={{ color: '#e2e8f0' }}>{a.task_name}</span>
                <span style={{ color: '#6366f1' }}>{a.resource_name}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}