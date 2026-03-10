// frontend/src/pages/tutor/TutorEarnings.jsx
import React from 'react';
import { CurrencyDollarIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/outline';

const TutorEarnings = () => {
  const earnings = {
    total: 18997,
    thisMonth: 2450,
    lastMonth: 2100,
    pending: 850
  };

  const transactions = [
    { id: 1, date: '2024-03-15', course: 'Web Development', amount: 899, status: 'paid' },
    { id: 2, date: '2024-03-14', course: 'React Masterclass', amount: 439, status: 'paid' },
    { id: 3, date: '2024-03-13', course: 'Node.js API', amount: 569, status: 'pending' },
    { id: 4, date: '2024-03-12', course: 'Web Development', amount: 899, status: 'paid' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-textPrimary">Earnings</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-cardBackground rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <CurrencyDollarIcon className="h-6 w-6 text-blue-600" />
            </div>
            <span className="text-2xl font-bold text-textPrimary">${earnings.total}</span>
          </div>
          <h3 className="text-textSecondary">Total Earnings</h3>
        </div>

        <div className="bg-cardBackground rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <ArrowTrendingUpIcon className="h-6 w-6 text-green-600" />
            </div>
            <span className="text-2xl font-bold text-textPrimary">${earnings.thisMonth}</span>
          </div>
          <h3 className="text-textSecondary">This Month</h3>
        </div>

        <div className="bg-cardBackground rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <CurrencyDollarIcon className="h-6 w-6 text-purple-600" />
            </div>
            <span className="text-2xl font-bold text-textPrimary">${earnings.lastMonth}</span>
          </div>
          <h3 className="text-textSecondary">Last Month</h3>
        </div>

        <div className="bg-cardBackground rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-100 rounded-lg">
              <CurrencyDollarIcon className="h-6 w-6 text-orange-600" />
            </div>
            <span className="text-2xl font-bold text-textPrimary">${earnings.pending}</span>
          </div>
          <h3 className="text-textSecondary">Pending</h3>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-cardBackground rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-textPrimary mb-4">Recent Transactions</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">
                  Course
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td className="px-6 py-4 text-textSecondary">{transaction.date}</td>
                  <td className="px-6 py-4 font-semibold text-textPrimary">{transaction.course}</td>
                  <td className="px-6 py-4 text-textSecondary">${transaction.amount}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      transaction.status === 'paid'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {transaction.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TutorEarnings;