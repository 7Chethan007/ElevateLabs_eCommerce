import React, { useState, useEffect, useContext } from 'react';
import { GlobalState } from '../../GlobalState';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    LineChart, Line, PieChart, Pie, Cell 
} from 'recharts';

const Analytics = () => {
    const state = useContext(GlobalState);
    const [isAdmin] = state.userAPI.isAdmin;
    const [analytics, setAnalytics] = useState({
        totalProducts: 0,
        totalUsers: 0,
        totalOrders: 0,
        revenue: 0,
        topProducts: [],
        userGrowth: [],
        categoryDistribution: []
    });

    useEffect(() => {
        // Simulate analytics data - In real app, fetch from API
        const mockAnalytics = {
            totalProducts: 125,
            totalUsers: 1547,
            totalOrders: 892,
            revenue: 45670.50,
            topProducts: [
                { name: 'Laptop Pro', sales: 45, revenue: 12500 },
                { name: 'Smartphone X', sales: 38, revenue: 9500 },
                { name: 'Wireless Headphones', sales: 32, revenue: 6400 },
                { name: 'Gaming Mouse', sales: 28, revenue: 2800 },
                { name: 'Mechanical Keyboard', sales: 25, revenue: 3750 }
            ],
            userGrowth: [
                { month: 'Jan', users: 120 },
                { month: 'Feb', users: 180 },
                { month: 'Mar', users: 250 },
                { month: 'Apr', users: 320 },
                { month: 'May', users: 420 },
                { month: 'Jun', users: 580 }
            ],
            categoryDistribution: [
                { name: 'Electronics', value: 45, color: '#8884d8' },
                { name: 'Clothing', value: 25, color: '#82ca9d' },
                { name: 'Books', value: 15, color: '#ffc658' },
                { name: 'Home & Garden', value: 10, color: '#ff7c7c' },
                { name: 'Sports', value: 5, color: '#8dd1e1' }
            ]
        };
        setAnalytics(mockAnalytics);
    }, []);

    if (!isAdmin) {
        return (
            <div className="analytics-container">
                <div className="access-denied">
                    <h2>Access Denied</h2>
                    <p>You need admin privileges to view analytics</p>
                </div>
            </div>
        );
    }

    return (
        <div className="analytics-container">
            <div className="analytics-header">
                <h1>📊 Business Analytics Dashboard</h1>
                <div className="date-filter">
                    <select>
                        <option>Last 30 days</option>
                        <option>Last 3 months</option>
                        <option>Last 6 months</option>
                        <option>Last year</option>
                    </select>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="kpi-grid">
                <div className="kpi-card">
                    <div className="kpi-icon">🛍️</div>
                    <div className="kpi-content">
                        <h3>{analytics.totalProducts}</h3>
                        <p>Total Products</p>
                        <span className="trend positive">+12% from last month</span>
                    </div>
                </div>
                <div className="kpi-card">
                    <div className="kpi-icon">👥</div>
                    <div className="kpi-content">
                        <h3>{analytics.totalUsers.toLocaleString()}</h3>
                        <p>Active Users</p>
                        <span className="trend positive">+18% from last month</span>
                    </div>
                </div>
                <div className="kpi-card">
                    <div className="kpi-icon">📦</div>
                    <div className="kpi-content">
                        <h3>{analytics.totalOrders}</h3>
                        <p>Total Orders</p>
                        <span className="trend positive">+25% from last month</span>
                    </div>
                </div>
                <div className="kpi-card">
                    <div className="kpi-icon">💰</div>
                    <div className="kpi-content">
                        <h3>${analytics.revenue.toLocaleString()}</h3>
                        <p>Revenue</p>
                        <span className="trend positive">+32% from last month</span>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="charts-grid">
                {/* User Growth Chart */}
                <div className="chart-card">
                    <h3>📈 User Growth Trend</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={analytics.userGrowth}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="users" stroke="#8884d8" strokeWidth={3} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Top Products Chart */}
                <div className="chart-card">
                    <h3>🏆 Top Selling Products</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={analytics.topProducts}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="sales" fill="#82ca9d" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Category Distribution */}
                <div className="chart-card">
                    <h3>🎯 Category Distribution</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={analytics.categoryDistribution}
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                                {analytics.categoryDistribution.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Real-time Metrics */}
                <div className="chart-card realtime-metrics">
                    <h3>⚡ Real-time Metrics</h3>
                    <div className="metric-row">
                        <span>Active Sessions:</span>
                        <strong>127</strong>
                    </div>
                    <div className="metric-row">
                        <span>Bounce Rate:</span>
                        <strong>24.5%</strong>
                    </div>
                    <div className="metric-row">
                        <span>Avg. Session Duration:</span>
                        <strong>4m 32s</strong>
                    </div>
                    <div className="metric-row">
                        <span>Conversion Rate:</span>
                        <strong>3.2%</strong>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
