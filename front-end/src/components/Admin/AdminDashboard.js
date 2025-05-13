import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';
import './AdminDashboard.css';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#a4de6c'];

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const user = useSelector(state => state.session.user);

  useEffect(() => {
    fetch("/api/admin/analytics", { credentials: "include" })
      .then(res => res.json())
      .then(setStats);
  }, []);

  if (!user?.is_admin) return <p>Access denied.</p>;
  if (!stats) return <p>Loading...</p>;

  const maxCount = Math.max(...(stats.daily?.map(d => d.count) || [1]));

  return (
    <div className="admin-dashboard-grid">
      <div className="dashboard-header full-width">
        <h2>📊 Reservation Analytics</h2>
        <p>Insights from the last 30 days</p>
      </div>

      <div className="summary-cards">
        <div className="card metric">🧾<strong>{stats.total_reservations}</strong><span>Total Reservations</span></div>
        <div className="card metric">👤<strong>{stats.total_users}</strong><span>Total Users</span></div>
        <div className="card metric">🏢<strong>{stats.total_restaurants}</strong><span>Total Restaurants</span></div>
        <div className="card metric">🍽️<strong>{stats.average_party_size}</strong><span>Avg. Table Size</span></div>
      </div>

      <div className="highlight full-width">
        <h3>🏆 Top Restaurant</h3>
        <p><strong>{stats.top_restaurant || '—'}</strong></p>
      </div>

      <div className="line-chart full-width">
        <h3>📈 Reservation Trends</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={stats.daily}>
            <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
            <XAxis dataKey="date" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Line type="monotone" dataKey="count" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-section">
        <h3>📅 Daily Reservation Bar</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={stats.daily}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {stats.top5_restaurants && (
        <div className="chart-section">
          <h3>🏅 Top 5 Restaurants by Reservations</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={stats.top5_restaurants} layout="vertical">
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" />
              <Tooltip />
              <Bar dataKey="count" fill="#ffc658" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {stats.day_of_week && (
        <div className="chart-section">
          <h3>📆 Reservations by Day of Week</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={stats.day_of_week}>
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#ff8042" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {stats.booking_frequency && (
        <div className="chart-section">
          <h3>🧍 User Booking Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={stats.booking_frequency}
                dataKey="count"
                nameKey="label"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {stats.booking_frequency.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
