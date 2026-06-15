import React from 'react';
import { adminStats, recentOrders } from '../data/dummyData';
import AdminProductManager from '../components/AdminProductManager';
import { DollarSign, ShoppingBag, Users, Activity, TrendingUp, MoreVertical } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
  const statCards = [
    { title: "Total Revenue", value: adminStats.totalRevenue, icon: <DollarSign className="h-6 w-6" />, growth: adminStats.revenueGrowth, color: "from-blue-500 to-blue-600" },
    { title: "Total Orders", value: adminStats.totalOrders, icon: <ShoppingBag className="h-6 w-6" />, growth: adminStats.ordersGrowth, color: "from-gold to-gold-dark" },
    { title: "Active Users", value: adminStats.activeUsers, icon: <Users className="h-6 w-6" />, growth: adminStats.usersGrowth, color: "from-purple-500 to-purple-600" },
    { title: "Conversion Rate", value: adminStats.conversionRate, icon: <Activity className="h-6 w-6" />, growth: adminStats.conversionGrowth, color: "from-emerald-500 to-emerald-600" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Dashboard Overview</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Welcome back! Here's what's happening with your store today.</p>
        </div>
        <button className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-2 rounded-lg font-medium hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors">
          Download Report
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            key={index} 
            className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} text-white shadow-md`}>
                {stat.icon}
              </div>
              <button className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                <MoreVertical className="h-5 w-5" />
              </button>
            </div>
            <div>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">{stat.title}</p>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">{stat.value}</h3>
              <div className="flex items-center text-emerald-500 text-sm font-medium">
                <TrendingUp className="h-4 w-4 mr-1" />
                {stat.growth} <span className="text-slate-400 ml-1 font-normal">vs last month</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-8">
        <AdminProductManager />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        {/* Chart Placeholder */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm h-96 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">Revenue Analytics</h3>
            <select className="bg-slate-50 dark:bg-slate-800 border-none text-sm text-slate-600 dark:text-slate-300 rounded-lg p-2 focus:ring-0">
              <option>This Week</option>
              <option>This Month</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="flex-1 flex items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950/50">
            <div className="text-center">
              <Activity className="h-12 w-12 text-gold mx-auto mb-3 opacity-50" />
              <p className="text-slate-500 dark:text-slate-400 font-medium">Interactive Chart Placeholder</p>
              <p className="text-sm text-slate-400 dark:text-slate-500">Would integrate Recharts or Chart.js here</p>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-0 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col h-96">
          <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">Recent Orders</h3>
            <button className="text-sm font-medium text-gold hover:text-gold-dark transition-colors">View All</button>
          </div>
          <div className="flex-1 overflow-y-auto">
            {recentOrders.map((order, idx) => (
              <div key={idx} className="p-4 border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-800 dark:text-white text-sm mb-0.5">{order.id}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{order.customer}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-800 dark:text-white text-sm mb-0.5">{order.total}</p>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    order.status === 'Delivered' ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400' :
                    order.status === 'Processing' ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400' :
                    order.status === 'Shipped' ? 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400' :
                    'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
