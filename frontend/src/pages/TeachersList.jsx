import React from 'react';
import { Search, Plus, Filter, MoreHorizontal, Edit2, Trash2 } from 'lucide-react';

export default function TeachersList() {
  const teachers = [
    { id: '#T-00134', name: 'Alexander Jones', subject: 'Mathematics', address: '89101 Jakarta, Indonesia', contact: '+62 821-3312-3498' },
    { id: '#T-00135', name: 'Samantha Smith', subject: 'English literature', address: '89101 Jakarta, Indonesia', contact: '+62 821-3312-3498' },
    { id: '#T-00136', name: 'Michael Brown', subject: 'Chemistry', address: '89101 Jakarta, Indonesia', contact: '+62 821-3312-3498' },
    { id: '#T-00137', name: 'Emily Davis', subject: 'History', address: '89101 Jakarta, Indonesia', contact: '+62 821-3312-3498' },
    { id: '#T-00138', name: 'Daniel Wilson', subject: 'Physics', address: '89101 Jakarta, Indonesia', contact: '+62 821-3312-3498' },
    { id: '#T-00139', name: 'Emma Taylor', subject: 'Biology', address: '89101 Jakarta, Indonesia', contact: '+62 821-3312-3498' },
    { id: '#T-00140', name: 'Olivia Anderson', subject: 'Art History', address: '89101 Jakarta, Indonesia', contact: '+62 821-3312-3498' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Teachers</h1>
          <p className="text-slate-500 text-sm mt-1">You have 104,687 teachers</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-600 font-medium hover:bg-slate-50 shadow-sm">
            <Filter className="w-4 h-4" /> Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 shadow-sm shadow-indigo-500/30 w-full md:w-auto justify-center">
            <Plus className="w-4 h-4" /> New Teacher
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by name, ID or subject..." 
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead>
              <tr className="bg-slate-50/50 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                <th className="px-6 py-4 w-12">
                  <input type="checkbox" className="rounded text-indigo-500 focus:ring-indigo-500" />
                </th>
                <th className="px-6 py-4">Teacher Name</th>
                <th className="px-6 py-4">Subject</th>
                <th className="px-6 py-4">Address</th>
                <th className="px-6 py-4">Contact No</th>
                <th className="px-6 py-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {teachers.map(teacher => (
                <tr key={teacher.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <input type="checkbox" className="rounded text-indigo-500 focus:ring-indigo-500" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-lg shrink-0">
                        {teacher.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-sm text-slate-800">{teacher.name}</p>
                        <p className="text-xs text-slate-400">{teacher.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-600">
                     <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg">{teacher.subject}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">{teacher.address}</td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-700">{teacher.contact}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                       <button className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-lg" title="Edit"><Edit2 className="w-4 h-4" /></button>
                       <button className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded-lg" title="Delete"><Trash2 className="w-4 h-4" /></button>
                    </div>
                    <button className="p-1.5 text-slate-400 group-hover:hidden"><MoreHorizontal className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-slate-100 flex justify-between items-center text-sm text-slate-500">
           <p>Showing 1 to 7 of {teachers.length} entries</p>
           <div className="flex gap-1">
             <button className="px-3 py-1 flex items-center justify-center border border-slate-200 rounded text-slate-400 hover:bg-slate-50">Prev</button>
             <button className="px-3 py-1 flex items-center justify-center border border-indigo-500 bg-indigo-50 text-indigo-600 rounded font-medium">1</button>
             <button className="px-3 py-1 flex items-center justify-center border border-slate-200 rounded text-slate-600 hover:bg-slate-50">2</button>
             <button className="px-3 py-1 flex items-center justify-center border border-slate-200 rounded text-slate-400 hover:bg-slate-50">Next</button>
           </div>
        </div>
      </div>
    </div>
  );
}
