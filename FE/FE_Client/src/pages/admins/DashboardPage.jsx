import React from 'react';

export default function DashboardPage() {
  const stats = [
    { label: 'Người dùng', value: '1,250', color: '#3498db' },
    { label: 'Doanh thu', value: '$5,000', color: '#2ecc71' },
    { label: 'Đơn hàng', value: '45', color: '#e67e22' },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: '20px' }}>Tổng quan hệ thống</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
        {stats.map((item, index) => (
          <div key={index} style={{ 
            padding: '20px', 
            backgroundColor: 'white', 
            borderRadius: '8px', 
            borderLeft: `5px solid ${item.color}`,
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
          }}>
            <p style={{ color: '#7f8c8d', margin: 0 }}>{item.label}</p>
            <h1 style={{ margin: '10px 0 0 0' }}>{item.value}</h1>
          </div>
        ))}
      </div>
    </div>
  );
}