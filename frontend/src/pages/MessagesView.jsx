import React, { useState, useEffect, useRef } from 'react';
import { Search, Edit, MoreVertical, Paperclip, Send, Smile, Phone, Video, Loader2, ArrowLeft, Mic } from 'lucide-react';
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
          setContacts(prev => {
            // If active contact exists, ensure its unread count is zeroed out during active view
            return data.data.map(contact => {
               // checking both conditions if it's the currently active contact or not
               if (activeContact && contact._id === activeContact._id) {
                 return { ...contact, unreadCount: 0 };
               }
               return contact;
            });
          });
        }
      } catch (err) {
        console.error('Failed to fetch contacts:', err);
      } finally {
        setLoadingContacts(false);
      }
    };
    
    fetchContacts();
    const intervalId = setInterval(fetchContacts, 5000);
    return () => clearInterval(intervalId);
  }, [activeContact]);

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
      // Clear unread badge locally for this contact
      setContacts(prev => prev.map(c => 
        c._id === activeContact._id ? { ...c, unreadCount: 0 } : c
      ));
      
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
    <div className="h-[calc(100vh-100px)] md:h-[calc(100vh-120px)] flex flex-col space-y-2 md:space-y-4 -mx-4 md:mx-0 px-2 md:px-0">
      <div className="flex justify-between items-center hidden md:flex">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Messages</h1>
          <p className="text-slate-500 text-sm mt-1">Communicate with students, teachers, and parents.</p>
        </div>
      </div>

      <div className="bg-white md:rounded-3xl border-t md:border border-slate-100 shadow-sm overflow-hidden flex-1 flex h-full relative -mb-4 md:mb-0">
         
         {/* Left Sidebar - Contact List */}
         <div className={`w-full md:w-80 lg:w-96 border-r border-[#e4e9f0] flex-col shrink-0 bg-white z-10 ${activeContact ? 'hidden md:flex' : 'flex'}`}>
           <div className="p-3 md:p-4 border-b border-[#e4e9f0] flex items-center justify-between bg-white h-16 shrink-0">
             <div className="relative flex-1 mr-2">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-slate-400" />
               <input 
                 type="text" 
                 placeholder="Search users..." 
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="w-full pl-9 pr-4 py-[9px] bg-[#f4f4f5] border border-transparent rounded-full text-[14px] focus:outline-none focus:bg-white focus:border-[#3390ec] transition-colors"
               />
             </div>
             <button className="p-[9px] bg-slate-100 text-[#3390ec] rounded-full hover:bg-slate-200 transition-colors">
                <Edit className="w-5 h-5" />
             </button>
           </div>
           
           <div className="flex-1 overflow-y-auto space-y-0 bg-white custom-scrollbar">
             {loadingContacts ? (
               <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-[#3390ec]" /></div>
             ) : filteredContacts.length === 0 ? (
               <div className="text-center p-8 text-slate-400 text-sm">No users found.</div>
             ) : (
               filteredContacts.map(contact => (
                 <div 
                   key={contact._id} 
                   onClick={() => setActiveContact(contact)}
                   className={`p-3 mx-2 my-1 rounded-2xl flex items-center gap-3 cursor-pointer transition-colors ${activeContact?._id === contact._id ? 'bg-[#3390ec] text-white shadow-sm' : 'hover:bg-[#f4f4f5] bg-white border border-transparent text-slate-800'}`}
                 >
                   <div className="relative">
                     <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shrink-0 overflow-hidden ${activeContact?._id === contact._id ? 'bg-white text-[#3390ec]' : 'bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-700'}`}>
                       {contact.avatar && contact.avatar !== 'default-avatar.png' ? (
                          <img src={`http://localhost:5000${contact.avatar}`} alt="Avatar" className="w-full h-full object-cover" />
                       ) : (
                          contact.name.charAt(0).toUpperCase()
                       )}
                     </div>
                     {contact.isOnline && <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#24d960] border-2 border-white rounded-full"></div>}
                   </div>
                   <div className="flex-1 min-w-0">
                     <div className="flex justify-between items-center mb-0.5">
                       <h4 className={`font-semibold text-[15px] truncate ${activeContact?._id === contact._id ? 'text-white' : 'text-slate-900'}`}>{contact.name}</h4>
                       {contact.unreadCount > 0 ? (
                         <span className={`${activeContact?._id === contact._id ? 'bg-white text-[#3390ec]' : 'bg-[#24d960] text-white'} text-[11px] font-bold px-2 py-0.5 rounded-full shrink-0 shadow-sm ml-2`}>
                           {contact.unreadCount > 99 ? '99+' : contact.unreadCount}
                         </span>
                       ) : (
                         <span className={`text-[12px] ${activeContact?._id === contact._id ? 'text-blue-200' : 'text-slate-400'}`}></span>
                       )}
                     </div>
                     <p className={`text-[14px] truncate capitalize ${activeContact?._id === contact._id ? 'text-white/80' : 'text-slate-500'}`}>{contact.role || 'User'}</p>
                   </div>
                 </div>
               ))
             )}
           </div>
         </div>

         {/* Right Sidebar - Chat Interface */}
         <div className={`flex-1 flex flex-col bg-[#e4e9f0] ${activeContact ? 'flex' : 'hidden md:flex'}`}>
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
                <div className="h-16 border-b border-[#d1d7e0] flex justify-between items-center px-2 md:px-6 bg-white shrink-0 shadow-sm z-20">
                  <div className="flex items-center gap-2 md:gap-3">
                    <button 
                      onClick={() => setActiveContact(null)}
                      className="md:hidden p-2 text-slate-500 hover:bg-slate-50 rounded-full transition-colors flex items-center justify-center"
                    >
                      <ArrowLeft className="w-6 h-6" />
                    </button>
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-sm shrink-0 overflow-hidden">
                        {activeContact.avatar && activeContact.avatar !== 'default-avatar.png' ? (
                          <img src={`http://localhost:5000${activeContact.avatar}`} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                          activeContact.name.charAt(0).toUpperCase()
                        )}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-[16px] text-slate-900 leading-tight">{activeContact.name}</h3>
                      <p className="text-[13px] text-[#3390ec] mt-0.5">last seen recently</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 md:gap-2 text-slate-400 pr-2">
                    <button className="p-2 hover:bg-slate-50 hover:text-[#3390ec] rounded-full transition-colors"><Phone className="w-[20px] h-[20px]" /></button>
                    <button className="p-2 hover:bg-slate-50 hover:text-[#3390ec] rounded-full transition-colors"><Video className="w-[20px] h-[20px]" /></button>
                    <div className="w-px h-5 bg-slate-200 mx-1"></div>
                    <button className="p-2 hover:bg-slate-50 hover:text-[#3390ec] rounded-full transition-colors"><Search className="w-[20px] h-[20px]" /></button>
                    <button className="p-2 hover:bg-slate-50 hover:text-[#3390ec] rounded-full transition-colors hidden sm:block"><MoreVertical className="w-[20px] h-[20px]" /></button>
                  </div>
                </div>

                {/* Chat History */}
                {/* Background image pattern is very common in Telegram. For now, solid #e4e9f0 is clean. */}
                <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-[#e4e9f0] space-y-4">
                  {loadingMessages ? (
                    <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-[#3390ec]" /></div>
                  ) : messages.length === 0 ? (
                    <div className="text-center p-8">
                       <span className="bg-black/10 text-white rounded-full px-4 py-1.5 text-sm font-medium">No messages here yet...</span>
                    </div>
                  ) : (
                    messages.map((msg, idx) => {
                      const isMine = msg.senderId === user?._id || msg.senderId === user?.id; // fallback logic
                      const timeString = new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                      return (
                        <div key={msg._id || idx} className={`flex gap-3 max-w-[85%] md:max-w-[70%] ${isMine ? 'ml-auto justify-end' : ''}`}>
                          {!isMine && (
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-xs text-white shadow-sm shrink-0 mt-auto overflow-hidden hidden md:flex">
                              {activeContact.avatar && activeContact.avatar !== 'default-avatar.png' ? (
                                <img src={`http://localhost:5000${activeContact.avatar}`} alt="Avatar" className="w-full h-full object-cover" />
                              ) : (
                                activeContact.name.charAt(0).toUpperCase()
                              )}
                            </div>
                          )}
                          <div className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}>
                            {/* Message Bubble */}
                            <div className={`p-3 md:p-[14px] shadow-sm text-[15px] leading-relaxed relative ${isMine ? 'bg-[#EEFFDE] text-slate-800 rounded-2xl rounded-br-[6px]' : 'bg-white text-slate-800 rounded-2xl rounded-bl-[6px]'}`}>
                              {msg.content}
                              
                              <div className={`text-[11px] font-medium mt-1 flex items-center justify-end gap-1 ${isMine ? 'text-green-700/60' : 'text-slate-400'}`}>
                                <span>{timeString}</span>
                                {isMine && (
                                  <span className={`text-[#4caf50] transition-opacity duration-300 ${msg.isRead ? 'opacity-100 font-bold' : 'opacity-80'}`}>
                                    {msg.isRead ? '✓✓' : '✓'}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Chat Input */}
                <form onSubmit={handleSendMessage} className="p-3 bg-[#e4e9f0] shrink-0 border-t border-[#d1d7e0]/50 sticky bottom-0">
                  <div className="flex items-center gap-1 bg-white rounded-full p-2 pr-2 shadow-sm focus-within:ring-2 focus-within:ring-[#3390ec]/30 transition-all max-w-4xl mx-auto">
                      <button type="button" className="p-2 text-slate-400 hover:text-[#3390ec] rounded-full transition-colors shrink-0"><Smile className="w-6 h-6" /></button>
                      <input 
                        type="text" 
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Message..." 
                        className="flex-1 bg-transparent border-none focus:outline-none text-[15.5px] text-slate-800 px-2 placeholder-slate-400 min-w-0"
                      />
                      <button type="button" className="p-2 text-slate-400 hover:text-[#3390ec] rounded-full transition-colors shrink-0"><Paperclip className="w-5 h-5 -rotate-45" /></button>
                      {newMessage.trim() ? (
                        <button type="submit" className="p-2.5 bg-[#3390ec] text-white rounded-full hover:bg-[#2b7bc9] transition-transform active:scale-95 flex items-center justify-center shrink-0">
                          <Send className="w-[18px] h-[18px] ml-0.5" />
                        </button>
                      ) : (
                        <button type="button" className="p-2.5 text-slate-400 hover:text-[#3390ec] rounded-full hover:bg-slate-50 transition-colors flex items-center justify-center shrink-0">
                          <Mic className="w-6 h-6" />
                        </button>
                      )}
                  </div>
                </form>
              </>
            )}
         </div>
      </div>
    </div>
  );
}
