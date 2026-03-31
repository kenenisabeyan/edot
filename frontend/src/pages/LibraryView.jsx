import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { BookOpen, Search, Download } from 'lucide-react';

export default function LibraryView() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const { data } = await api.get('/library');
        setResources(data.data || []);
      } catch (err) {
        console.error('Failed to fetch library resources', err);
      } finally {
        setLoading(false);
      }
    };
    fetchResources();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in flex flex-col space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Digital Library</h1>
          <p className="text-slate-500 text-sm mt-1">Explore books, research papers, and more.</p>
        </div>
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-3 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search resources..." 
            className="pl-10 pr-4 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 w-64"
          />
        </div>
      </div>

      {resources.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center justify-center">
           <div className="w-20 h-20 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mb-4">
             <BookOpen className="w-10 h-10" />
           </div>
           <h3 className="text-xl font-bold text-slate-900 mb-2">No resources found</h3>
           <p className="text-slate-500 max-w-sm mb-6">The library is empty right now. Check back later!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {resources.map((resource) => (
            <div key={resource._id} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col group">
              <div className="h-40 bg-indigo-50 flex items-center justify-center">
                 <BookOpen className="w-16 h-16 text-indigo-300" />
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded inline-block mb-2">
                    {resource.category || 'Other'}
                  </span>
                  <h3 className="font-bold text-lg text-slate-800 line-clamp-2 leading-tight mb-1">{resource.title}</h3>
                  <p className="text-slate-500 text-sm mb-4">By {resource.author}</p>
                </div>
                <button className="w-full flex justify-center items-center gap-2 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition-colors">
                  <Download className="w-4 h-4" /> Download PDF
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
