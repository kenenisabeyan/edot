import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { BellRing, Pin } from 'lucide-react';

export default function NoticeView() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const { data } = await api.get('/notices');
        setNotices(data.data || []);
      } catch (err) {
        console.error('Failed to fetch notices', err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotices();
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">School Notices</h1>
          <p className="text-slate-500 text-sm mt-1">Stay updated with the latest announcements.</p>
        </div>
      </div>

      {notices.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center justify-center">
           <div className="w-20 h-20 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mb-4">
             <BellRing className="w-10 h-10" />
           </div>
           <h3 className="text-xl font-bold text-slate-900 mb-2">Caught up!</h3>
           <p className="text-slate-500 max-w-sm mb-6">There are no new notices at this time.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {notices.map((notice) => (
            <div key={notice._id} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden p-6 hover:shadow-md transition-shadow relative">
                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shrink-0">
                    <Pin className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="font-bold text-lg text-slate-800">{notice.title}</h3>
                      <span className="text-xs font-semibold text-slate-400 bg-slate-50 px-2 py-1 rounded">
                        {new Date(notice.date).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-slate-600 whitespace-pre-wrap">{notice.content}</p>
                  </div>
                </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
