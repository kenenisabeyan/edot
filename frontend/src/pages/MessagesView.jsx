import React, { useState, useEffect, useRef } from 'react';
import { Search, Edit, MoreVertical, Paperclip, ImageIcon, Send, Smile, Phone, Video, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

export default function MessagesView() {
  const { user } = useAuth();
  const [contacts, setContacts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activeContact, setActiveContact] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const messagesEndRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch Contacts
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const { data } = await api.get('/messages/contacts');
        if (data.success) {
          setContacts(data.data);
        }
      } catch (err) {
        console.error('Failed to fetch contacts:', err);
      } finally {
        setLoadingContacts(false);
      }
    };
    fetchContacts();
  }, []);

  // Fetch Messages logic
  const fetchMessages = async (contactId, silent = false) => {
    if (!silent) setLoadingMessages(true);
    try {
      const { data } = await api.get(`/messages/conversation/${contactId}`);
      if (data.success) {
        setMessages(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch messages:', err);
    } finally {
      if (!silent) setLoadingMessages(false);
    }
  };

  // Handle Contact Selection & Polling
  useEffect(() => {
    let interval;
    if (activeContact) {
      fetchMessages(activeContact._id);
      // Poll every 3 seconds for new messages
      interval = setInterval(() => {
        fetchMessages(activeContact._id, true);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [activeContact]);

  // Send Message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeContact) return;

    const messageText = newMessage;
    setNewMessage(''); // optimistic clear

    try {
      const { data } = await api.post('/messages', {
        receiverId: activeContact._id,
        content: messageText
      });
      if (data.success) {
        setMessages(prev => [...prev, data.data]);
        scrollToBottom();
      }
    } catch (err) {
      console.error('Failed to send message:', err);
      // Restore message if failed
      setNewMessage(messageText);
    }
  };

  const filteredContacts = contacts.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
                 placeholder="Search users..." 
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
               />
             </div>
             <button className="p-2 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 transition-colors">
                <Edit className="w-5 h-5" />
             </button>
           </div>
           
           <div className="flex-1 overflow-y-auto p-2 space-y-1">
             {loadingContacts ? (
               <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-indigo-500" /></div>
             ) : filteredContacts.length === 0 ? (
               <div className="text-center p-8 text-slate-400 text-sm">No users found.</div>
             ) : (
               filteredContacts.map(contact => (
                 <div 
                   key={contact._id} 
                   onClick={() => setActiveContact(contact)}
                   className={`p-3 rounded-2xl flex items-center gap-3 cursor-pointer transition-colors ${activeContact?._id === contact._id ? 'bg-indigo-50 border border-indigo-100' : 'hover:bg-slate-50 border border-transparent'}`}
                 >
                   <div className="relative">
                     <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shrink-0 ${activeContact?._id === contact._id ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30' : 'bg-slate-100 text-slate-600'}`}>
                       {contact.name.charAt(0).toUpperCase()}
                     </div>
                   </div>
                   <div className="flex-1 min-w-0">
                     <div className="flex justify-between items-center mb-1">
                       <h4 className="font-bold text-slate-800 text-sm truncate">{contact.name}</h4>
                     </div>
                     <p className={`text-xs truncate capitalize ${activeContact?._id === contact._id ? 'text-indigo-800/80 font-medium' : 'text-slate-500'}`}>{contact.role || 'User'}</p>
                   </div>
                 </div>
               ))
             )}
           </div>
         </div>

         {/* Right Sidebar - Chat Interface */}
         <div className="flex-1 flex flex-col hidden md:flex">
            {!activeContact ? (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                <div className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center mb-4">
                  <Smile className="w-8 h-8 text-slate-300" />
                </div>
                <p>Select a conversation from the left to start messaging</p>
              </div>
            ) : (
              <>
                {/* Chat Header */}
                <div className="h-16 border-b border-slate-100 flex justify-between items-center px-6 bg-white shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-white shadow-md shadow-indigo-500/30 shrink-0">
                        {activeContact.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></div>
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800">{activeContact.name}</h3>
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
                  {loadingMessages ? (
                    <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-indigo-500" /></div>
                  ) : messages.length === 0 ? (
                    <div className="text-center p-8 text-slate-400 text-sm">No messages yet. Send a greeting!</div>
                  ) : (
                    messages.map((msg, idx) => {
                      const isMine = msg.senderId === user?._id || msg.senderId === user?.id; // fallback logic
                      const timeString = new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                      return (
                        <div key={msg._id || idx} className={`flex gap-3 max-w-lg ${isMine ? 'ml-auto justify-end' : ''}`}>
                          {!isMine && (
                            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-xs text-white shadow-md shadow-indigo-500/30 shrink-0 mt-auto">
                              {activeContact.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}>
                            <div className={`p-4 rounded-2xl shadow-sm text-sm ${isMine ? 'bg-indigo-600 text-white rounded-br-sm shadow-indigo-500/20' : 'bg-white text-slate-700 rounded-bl-sm border border-slate-100'}`}>
                              {msg.content}
                            </div>
                            <div className={`text-xs font-medium text-slate-400 mt-1 ${isMine ? 'mr-1' : 'ml-1'}`}>
                              {timeString} {isMine && msg.isRead && '• Read'}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Chat Input */}
                <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-100 bg-white shrink-0">
                  <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl p-2 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition-all">
                      <button type="button" className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-200 rounded-xl transition-colors"><Paperclip className="w-5 h-5" /></button>
                      <button type="button" className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-200 rounded-xl transition-colors"><ImageIcon className="w-5 h-5" /></button>
                      <input 
                        type="text" 
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message here..." 
                        className="flex-1 bg-transparent border-none focus:outline-none text-sm text-slate-700 px-2"
                      />
                      <button type="button" className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-200 rounded-xl transition-colors"><Smile className="w-5 h-5" /></button>
                      <button type="submit" disabled={!newMessage.trim()} className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 shadow-md shadow-indigo-500/30 transition-transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"><Send className="w-5 h-5" /></button>
                  </div>
                </form>
              </>
            )}
         </div>
      </div>
    </div>
  );
}
