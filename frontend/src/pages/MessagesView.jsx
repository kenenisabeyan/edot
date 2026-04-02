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
          <h1 className="text-2xl font-display font-bold text-white">Messages</h1>
          <p className="text-slate-300 text-sm mt-1">Communicate with students, teachers, and parents.</p>
        </div>
      </div>

      <div className="rounded-3xl border-t md:border border-white/5 bg-[#0B0E14] shadow-sm overflow-hidden flex-1 flex h-full relative -mb-4 md:mb-0">
         
         {/* Left Sidebar - Contact List */}
         <div className={`w-full md:w-80 lg:w-96 border-r border-white/10 flex-col shrink-0 bg-[#0B0E14]/50 backdrop-blur-xl z-10 ${activeContact ? 'hidden md:flex' : 'flex'}`}>
           <div className="p-3 md:p-4 border-b border-white/10 flex items-center justify-between bg-white/5 h-16 shrink-0">
             <div className="relative flex-1 mr-2">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-slate-400" />
               <input 
                 type="text" 
                 placeholder="Search users..." 
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="w-full pl-9 pr-4 py-[9px] bg-[#0B0E14] border border-white/10 text-white placeholder-slate-500 rounded-full text-[14px] focus:outline-none focus:ring-1 focus:ring-[#FFD700] focus:border-[#FFD700] transition-colors"
               />
             </div>
             <button className="p-[9px] bg-white/5 text-[#FFD700] rounded-full hover:bg-white/10 transition-colors border border-white/5">
                <Edit className="w-5 h-5" />
             </button>
           </div>
           
           <div className="flex-1 overflow-y-auto space-y-0 bg-transparent custom-scrollbar">
             {loadingContacts ? (
               <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-[#FFD700]" /></div>
             ) : filteredContacts.length === 0 ? (
               <div className="text-center p-8 text-slate-400 text-sm">No users found.</div>
             ) : (
               filteredContacts.map(contact => (
                 <div 
                   key={contact._id} 
                   onClick={() => setActiveContact(contact)}
                   className={`p-3 mx-2 my-1 rounded-2xl flex items-center gap-3 cursor-pointer transition-colors ${activeContact?._id === contact._id ? 'bg-gradient-to-r from-[#008A32] to-[#006622] text-white shadow-sm border border-[#008A32]/20' : 'hover:bg-white/5 border border-transparent text-white'}`}
                 >
                   <div className="relative">
                     <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shrink-0 overflow-hidden ${activeContact?._id === contact._id ? 'bg-white/20 text-white' : 'bg-white/5 text-[#FFD700]'}`}>
                       {contact.avatar && contact.avatar !== 'default-avatar.png' ? (
                          <img src={`http://localhost:5000${contact.avatar}`} alt="Avatar" className="w-full h-full object-cover" />
                       ) : (
                          contact.name.charAt(0).toUpperCase()
                       )}
                     </div>
                     {contact.isOnline && <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#008A32] border-2 border-[#0B0E14] rounded-full"></div>}
                   </div>
                   <div className="flex-1 min-w-0">
                     <div className="flex justify-between items-center mb-0.5">
                       <h4 className={`font-semibold text-[15px] truncate ${activeContact?._id === contact._id ? 'text-white' : 'text-white'}`}>{contact.name}</h4>
                       {contact.unreadCount > 0 ? (
                         <span className={`${activeContact?._id === contact._id ? 'bg-white/20 text-white' : 'bg-[#E30A17] text-white'} text-[11px] font-bold px-2 py-0.5 rounded-full shrink-0 shadow-sm ml-2`}>
                           {contact.unreadCount > 99 ? '99+' : contact.unreadCount}
                         </span>
                       ) : (
                         <span className={`text-[12px] ${activeContact?._id === contact._id ? 'text-white/70' : 'text-slate-500'}`}></span>
                       )}
                     </div>
                     <p className={`text-[14px] truncate capitalize ${activeContact?._id === contact._id ? 'text-white/80' : 'text-slate-400'}`}>{contact.role || 'User'}</p>
                   </div>
                 </div>
               ))
             )}
           </div>
         </div>

         {/* Right Sidebar - Chat Interface */}
         <div className={`flex-1 flex flex-col bg-[#0B0E14] relative ${activeContact ? 'flex' : 'hidden md:flex'}`}>
            <div className="absolute inset-0 max-w-full z-0 pointer-events-none opacity-[0.03]" style={{backgroundImage: 'radial-gradient(circle at center, #FFD700 1px, transparent 1px)', backgroundSize: '24px 24px'}}></div>
            
            {!activeContact ? (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400 relative z-10">
                <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mb-4">
                  <Smile className="w-8 h-8 text-slate-500" />
                </div>
                <p>Select a conversation from the left to start messaging</p>
              </div>
            ) : (
              <>
                {/* Chat Header */}
                <div className="h-16 border-b border-white/10 flex justify-between items-center px-2 md:px-6 bg-white/5 backdrop-blur-md shrink-0 shadow-sm z-20">
                  <div className="flex items-center gap-2 md:gap-3">
                    <button 
                      onClick={() => setActiveContact(null)}
                      className="md:hidden p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-full transition-colors flex items-center justify-center"
                    >
                      <ArrowLeft className="w-6 h-6" />
                    </button>
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-white/10 border border-[#FFD700]/30 flex items-center justify-center font-bold text-[#FFD700] shadow-sm shrink-0 overflow-hidden">
                        {activeContact.avatar && activeContact.avatar !== 'default-avatar.png' ? (
                          <img src={`http://localhost:5000${activeContact.avatar}`} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                          activeContact.name.charAt(0).toUpperCase()
                        )}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-[16px] text-white leading-tight">{activeContact.name}</h3>
                      <p className="text-[13px] text-[#FFD700] mt-0.5">last seen recently</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 md:gap-2 text-slate-400 pr-2">
                    <button className="p-2 hover:bg-white/5 hover:text-[#FFD700] rounded-full transition-colors"><Phone className="w-[20px] h-[20px]" /></button>
                    <button className="p-2 hover:bg-white/5 hover:text-[#FFD700] rounded-full transition-colors"><Video className="w-[20px] h-[20px]" /></button>
                    <div className="w-px h-5 bg-white/10 mx-1"></div>
                    <button className="p-2 hover:bg-white/5 hover:text-[#FFD700] rounded-full transition-colors"><Search className="w-[20px] h-[20px]" /></button>
                    <button className="p-2 hover:bg-white/5 hover:text-[#FFD700] rounded-full transition-colors hidden sm:block"><MoreVertical className="w-[20px] h-[20px]" /></button>
                  </div>
                </div>

                {/* Chat History */}
                <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-transparent relative z-10 space-y-4">
                  {loadingMessages ? (
                    <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-[#FFD700]" /></div>
                  ) : messages.length === 0 ? (
                    <div className="text-center p-8">
                       <span className="bg-white/10 text-slate-300 border border-white/5 rounded-full px-4 py-1.5 text-sm font-medium">No messages here yet...</span>
                    </div>
                  ) : (
                    messages.map((msg, idx) => {
                      const isMine = msg.senderId === user?._id || msg.senderId === user?.id; // fallback logic
                      const timeString = new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                      return (
                        <div key={msg._id || idx} className={`flex gap-3 max-w-[85%] md:max-w-[70%] ${isMine ? 'ml-auto justify-end' : ''}`}>
                          {!isMine && (
                            <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-bold text-xs text-[#FFD700] shadow-sm shrink-0 mt-auto overflow-hidden hidden md:flex">
                              {activeContact.avatar && activeContact.avatar !== 'default-avatar.png' ? (
                                <img src={`http://localhost:5000${activeContact.avatar}`} alt="Avatar" className="w-full h-full object-cover" />
                              ) : (
                                activeContact.name.charAt(0).toUpperCase()
                              )}
                            </div>
                          )}
                          <div className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}>
                            {/* Message Bubble */}
                            <div className={`p-3 md:p-[14px] shadow-sm text-[15px] leading-relaxed relative border ${isMine ? 'bg-[#008A32]/20 border-[#008A32]/30 text-white rounded-2xl rounded-br-[6px]' : 'bg-white/5 border-white/10 text-white rounded-2xl rounded-bl-[6px] backdrop-blur-md'}`}>
                              {msg.content}
                              
                              <div className={`text-[11px] font-medium mt-1 flex items-center justify-end gap-1 ${isMine ? 'text-[#FFD700]/80' : 'text-slate-400'}`}>
                                <span>{timeString}</span>
                                {isMine && (
                                  <span className={`text-[#FFD700] transition-opacity duration-300 ${msg.isRead ? 'opacity-100 font-bold' : 'opacity-80'}`}>
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
                <form onSubmit={handleSendMessage} className="p-3 bg-[#0B0E14] shrink-0 border-t border-white/10 sticky bottom-0 z-20">
                  <div className="flex items-center gap-1 bg-[#0B0E14] border border-white/10 rounded-full p-2 pr-2 shadow-sm focus-within:ring-1 focus-within:ring-[#FFD700]/50 focus-within:border-[#FFD700] transition-all max-w-4xl mx-auto">
                      <button type="button" className="p-2 text-slate-400 hover:text-[#FFD700] rounded-full transition-colors shrink-0"><Smile className="w-6 h-6" /></button>
                      <input 
                        type="text" 
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Message..." 
                        className="flex-1 bg-transparent border-none focus:outline-none text-[15.5px] text-white px-2 placeholder-slate-500 min-w-0"
                      />
                      <button type="button" className="p-2 text-slate-400 hover:text-[#FFD700] rounded-full transition-colors shrink-0"><Paperclip className="w-5 h-5 -rotate-45" /></button>
                      {newMessage.trim() ? (
                        <button type="submit" className="p-2.5 bg-gradient-to-r from-[#008A32] to-[#006622] text-white rounded-full hover:shadow-lg hover:shadow-[#008A32]/20 transition-transform active:scale-95 flex items-center justify-center shrink-0 border border-[#008A32]">
                          <Send className="w-[18px] h-[18px] ml-0.5" />
                        </button>
                      ) : (
                        <button type="button" className="p-2.5 text-slate-400 hover:text-white rounded-full hover:bg-white/5 transition-colors flex items-center justify-center shrink-0">
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
