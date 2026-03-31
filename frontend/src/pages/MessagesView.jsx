import React, { useState } from 'react';
import { Search, Edit, MoreVertical, Paperclip, ImageIcon, Send, Smile, Phone, Video } from 'lucide-react';

export default function MessagesView() {
  const contacts = [
    { id: 1, name: 'Samantha Smith', role: 'Student', avatar: 'S', message: 'Can I submit the assignment...', time: '12:00 PM', active: true, online: true },
    { id: 2, name: 'Michael Brown', role: 'Teacher', avatar: 'M', message: 'Please review the syllabus...', time: '11:45 AM', online: false },
    { id: 3, name: 'Emily Davis', role: 'Student', avatar: 'E', message: 'When is the next exam?', time: 'Yesterday', online: true },
    { id: 4, name: 'Daniel Wilson', role: 'Parent', avatar: 'D', message: 'Thanks for the update!', time: 'Yesterday', online: false },
    { id: 5, name: 'Emma Taylor', role: 'Teacher', avatar: 'T', message: 'Meeting at 3 PM.', time: 'Monday', online: true },
    { id: 6, name: 'Olivia Anderson', role: 'Student', avatar: 'O', message: 'Got it, thanks!', time: 'Monday', online: false },
  ];

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Messages</h1>
          <p className="text-slate-500 text-sm mt-1">Communicate with students, teachers, and parents.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex-1 flex h-full">
         
         {/* Left Sidebar - Contact List */}
         <div className="w-full md:w-80 border-r border-slate-100 flex flex-col shrink-0">
           <div className="p-4 border-b border-slate-100 flex items-center justify-between">
             <div className="relative flex-1 mr-2">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
               <input 
                 type="text" 
                 placeholder="Search messages..." 
                 className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
               />
             </div>
             <button className="p-2 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 transition-colors">
                <Edit className="w-5 h-5" />
             </button>
           </div>
           
           <div className="flex-1 overflow-y-auto p-2 space-y-1">
             {contacts.map(contact => (
               <div key={contact.id} className={`p-3 rounded-2xl flex items-center gap-3 cursor-pointer transition-colors ${contact.active ? 'bg-indigo-50 border border-indigo-100' : 'hover:bg-slate-50 border border-transparent'}`}>
                 <div className="relative">
                   <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shrink-0 ${contact.active ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30' : 'bg-slate-100 text-slate-600'}`}>
                     {contact.avatar}
                   </div>
                   {contact.online && (
                     <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
                   )}
                 </div>
                 <div className="flex-1 min-w-0">
                   <div className="flex justify-between items-center mb-1">
                     <h4 className="font-bold text-slate-800 text-sm truncate">{contact.name}</h4>
                     <span className={`text-xs ${contact.active ? 'text-indigo-600 font-bold' : 'text-slate-400 font-medium'}`}>{contact.time}</span>
                   </div>
                   <p className={`text-xs truncate ${contact.active ? 'text-indigo-800' : 'text-slate-500'}`}>{contact.message}</p>
                 </div>
               </div>
             ))}
           </div>
         </div>

         {/* Right Sidebar - Chat Interface */}
         <div className="flex-1 flex flex-col hidden md:flex">
            
            {/* Chat Header */}
            <div className="h-16 border-b border-slate-100 flex justify-between items-center px-6 bg-white shrink-0">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-white shadow-md shadow-indigo-500/30 shrink-0">
                    S
                  </div>
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></div>
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">Samantha Smith</h3>
                  <p className="text-xs font-semibold text-emerald-500 flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span> Online</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-slate-400">
                <button className="p-2 hover:bg-slate-50 hover:text-indigo-600 rounded-full transition-colors"><Phone className="w-5 h-5" /></button>
                <button className="p-2 hover:bg-slate-50 hover:text-indigo-600 rounded-full transition-colors"><Video className="w-5 h-5" /></button>
                <div className="w-px h-6 bg-slate-200"></div>
                <button className="p-2 hover:bg-slate-50 hover:text-indigo-600 rounded-full transition-colors"><MoreVertical className="w-5 h-5" /></button>
              </div>
            </div>

            {/* Chat History */}
            <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50 space-y-6">
              <div className="text-center font-medium text-xs text-slate-400 uppercase tracking-wider mb-6">Today</div>
              
              {/* Receiver Message */}
              <div className="flex gap-3 max-w-lg">
                <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-xs text-white shadow-md shadow-indigo-500/30 shrink-0 mt-auto">S</div>
                <div>
                  <div className="bg-white p-4 rounded-2xl rounded-bl-sm border border-slate-100 shadow-sm text-slate-700 text-sm">
                    Hi Mrs. Linda, can I submit the assignment slightly late? I'm having issues with my laptop.
                  </div>
                  <div className="text-xs font-medium text-slate-400 mt-1 ml-1">11:58 AM</div>
                </div>
              </div>

              {/* Sender Message */}
              <div className="flex gap-3 max-w-lg ml-auto justify-end">
                <div className="items-end flex flex-col">
                  <div className="bg-indigo-600 text-white p-4 rounded-2xl rounded-br-sm shadow-md shadow-indigo-500/20 text-sm">
                    Hello Samantha, yes you can. I will give you a 24-hour extension. Make sure to clearly mention the issue in the submission notes.
                  </div>
                  <div className="text-xs font-medium text-slate-400 mt-1 mr-1">12:00 PM • Read</div>
                </div>
              </div>
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-slate-100 bg-white shrink-0">
               <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl p-2 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition-all">
                  <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-200 rounded-xl transition-colors"><Paperclip className="w-5 h-5" /></button>
                  <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-200 rounded-xl transition-colors"><ImageIcon className="w-5 h-5" /></button>
                  <input 
                    type="text" 
                    placeholder="Type your message here..." 
                    className="flex-1 bg-transparent border-none focus:outline-none text-sm text-slate-700 px-2"
                  />
                  <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-200 rounded-xl transition-colors"><Smile className="w-5 h-5" /></button>
                  <button className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 shadow-md shadow-indigo-500/30 transition-transform hover:-translate-y-0.5"><Send className="w-5 h-5" /></button>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
