import React, { useState, useEffect, useRef } from 'react';
import { Search, Edit, MoreVertical, Trash2, Paperclip, Send, Smile, Phone, Video, Loader2, ArrowLeft, Mic, Menu, Settings, Users, PhoneCall, Ban, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import io from 'socket.io-client';
import AgendaCreationModal from '../components/AgendaCreationModal';

const SOCKET_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:5000'
  : `${window.location.protocol}//${window.location.hostname}`;

const socket = io(SOCKET_BASE_URL, {
  withCredentials: true
});

export default function MessagesView() {
  const { user } = useAuth();
  const [contacts, setContacts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activeContact, setActiveContact] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const messagesEndRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Dynamic Modal States
  const [showAgendaModal, setShowAgendaModal] = useState(false);
  const [showCallModal, setShowCallModal] = useState(false);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showLeftMenu, setShowLeftMenu] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showBlockedModal, setShowBlockedModal] = useState(false);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [callType, setCallType] = useState('video'); // 'video' or 'audio'
  const [isCalling, setIsCalling] = useState(false);
  const [agendaDefaults, setAgendaDefaults] = useState({});
  const [groupActionLoading, setGroupActionLoading] = useState(false);
  const [activeGroupDetails, setActiveGroupDetails] = useState(null);
  
  // Group Create State
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDescription, setNewGroupDescription] = useState('');
  const [selectedGroupMembers, setSelectedGroupMembers] = useState([]);
  const [groupSearch, setGroupSearch] = useState('');
  const [groupType, setGroupType] = useState('group'); // group or channel
  
  // Block State
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockedUsers, setBlockedUsers] = useState([]);
  
  // Message edit/delete state
  const [editMessageId, setEditMessageId] = useState(null);
  const [editMessageContent, setEditMessageContent] = useState('');
  const [messageMenuOpenId, setMessageMenuOpenId] = useState(null);

  const isChannelReadOnly = activeContact?.type === 'channel' && activeContact.adminId !== user?.id;

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadContacts = async () => {
    try {
      const [contactRes, groupRes] = await Promise.all([
        api.get('/messages/contacts'),
        api.get('/messages/groups')
      ]);

      const users = contactRes.data.success ? contactRes.data.data.map(contact => ({
        ...contact,
        type: 'user',
        unreadCount: contact.unreadCount || 0,
        isOnline: true,
      })) : [];

      const groups = groupRes.data.success ? groupRes.data.data.map(group => ({
        ...group,
        unreadCount: 0,
        isOnline: true,
        type: group.type || (group.isChannel ? 'channel' : 'group'),
        role: group.type === 'channel' ? 'Channel' : 'Group',
      })) : [];

      const allItems = [...groups, ...users];
      setContacts(allItems);
      if (!activeContact && allItems.length > 0) {
        setActiveContact(allItems[0]);
      }
    } catch (err) {
      console.error('Failed to load contacts and groups:', err);
    } finally {
      setLoadingContacts(false);
    }
  };

  // Fetch Contacts and Groups
  useEffect(() => {
    loadContacts();
    const intervalId = setInterval(loadContacts, 5000);
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

  // Handle Contact Selection & Real-Time Socket Connection
  useEffect(() => {
    if (activeContact && user) {
      // Clear unread badge locally for this contact
      setContacts(prev => prev.map(c => 
        c.id === activeContact.id ? { ...c, unreadCount: 0 } : c
      ));
      
      fetchMessages(activeContact.id);

      const roomId = activeContact.type === 'group' || activeContact.type === 'channel'
        ? `group_${activeContact.id}`
        : [user.id, activeContact.id].sort().join('_');
      socket.emit('join_room', roomId);

      const receiveMessageHandler = (liveMsg) => {
        setMessages(prev => {
          if (prev.some(m => m.id === liveMsg.id)) return prev;
          return [...prev, liveMsg];
        });
        scrollToBottom();
      };

      socket.on('receive_message', receiveMessageHandler);

      return () => {
        socket.off('receive_message', receiveMessageHandler);
      };
    }
  }, [activeContact, user]);

  useEffect(() => {
    if (activeContact?.type === 'group' || activeContact?.type === 'channel') {
      fetchGroupDetails(activeContact.id);
    } else {
      setActiveGroupDetails(null);
    }
  }, [activeContact]);

  // Send Message & Optional File
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if ((!newMessage.trim() && !selectedFile) || !activeContact || isChannelReadOnly) return;

    const messageText = newMessage;
    const fileToUpload = selectedFile;
    setNewMessage(''); // optimistic clear
    setSelectedFile(null);

    try {
      let attachmentUrl = null;
      let attachmentType = null;

      // Execute file upload if file is selected
      if (fileToUpload) {
         const formData = new FormData();
         formData.append('image', fileToUpload); // existing upload route looks for 'image' fieldname
         
         const uploadRes = await api.post('/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
         });

         if (uploadRes.data.success) {
            attachmentUrl = uploadRes.data.filePath;
            attachmentType = fileToUpload.type.startsWith('image/') ? 'image' : 'file';
         }
      }

      const payload = {
        content: messageText,
        attachmentUrl,
        attachmentType
      };

      if (activeContact?.type === 'group' || activeContact?.type === 'channel') {
        payload.groupId = activeContact.id;
      } else {
        payload.receiverId = activeContact.id;
      }

      const { data } = await api.post('/messages', payload);
      if (data.success) {
        setMessages(prev => [...prev, data.data]);
        const roomId = activeContact?.type === 'group' || activeContact?.type === 'channel'
          ? `group_${activeContact.id}`
          : [user.id, activeContact.id].sort().join('_');
        socket.emit('send_message', { ...data.data, roomId });
        scrollToBottom();
      }
    } catch (err) {
      console.error('Failed to send message:', err);
      setNewMessage(messageText);
      setSelectedFile(fileToUpload);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleStartCall = (type) => {
     setCallType(type);
     setShowCallModal(true);
     setIsCalling(true);
     // Simulate dialing sequence
     setTimeout(() => setIsCalling(false), 8000); 
  };

  const handleOpenScheduleMeet = () => {
    setAgendaDefaults({
      defaultType: 'meeting',
      defaultTitle: activeContact ? `Meeting with ${activeContact.name}` : 'Schedule Meet',
      contextName: activeContact ? activeContact.name : 'Workspace'
    });
    setShowAgendaModal(true);
  };

  const fetchGroupDetails = async (groupId) => {
    if (!groupId) {
      setActiveGroupDetails(null);
      return;
    }

    try {
      const { data } = await api.get(`/messages/groups/${groupId}`);
      if (data.success) {
        setActiveGroupDetails(data.data);
      }
    } catch (err) {
      console.error('Failed to load group details:', err);
      setActiveGroupDetails(null);
    }
  };

  const handleLeaveGroup = async () => {
    if (!activeContact) return;
    const confirmText = activeContact.type === 'channel' ? 'Leave this channel?' : 'Leave this group?';
    const confirmed = window.confirm(confirmText);
    if (!confirmed) return;

    setGroupActionLoading(true);
    try {
      const res = await api.post(`/messages/groups/${activeContact.id}/leave`);
      if (res.data.success) {
        alert(res.data.message);
        await loadContacts();
        setActiveContact(null);
        setActiveGroupDetails(null);
      }
    } catch (err) {
      console.error('Failed to leave group:', err);
      alert('Unable to leave the group/channel.');
    } finally {
      setGroupActionLoading(false);
    }
  };

  const handleRemoveGroupMember = async (memberId) => {
    if (!activeContact || !memberId) return;
    const confirmed = window.confirm('Remove this participant from the group?');
    if (!confirmed) return;

    setGroupActionLoading(true);
    try {
      const res = await api.delete(`/messages/groups/${activeContact.id}/members/${memberId}`);
      if (res.data.success) {
        alert(res.data.message);
        await fetchGroupDetails(activeContact.id);
      }
    } catch (err) {
      console.error('Failed to remove member:', err);
      alert('Unable to remove member from this chat.');
    } finally {
      setGroupActionLoading(false);
    }
  };

  const handleToggleGroupMember = (contact) => {
    setSelectedGroupMembers(prev => {
      if (prev.some(member => member.id === contact.id)) {
        return prev.filter(member => member.id !== contact.id);
      }
      return [...prev, contact];
    });
  };

  const resetGroupForm = () => {
    setNewGroupName('');
    setNewGroupDescription('');
    setSelectedGroupMembers([]);
    setGroupSearch('');
    setGroupType('group');
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (!newGroupName.trim()) {
      alert('Group name is required');
      return;
    }

    if (groupType === 'group' && selectedGroupMembers.length === 0) {
      alert('Please select at least one participant for the group.');
      return;
    }

    try {
      const res = await api.post('/messages/groups', {
        name: newGroupName.trim(),
        description: newGroupDescription.trim(),
        isChannel: groupType === 'channel',
        memberIds: selectedGroupMembers.map(member => member.id)
      });
      if (res.data.success) {
        const createdGroup = res.data.data;
        await loadContacts();
        setShowGroupModal(false);
        resetGroupForm();
        setActiveContact({
          id: createdGroup.id,
          name: createdGroup.name,
          type: createdGroup.isChannel ? 'channel' : 'group',
          isChannel: createdGroup.isChannel,
          adminId: createdGroup.adminId,
          role: createdGroup.isChannel ? 'Channel' : 'Group'
        });
        alert("Group Successfully Created!");
      }
    } catch (err) {
      console.error(err);
      alert('Failed to create group');
    }
  };

  const loadBlockedUsers = async () => {
    try {
      const res = await api.get('/messages/blocked');
      if (res.data.success) {
        setBlockedUsers(res.data.data || []);
      }
    } catch (err) {
      console.error('Failed to load blocked users', err);
    }
  };

  useEffect(() => {
    if (activeContact) {
      setIsBlocked(blockedUsers.some(blocked => blocked.id === activeContact.id));
    }
  }, [activeContact, blockedUsers]);

  const handleBlockUser = async (targetId = null) => {
    const userId = targetId || activeContact?.id;
    if (!userId) return;
    try {
      const res = await api.post(`/messages/block/${userId}`);
      if (res.data.success) {
        setIsBlocked(res.data.isBlocked);
        if (showBlockedModal) await loadBlockedUsers();
        alert(res.data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Error updating block status");
    }
  };

  const handleEditMessage = (message) => {
    setEditMessageId(message.id);
    setEditMessageContent(message.content);
    setMessageMenuOpenId(null);
  };

  const handleCancelEdit = () => {
    setEditMessageId(null);
    setEditMessageContent('');
  };

  const handleUpdateMessage = async (e) => {
    e.preventDefault();
    if (!editMessageId || !editMessageContent.trim()) return;
    try {
      const res = await api.put(`/messages/${editMessageId}`, {
        content: editMessageContent.trim()
      });
      if (res.data.success) {
        setMessages(prev => prev.map(msg => msg.id === editMessageId ? { ...msg, content: editMessageContent.trim() } : msg));
        setEditMessageId(null);
        setEditMessageContent('');
      }
    } catch (err) {
      console.error('Failed to update message', err);
      alert('Unable to edit message');
    }
  };

  const handleDeleteMessage = async (messageId) => {
    if (!messageId) return;
    const confirmed = window.confirm('Delete this message for everyone?');
    if (!confirmed) return;
    try {
      const res = await api.delete(`/messages/${messageId}`);
      if (res.data.success) {
        setMessages(prev => prev.filter(message => message.id !== messageId));
        setMessageMenuOpenId(null);
      }
    } catch (err) {
      console.error('Failed to delete message', err);
      alert('Unable to delete message');
    }
  };

  const groupableContacts = contacts.filter(contact => contact.type === 'user' && contact.id !== user?.id);
  const filteredContacts = contacts.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-[calc(100vh-88px)] md:h-[calc(100vh-88px)] flex flex-col md:-mx-8 lg:-mx-12 -mt-4 md:-mt-8 -mb-4 md:-mb-8 -mx-4 font-sans">
      <div className="bg-[#0B0E14] shadow-sm flex-1 flex h-full relative overflow-hidden">
         {/* Subtle EDOT Background ambient glow */}
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#008A32]/10 blur-[120px] rounded-full pointer-events-none"></div>
         <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#FFD700]/5 blur-[150px] rounded-full pointer-events-none"></div>
         
         {/* Left Sidebar - EDOT Innovative Contact List */}
         <div className={`w-full md:w-[320px] lg:w-[350px] border-r border-white/5 flex-col shrink-0 bg-[#0B0E14]/60 backdrop-blur-2xl z-10 ${activeContact ? 'hidden md:flex' : 'flex'}`}>
           {/* Sidebar Header */}
           <div className="p-4 flex items-center gap-4 border-b border-white/5 shrink-0 bg-transparent">
             <div className="relative">
               <button onClick={() => setShowLeftMenu(prev => !prev)} className="w-10 h-10 bg-[#11151F]/40 border border-white/10 rounded-xl flex items-center justify-center text-slate-300 hover:text-[#FFD700] hover:border-[#FFD700]/50 transition-all shadow-sm">
                  <Menu className="w-5 h-5" />
               </button>
               {/* Elite EDOT Dropdown Menu */}
               {showLeftMenu && (
                 <div className="absolute left-0 top-full mt-2 w-64 bg-[#11151F]/90 backdrop-blur-2xl rounded-2xl shadow-2xl py-2 z-50 border border-white/10">
                   <div className="px-4 py-2 text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-white/5 mb-1">Collaboration</div>
                   <button onClick={() => {
                      resetGroupForm();
                      setGroupType('group');
                      setNewGroupName('New Study Group');
                      setShowGroupModal(true);
                      setShowLeftMenu(false);
                   }} className="w-full text-left px-4 py-2.5 text-slate-200 hover:bg-[#FFD700]/10 hover:text-[#FFD700] flex items-center gap-3 text-[14px] font-medium transition-colors"><Users className="w-4 h-4" /> New Study Group</button>
                   <button onClick={() => {
                      resetGroupForm();
                      setGroupType('channel');
                      setNewGroupName('New Announcement Channel');
                      setShowGroupModal(true);
                      setShowLeftMenu(false);
                   }} className="w-full text-left px-4 py-2.5 text-slate-200 hover:bg-[#008A32]/10 hover:text-[#008A32] flex items-center gap-3 text-[14px] font-medium transition-colors"><Users className="w-4 h-4" /> New Channel</button>
                   <button onClick={() => {
                      resetGroupForm();
                      setGroupType('group');
                      setNewGroupName(activeContact && activeContact.type === 'user' ? `Parent-Teacher Thread — ${activeContact.name}` : 'Parent-Teacher Thread');
                      setSelectedGroupMembers(activeContact && activeContact.type === 'user' ? [activeContact] : []);
                      setShowGroupModal(true);
                      setShowLeftMenu(false);
                   }} className="w-full text-left px-4 py-2.5 text-slate-200 hover:bg-[#008A32]/10 hover:text-[#008A32] flex items-center gap-3 text-[14px] font-medium transition-colors"><Users className="w-4 h-4" /> Parent-Teacher Thread</button>
                   <div className="h-px bg-white/5 my-1"></div>
                   <button onClick={() => { handleOpenScheduleMeet(); setShowLeftMenu(false); }} className="w-full text-left px-4 py-2.5 text-slate-200 hover:bg-white/5 flex items-center gap-3 text-[14px] font-medium transition-colors"><PhoneCall className="w-4 h-4" /> Meetings & Calls</button>
                   <button onClick={() => { setShowPrivacyModal(true); setShowLeftMenu(false); }} className="w-full text-left px-4 py-2.5 text-slate-200 hover:bg-red-500/10 hover:text-red-400 flex items-center gap-3 text-[14px] font-medium transition-colors"><Ban className="w-4 h-4" /> Block Active User</button>
                 </div>
               )}
             </div>
             <div className="relative flex-1">
               <input 
                 type="text" 
                 placeholder="Search network..." 
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="w-full pl-10 pr-4 py-2.5 bg-[#11151F]/40 border border-white/5 text-white placeholder-slate-500 rounded-xl text-[13px] font-medium focus:outline-none focus:ring-1 focus:ring-[#FFD700]/50 focus:border-[#FFD700]/50 transition-all shadow-inner"
               />
               <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[16px] h-[16px] text-slate-400" />
             </div>
           </div>
           
           {/* EDOT User List Container */}
           <div className="flex-1 overflow-y-auto bg-transparent custom-scrollbar px-2 py-2">
             {loadingContacts ? (
               <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-[#FFD700]" /></div>
             ) : filteredContacts.length === 0 ? (
               <div className="text-center p-8 text-slate-500 text-sm font-medium">No users found.</div>
             ) : (
               filteredContacts.map(contact => (
                 <div 
                   key={contact.id} 
                   onClick={() => setActiveContact(contact)}
                   className={`px-3 py-3 mb-1.5 rounded-xl flex items-center gap-4 cursor-pointer transition-all duration-300 border ${activeContact?.id === contact.id ? 'bg-[#11151F] border-[#FFD700]/30 shadow-[0_0_15px_rgba(255,215,0,0.05)] text-white' : 'bg-transparent border-transparent hover:bg-[#11151F]/40 hover:border-white/5'}`}
                 >
                   <div className="relative">
                     <div className={`w-12 h-12 rounded-[14px] flex items-center justify-center font-bold text-lg shrink-0 overflow-hidden shadow-inner ${activeContact?.id === contact.id ? 'bg-gradient-to-br from-[#FFD700]/20 to-[#008A32]/20 text-[#FFD700]' : 'bg-[#11151F] text-slate-300 border border-white/5'}`}>
                       {contact.avatar && contact.avatar !== 'default-avatar.png' ? (
                          <img src={`http://localhost:5000${contact.avatar}`} alt="Avatar" className="w-full h-full object-cover" />
                       ) : (
                          contact.name.charAt(0).toUpperCase()
                       )}
                     </div>
                     {contact.isOnline && <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-[#008A32] border-[2.5px] border-[#0B0E14] rounded-full shadow-[0_0_5px_rgba(0,138,50,0.5)]"></div>}
                   </div>
                   <div className="flex-1 min-w-0">
                     <div className="flex justify-between items-baseline mb-1">
                       <h4 className={`font-semibold text-[14px] truncate tracking-wide ${activeContact?.id === contact.id ? 'text-white' : 'text-slate-200'}`}>{contact.name}</h4>
                       <span className="text-[10px] uppercase font-bold tracking-widest text-[#008A32] ml-2">Active</span>
                     </div>
                     <div className="flex justify-between items-center">
                       <p className={`text-[12px] font-medium truncate ${activeContact?.id === contact.id ? 'text-[#FFD700]/80' : 'text-slate-500'}`}>
                         {contact.role || 'User'}
                       </p>
                       {contact.unreadCount > 0 && (
                         <span className="bg-gradient-to-r from-[#FFD700] to-[#EAB308] text-[#0B0E14] text-[11px] font-black px-2 py-0.5 rounded-full min-w-[20px] text-center shadow-[0_0_10px_rgba(255,215,0,0.3)]">
                           {contact.unreadCount > 99 ? '99+' : contact.unreadCount}
                         </span>
                       )}
                     </div>
                   </div>
                 </div>
               ))
             )}
           </div>
         </div>

         {/* Right Sidebar - Chat Interface EDOT Elite Aesthetic */}
         <div className={`flex-1 flex flex-col bg-transparent relative z-10 ${activeContact ? 'flex' : 'hidden md:flex'}`}>
            <div className="absolute inset-0 max-w-full z-0 pointer-events-none opacity-[0.03]" style={{backgroundImage: 'radial-gradient(circle at center, #FFD700 1px, transparent 1px)', backgroundSize: '32px 32px'}}></div>
            
            {!activeContact ? (
              <div className="flex-1 flex flex-col items-center justify-center text-white relative z-10">
                <div className="w-24 h-24 mb-6 relative">
                  <div className="absolute inset-0 bg-[#FFD700] blur-xl opacity-20 rounded-full animate-pulse"></div>
                  <div className="relative w-full h-full bg-[#11151F] border border-white/10 shadow-xl rounded-full flex items-center justify-center">
                    <span className="text-3xl">✨</span>
                  </div>
                </div>
                <h2 className="text-2xl font-display font-bold text-white mb-2">Workspace Hub</h2>
                <p className="text-slate-400 max-w-md text-center text-sm font-medium">Select a colleague, learner, or guardian to begin collaborating in real-time.</p>
              </div>
            ) : (
              <>
                {/* Elite Hub Header */}
                <div className="h-[72px] border-b border-white/5 flex justify-between items-center px-6 bg-[#0B0E14]/80 backdrop-blur-2xl shrink-0 z-20">
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => setActiveContact(null)}
                      className="md:hidden p-2 text-slate-400 hover:text-white rounded-lg transition-colors flex items-center justify-center"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div className="relative cursor-pointer group">
                      <div className="w-11 h-11 rounded-xl bg-[#11151F] border border-white/10 text-[#FFD700] flex items-center justify-center font-bold text-[16px] shadow-sm shrink-0 overflow-hidden transition-transform group-hover:scale-105">
                        {activeContact.avatar && activeContact.avatar !== 'default-avatar.png' ? (
                          <img src={`http://localhost:5000${activeContact.avatar}`} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                          activeContact.name.charAt(0).toUpperCase()
                        )}
                      </div>
                    </div>
                    <div className="cursor-pointer">
                      <h3 className="font-bold text-[16px] text-white tracking-wide">{activeContact.name}</h3>
                      <div className="flex items-center gap-2 mt-0.5">
                         <span className="w-1.5 h-1.5 rounded-full bg-[#008A32] shadow-[0_0_5px_rgba(0,138,50,0.8)]"></span>
                         <p className="text-[12px] text-slate-400 font-medium">{activeContact.type === 'channel' ? 'Channel' : activeContact.type === 'group' ? 'Group' : 'Online'}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <button onClick={handleOpenScheduleMeet} className="px-3 py-1.5 hidden lg:flex items-center gap-2 bg-[#FFD700]/10 hover:bg-[#FFD700]/20 text-[#FFD700] rounded-lg text-xs font-bold uppercase transition-colors border border-[#FFD700]/20 max-h-9 mr-1">
                      <span>Schedule Meet</span>
                    </button>
                    <button onClick={() => handleStartCall('audio')} className="w-9 h-9 flex items-center justify-center hover:bg-[#11151F] hover:text-[#008A32] rounded-lg transition-colors border border-transparent hover:border-white/10"><Phone className="w-[18px] h-[18px]" /></button>
                    <button onClick={() => handleStartCall('video')} className="w-9 h-9 flex items-center justify-center hover:bg-[#11151F] hover:text-[#008A32] rounded-lg transition-colors border border-transparent hover:border-white/10"><Video className="w-[18px] h-[18px]" /></button>
                    <div className="w-px h-5 bg-white/10 mx-1"></div>
                    {activeContact?.type === 'user' && (
                      <button onClick={handleBlockUser} className={`w-9 h-9 flex items-center justify-center hover:bg-[#11151F] ${isBlocked ? 'text-red-500 hover:text-red-400' : 'text-slate-400 hover:text-red-500'} rounded-lg transition-colors border border-transparent hover:border-white/10 hidden sm:flex`} title="Block User">
                         <Ban className="w-[18px] h-[18px]" />
                      </button>
                    )}
                    <button className="w-9 h-9 flex items-center justify-center hover:bg-[#11151F] hover:text-[#FFD700] rounded-lg transition-colors border border-transparent hover:border-white/10 hidden sm:flex"><Search className="w-[18px] h-[18px]" /></button>
                    <div className="relative hidden sm:flex">
                      <button onClick={() => setShowMoreMenu(prev => !prev)} className="w-9 h-9 flex items-center justify-center hover:bg-[#11151F] text-slate-400 rounded-lg transition-colors border border-transparent hover:border-white/10">
                        <MoreVertical className="w-[18px] h-[18px]" />
                      </button>
                      {showMoreMenu && (
                        <div className="absolute right-0 mt-2 w-56 bg-[#11151F]/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/10 overflow-hidden z-[100]">
                          <button onClick={() => { handleOpenScheduleMeet(); setShowMoreMenu(false); }} className="w-full text-left px-4 py-3 text-slate-200 hover:bg-white/5 transition-colors flex items-center gap-2">Schedule Meet</button>
                          <button onClick={() => { handleStartCall('audio'); setShowMoreMenu(false); }} className="w-full text-left px-4 py-3 text-slate-200 hover:bg-white/5 transition-colors flex items-center gap-2">Start Audio</button>
                          <button onClick={() => { handleStartCall('video'); setShowMoreMenu(false); }} className="w-full text-left px-4 py-3 text-slate-200 hover:bg-white/5 transition-colors flex items-center gap-2">Start Video</button>
                          {activeContact?.type !== 'user' && activeContact?.type !== undefined && (
                            <>
                              <button onClick={() => { setShowMembersModal(true); setShowMoreMenu(false); }} className="w-full text-left px-4 py-3 text-slate-200 hover:bg-white/5 transition-colors flex items-center gap-2">Manage Members</button>
                              <button onClick={() => { handleLeaveGroup(); setShowMoreMenu(false); }} className="w-full text-left px-4 py-3 text-slate-200 hover:bg-white/5 transition-colors flex items-center gap-2">{activeContact?.adminId === user?.id ? 'Leave or Transfer' : 'Leave Chat'}</button>
                            </>
                          )}
                          <button onClick={() => { setShowBlockedModal(true); loadBlockedUsers(); setShowMoreMenu(false); }} className="w-full text-left px-4 py-3 text-slate-200 hover:bg-white/5 transition-colors flex items-center gap-2">Blocked Users</button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* EDOT Elite Chat Bubbles */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-transparent relative z-10 space-y-5">
                  {loadingMessages ? (
                    <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-[#FFD700]" /></div>
                  ) : messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full mt-10">
                       <div className="bg-[#11151F]/40 backdrop-blur-md border border-white/5 rounded-2xl p-6 max-w-sm text-center shadow-lg">
                          <span className="text-3xl mb-3 block">💬</span>
                          <h4 className="text-white font-bold mb-1">Start Collaborating</h4>
                          <p className="text-slate-400 text-sm">Send a message, an assignment file, or schedule a meet directly here.</p>
                       </div>
                    </div>
                  ) : (
                    messages.map((msg, idx) => {
                      const isMine = msg.senderId === user?.id || msg.receiverId === user?.id;
                      const timeString = new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                      return (
                        <div key={msg.id || idx} className={`flex w-full items-end gap-3 ${isMine ? 'justify-end' : 'justify-start'}`}>
                          
                          {/* Received Avatar */}
                          {!isMine && (
                            <div className="w-8 h-8 rounded-lg bg-[#11151F] border border-white/10 flex items-center justify-center font-bold text-[12px] text-slate-300 shadow-sm shrink-0 overflow-hidden mt-auto mb-1 hidden md:flex">
                              {activeContact.avatar && activeContact.avatar !== 'default-avatar.png' ? (
                                <img src={`http://localhost:5000${activeContact.avatar}`} alt="Avatar" className="w-full h-full object-cover" />
                              ) : (
                                activeContact.name.charAt(0).toUpperCase()
                              )}
                            </div>
                          )}

                          <div className={`flex flex-col max-w-[85%] md:max-w-[65%] ${isMine ? 'items-end' : 'items-start'}`}>
                            {/* Message Bubble Glassmorphic */}
                            <div className={`p-4 shadow-lg text-[15px] leading-relaxed relative border backdrop-blur-xl ${isMine ? 'bg-gradient-to-br from-[#008A32]/80 to-[#006622]/90 border-[#008A32] text-white rounded-2xl rounded-br-sm' : 'bg-[#11151F]/80 border-white/10 text-slate-200 rounded-2xl rounded-bl-sm'} `} style={{ wordBreak: 'break-word' }}>
                              <button onClick={() => setMessageMenuOpenId(prev => prev === msg.id ? null : msg.id)} className="absolute top-3 right-3 w-8 h-8 text-slate-300 hover:text-white rounded-full bg-black/20 flex items-center justify-center transition-colors">
                                <MoreVertical className="w-4 h-4" />
                              </button>
                              {messageMenuOpenId === msg.id && (
                                <div className="absolute top-12 right-3 w-36 bg-[#0B0E14]/95 border border-white/10 rounded-2xl shadow-xl z-40 overflow-hidden">
                                  <button onClick={() => handleEditMessage(msg)} className="w-full text-left px-3 py-2 text-slate-200 hover:bg-white/5 transition-colors flex items-center gap-2 text-[13px]"> <Edit className="w-4 h-4" /> Edit</button>
                                  <button onClick={() => handleDeleteMessage(msg.id)} className="w-full text-left px-3 py-2 text-slate-200 hover:bg-white/5 transition-colors flex items-center gap-2 text-[13px]"> <Trash2 className="w-4 h-4" /> Delete</button>
                                </div>
                              )}
                              
                              {/* Attachment Rendering */}
                              {msg.attachmentUrl && msg.attachmentType === 'image' && (
                                <div className="mb-3 max-w-[280px] md:max-w-[340px] rounded-xl overflow-hidden border border-white/10 shadow-inner">
                                   <img src={`http://localhost:5000${msg.attachmentUrl}`} alt="Attachment" className="w-full h-auto object-cover cursor-pointer hover:opacity-90 transition-opacity" />
                                </div>
                              )}
                              {msg.attachmentUrl && msg.attachmentType === 'file' && (
                                <a href={`http://localhost:5000${msg.attachmentUrl}`} target="_blank" rel="noreferrer" className={`flex items-center gap-3 mb-3 p-3 rounded-xl border transition-all ${isMine ? 'bg-black/20 border-black/10 hover:bg-black/30' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}>
                                   <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 shadow-sm ${isMine ? 'bg-[#FFD700]/20 text-[#FFD700]' : 'bg-[#FFD700]/10 text-[#FFD700]'}`}>
                                      <Paperclip className="w-5 h-5" />
                                   </div>
                                   <div className="flex-1 min-w-0 pr-2">
                                      <p className="text-[14px] font-bold truncate text-white">Attachment</p>
                                      <p className="text-[12px] opacity-80 uppercase tracking-widest font-semibold text-white/50">Click to View</p>
                                   </div>
                                </a>
                              )}

                              {editMessageId === msg.id ? (
                                <form onSubmit={handleUpdateMessage} className="space-y-3">
                                  <textarea
                                    value={editMessageContent}
                                    onChange={(e) => setEditMessageContent(e.target.value)}
                                    className="w-full min-h-[120px] resize-none rounded-2xl bg-[#0B0E14] border border-white/10 p-3 text-sm text-white focus:outline-none focus:border-[#FFD700]/50"
                                  />
                                  <div className="flex justify-end gap-2">
                                    <button type="button" onClick={handleCancelEdit} className="px-3 py-2 text-sm font-semibold text-slate-300 hover:text-white">Cancel</button>
                                    <button type="submit" className="px-3 py-2 rounded-xl bg-[#008A32] hover:bg-[#00983e] text-white text-sm font-semibold">Save</button>
                                  </div>
                                </form>
                              ) : (
                                <>
                                  <span className="whitespace-pre-wrap block font-medium">{msg.content}</span>
                                  <div className={`text-[10px] uppercase tracking-widest font-bold mt-2 flex items-center justify-end gap-1.5 ${isMine ? 'text-[#FFD700]' : 'text-slate-400'}`}>
                                    <span>{timeString}</span>
                                    {isMine && (
                                      <span className={`text-[12px] ${msg.isRead ? 'text-white' : 'opacity-70'}`}>
                                        {msg.isRead ? '✓✓' : '✓'}
                                      </span>
                                    )}
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Elite Floating Chat Input Area */}
                <form onSubmit={handleSendMessage} className="p-4 bg-transparent shrink-0 z-20 flex flex-col items-center">
                  
                  {/* Selected File Preview Box */}
                  {selectedFile && (
                     <div className="w-full max-w-4xl bg-[#11151F]/90 backdrop-blur-xl border border-white/10 rounded-t-2xl p-4 flex items-center justify-between mb-0 shadow-xl relative z-0 transform translate-y-2">
                        <div className="flex items-center gap-4 min-w-0">
                           <div className="w-12 h-12 bg-[#0B0E14] rounded-xl border border-[#FFD700]/20 flex items-center justify-center shrink-0 overflow-hidden shadow-inner font-bold text-[#FFD700]">
                              {selectedFile.type.startsWith('image/') ? (
                                  <img src={URL.createObjectURL(selectedFile)} alt="preview" className="w-full h-full object-cover" />
                              ) : (
                                  <Paperclip className="w-5 h-5" />
                              )}
                           </div>
                           <div className="min-w-0">
                             <p className="text-white text-[14px] font-bold tracking-wide truncate">{selectedFile.name}</p>
                             <p className="text-[#FFD700] text-[11px] uppercase tracking-widest font-black mt-0.5">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                           </div>
                        </div>
                        <button type="button" onClick={() => setSelectedFile(null)} className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white bg-white/5 hover:bg-[#E30A17]/20 hover:border-[#E30A17]/50 border border-transparent rounded-full transition-all shrink-0 shadow-sm">
                           ✕
                        </button>
                     </div>
                  )}

                  <div className={`flex items-end gap-2 bg-[#11151F]/80 backdrop-blur-2xl border ${selectedFile ? 'border-white/10 rounded-b-2xl rounded-t-none' : 'border-white/5 rounded-3xl'} p-2 w-full max-w-4xl shadow-2xl relative z-10 focus-within:border-[#FFD700]/30 focus-within:shadow-[0_0_20px_rgba(255,215,0,0.05)] transition-all duration-300`}>
                      <button type="button" className="p-3 text-slate-400 hover:text-[#FFD700] rounded-xl hover:bg-white/5 transition-colors shrink-0 outline-none"><Smile className="w-6 h-6" /></button>
                      <textarea 
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(e); } }}
                        placeholder={isChannelReadOnly ? "Only channel admins may post here." : selectedFile ? "Add a descriptive caption..." : "Draft your message or paste code/links here..."} 
                        rows={1}
                        disabled={isChannelReadOnly}
                        className="flex-1 bg-transparent border-none focus:outline-none text-[15px] font-medium text-white py-3.5 px-2 placeholder-slate-500 min-w-0 resize-none max-h-36 overflow-auto custom-scrollbar leading-[1.4] disabled:cursor-not-allowed disabled:text-slate-500"
                      />
                      <div className="flex items-center self-end mb-1 mr-1">
                        <button type="button" disabled={isChannelReadOnly} onClick={() => fileInputRef.current?.click()} className="p-3 text-slate-400 hover:text-[#008A32] rounded-xl hover:bg-[#008A32]/10 transition-colors shrink-0 outline-none disabled:cursor-not-allowed disabled:opacity-40">
                           <Paperclip className="w-6 h-6" />
                        </button>
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                        {isChannelReadOnly ? (
                          <button type="button" disabled className="w-[46px] h-[46px] text-slate-500 bg-white/5 rounded-xl transition-all flex items-center justify-center shrink-0 outline-none ml-2 border border-white/10">
                            <span className="text-[11px] uppercase tracking-[0.08em] font-semibold">Read-only</span>
                          </button>
                        ) : (newMessage.trim() || selectedFile) ? (
                          <button type="submit" className="w-[46px] h-[46px] bg-gradient-to-br from-[#008A32] to-[#006622] text-white rounded-xl shadow-[0_0_15px_rgba(0,138,50,0.4)] transition-all hover:scale-105 active:scale-95 flex items-center justify-center shrink-0 border border-[#008A32] outline-none ml-2">
                            <Send className="w-[20px] h-[20px] ml-1" />
                          </button>
                        ) : (
                          <button type="button" className="w-[46px] h-[46px] text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-all flex items-center justify-center shrink-0 outline-none ml-2 border border-white/5 hover:border-white/10">
                            <Mic className="w-[22px] h-[22px]" />
                          </button>
                        )}
                      </div>
                  </div>
                </form>
              </>
            )}
         </div>
      </div>

      {/* Dynamic Render Modals */}
      {showAgendaModal && (
        <AgendaCreationModal 
           isOpen={showAgendaModal}
           defaultType={agendaDefaults.defaultType}
           defaultTitle={agendaDefaults.defaultTitle}
           contextName={agendaDefaults.contextName}
           onClose={() => setShowAgendaModal(false)}
           onAgendaCreated={(evt) => {
              setShowAgendaModal(false);
              if (!activeContact) return;
              const payload = {
                 content: `📅 I have scheduled a meet: "${evt.title}". Please check your calendar.`
              };
              if (activeContact?.type === 'group' || activeContact?.type === 'channel') {
                 payload.groupId = activeContact.id;
              } else {
                 payload.receiverId = activeContact.id;
              }
              api.post('/messages', payload).then(res => {
                 if (res.data.success) {
                    setMessages(prev => [...prev, res.data.data]);
                    const roomId = activeContact?.type === 'group' || activeContact?.type === 'channel'
                      ? `group_${activeContact.id}`
                      : [user.id, activeContact.id].sort().join('_');
                    socket.emit('send_message', { ...res.data.data, roomId });
                    scrollToBottom();
                 }
              });
           }}
        />
      )}

      {showCallModal && (
         <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
            <div className="bg-[#11151F] border border-white/10 w-full max-w-sm rounded-[32px] overflow-hidden shadow-2xl relative">
               <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#008A32]/20 to-transparent pointer-events-none"></div>
               <div className="p-8 flex flex-col items-center relative z-10">
                  <div className="w-24 h-24 rounded-2xl bg-[#0B0E14] border border-[#FFD700]/30 text-[#FFD700] flex items-center justify-center text-4xl font-bold shadow-[0_0_30px_rgba(255,215,0,0.15)] mb-6 overflow-hidden relative">
                     {activeContact?.avatar && activeContact.avatar !== 'default-avatar.png' ? (
                        <img src={`http://localhost:5000${activeContact.avatar}`} alt="Avatar" className="w-full h-full object-cover" />
                     ) : (
                        activeContact?.name.charAt(0).toUpperCase()
                     )}
                     {isCalling && (
                        <div className="absolute inset-0 border-4 border-[#008A32] rounded-2xl animate-ping opacity-50"></div>
                     )}
                  </div>
                  <h3 className="text-2xl font-bold text-white tracking-wide mb-1 text-center">{activeContact?.name}</h3>
                  <p className="text-[#FFD700] text-sm uppercase tracking-widest font-semibold mb-10">
                     {isCalling ? `Dialing ${callType}...` : 'No Answer'}
                  </p>
                  
                  <div className="flex items-center gap-6">
                     <button className="w-14 h-14 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center text-slate-300 transition-colors">
                        {callType === 'video' ? <Video className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                     </button>
                     <button onClick={() => setShowCallModal(false)} className="w-16 h-16 bg-[#E30A17] hover:bg-[#E30A17]/80 rounded-full flex items-center justify-center text-white shadow-[0_0_20px_rgba(227,10,23,0.4)] transition-all hover:scale-105 active:scale-95">
                        <Phone className="w-7 h-7 rotate-[135deg]" />
                     </button>
                  </div>
               </div>
            </div>
         </div>
      )}

      {/* Group Creation Inline Modal */}
      {showGroupModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-2xl z-[100] flex items-center justify-center p-4">
          <div className="w-full max-w-6xl rounded-[32px] border border-[#FFD700]/20 bg-[#09121A]/95 shadow-[0_30px_90px_rgba(0,0,0,0.55)] overflow-hidden text-white">
            <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4 px-8 py-6 border-b border-white/10 bg-[#08111A]/90">
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-[28px] bg-gradient-to-br from-[#FFD700] to-[#008A32] p-[2px] shadow-lg shadow-[#008A32]/25">
                    <div className="w-full h-full rounded-[26px] bg-[#11151F] flex items-center justify-center text-2xl font-black text-white"><Users className="w-7 h-7" /></div>
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold tracking-tight">{groupType === 'channel' ? 'Create Channel' : 'Create Group'}</h2>
                    <p className="text-slate-400 text-sm mt-1 max-w-2xl">Build a new chat space. Start with a name, add a description, and select who can join.</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.22em] text-slate-400">
                  <span className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2">{groupType === 'channel' ? 'Channel' : 'Group'}</span>
                  <span className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2">Owner: You</span>
                  <span className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2">{selectedGroupMembers.length} members</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => setGroupType('group')} className={`rounded-full px-5 py-3 text-sm font-semibold transition ${groupType === 'group' ? 'bg-[#FFD700]/15 border border-[#FFD700] text-[#FFD700]' : 'bg-[#111922] border border-white/10 text-slate-300 hover:border-[#FFD700]/40'}`}>
                  Group
                </button>
                <button type="button" onClick={() => setGroupType('channel')} className={`rounded-full px-5 py-3 text-sm font-semibold transition ${groupType === 'channel' ? 'bg-[#008A32]/15 border border-[#008A32] text-[#8CFFB3]' : 'bg-[#111922] border border-white/10 text-slate-300 hover:border-[#008A32]/40'}`}>
                  Channel
                </button>
                <button onClick={() => { resetGroupForm(); setShowGroupModal(false); }} className="text-slate-300 hover:text-white text-sm font-semibold">Close</button>
              </div>
            </div>

            <form onSubmit={handleCreateGroup} className="grid gap-6 xl:grid-cols-[1.2fr_0.85fr] px-8 py-8">
              <div className="space-y-6">
                <div className="rounded-[28px] border border-white/10 bg-[#0B121C]/80 p-6 shadow-sm">
                  <div className="text-sm uppercase tracking-[0.18em] text-slate-400 mb-5">Chat Settings</div>
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-semibold text-slate-200 mb-2">Name</label>
                      <input
                        type="text"
                        required
                        value={newGroupName}
                        onChange={(e) => setNewGroupName(e.target.value)}
                        className="w-full rounded-3xl border border-white/10 bg-[#111922] px-4 py-3 text-white outline-none transition focus:border-[#FFD700]/40 focus:ring-1 focus:ring-[#FFD700]/10"
                        placeholder="e.g. Computer Science Cohort A"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-200 mb-2">Description</label>
                      <textarea
                        value={newGroupDescription}
                        onChange={(e) => setNewGroupDescription(e.target.value)}
                        className="w-full min-h-[120px] rounded-3xl border border-white/10 bg-[#111922] px-4 py-3 text-white outline-none transition focus:border-[#FFD700]/40 focus:ring-1 focus:ring-[#FFD700]/10 resize-none"
                        placeholder="Optional group description"
                      />
                    </div>
                    <div className={
                      `rounded-3xl px-4 py-3 text-sm ${groupType === 'channel' ? 'border border-[#008A32] bg-[#008A32]/10 text-[#C8FFDE]' : 'border border-[#FFD700] bg-[#FFD700]/10 text-[#FFF5C3]'}`
                    }>
                      {groupType === 'channel'
                        ? 'Channel members are read-only by default. Only the owner can post announcements and updates.'
                        : 'Group members can all participate in the chat once added.'}
                    </div>
                  </div>
                </div>

                <div className="rounded-[28px] border border-white/10 bg-[#0B121C]/80 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-sm uppercase tracking-[0.18em] text-slate-400">Add Participants</div>
                      <div className="text-xs text-slate-500">Search your contacts and add them to this chat.</div>
                    </div>
                    <div className="text-xs text-slate-400">{selectedGroupMembers.length} selected</div>
                  </div>
                  <input
                    type="text"
                    value={groupSearch}
                    onChange={(e) => setGroupSearch(e.target.value)}
                    placeholder="Search contacts to add"
                    className="w-full rounded-3xl border border-white/10 bg-[#111922] px-4 py-3 text-white outline-none transition focus:border-[#FFD700]/40 focus:ring-1 focus:ring-[#FFD700]/10"
                  />
                  <div className="max-h-[300px] overflow-y-auto mt-5 space-y-3 pr-1 custom-scrollbar">
                    {groupableContacts.filter(contact => contact.name.toLowerCase().includes(groupSearch.toLowerCase())).map(contact => (
                      <button
                        type="button"
                        key={contact.id}
                        onClick={() => handleToggleGroupMember(contact)}
                        className={`w-full text-left rounded-[24px] border px-4 py-3 flex items-center justify-between transition ${selectedGroupMembers.some(member => member.id === contact.id) ? 'border-[#FFD700] bg-[#FFD700]/10 text-[#FFD700]' : 'border-white/10 bg-[#111922] text-slate-200 hover:border-[#FFD700]/30'}`}
                      >
                        <div>
                          <div className="font-semibold">{contact.name}</div>
                          <div className="text-[11px] text-slate-500 uppercase tracking-[0.16em]">{contact.role || 'User'}</div>
                        </div>
                        <span className="text-[11px] uppercase tracking-[0.12em] font-semibold">{selectedGroupMembers.some(member => member.id === contact.id) ? 'Added' : 'Add'}</span>
                      </button>
                    ))}
                    {groupableContacts.filter(contact => contact.name.toLowerCase().includes(groupSearch.toLowerCase())).length === 0 && (
                      <div className="rounded-[24px] border border-white/10 bg-[#111922] p-4 text-slate-500 text-sm">No contacts found.</div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-[28px] border border-white/10 bg-[#0B121C]/80 p-6 shadow-sm">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-3xl bg-[#111922] border border-white/10 flex items-center justify-center text-2xl font-bold text-white">{user?.name?.charAt(0).toUpperCase()}</div>
                    <div>
                      <div className="text-sm uppercase tracking-[0.18em] text-slate-400">Creator</div>
                      <div className="text-lg font-semibold text-white mt-1">{user?.name || 'You'}</div>
                      <div className="text-xs text-slate-500 mt-1">Current owner and administrator of this chat.</div>
                    </div>
                  </div>
                  <div className="grid gap-4 text-sm text-slate-300">
                    <div className="rounded-[24px] border border-white/10 bg-[#111922] p-4">
                      <div className="text-[11px] uppercase tracking-[0.18em] text-slate-400 mb-2">Group Type</div>
                      <div>{groupType === 'channel' ? 'Channel — owner-only posts' : 'Group — everyone can chat'}</div>
                    </div>
                    <div className="rounded-[24px] border border-white/10 bg-[#111922] p-4">
                      <div className="text-[11px] uppercase tracking-[0.18em] text-slate-400 mb-2">Visibility</div>
                      <div>Members are added by you. Invitations are managed by the owner.</div>
                    </div>
                  </div>
                </div>

                <div className="rounded-[28px] border border-white/10 bg-[#0B121C]/80 p-6 shadow-sm">
                  <div className="text-sm uppercase tracking-[0.18em] text-slate-400 mb-4">Summary</div>
                  <div className="grid gap-4">
                    <div className="rounded-[24px] border border-white/10 bg-[#111922] p-4">
                      <div className="text-[11px] uppercase tracking-[0.18em] text-slate-400 mb-2">Name</div>
                      <div className="text-white font-semibold truncate">{newGroupName || 'Untitled group'}</div>
                    </div>
                    <div className="rounded-[24px] border border-white/10 bg-[#111922] p-4">
                      <div className="text-[11px] uppercase tracking-[0.18em] text-slate-400 mb-2">Participants</div>
                      <div className="flex flex-wrap gap-2">
                        {selectedGroupMembers.length > 0 ? selectedGroupMembers.map(member => (
                          <span key={member.id} className="rounded-2xl bg-white/5 px-3 py-2 text-slate-200 text-xs">{member.name}</span>
                        )) : <span className="text-slate-500 text-sm">No participants selected yet.</span>}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <button type="button" onClick={() => { resetGroupForm(); setShowGroupModal(false); }} className="rounded-3xl border border-white/10 bg-[#111922] px-6 py-3 text-sm font-semibold text-slate-300 hover:text-white transition">Cancel</button>
                  <button type="submit" className="rounded-3xl bg-gradient-to-r from-[#008A32] to-[#006622] px-6 py-3 text-sm font-semibold text-white shadow-xl shadow-[#008A32]/25">Create {groupType === 'channel' ? 'Channel' : 'Group'}</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Privacy / Block User Inline Modal */}
      {showPrivacyModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
           <div className="bg-[#11151F] border border-red-500/20 w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden font-sans text-center p-8 relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 to-red-400"></div>
              <div className="w-20 h-20 bg-red-500/10 rounded-full mx-auto flex items-center justify-center mb-6">
                 <Ban className="w-10 h-10 text-red-500" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Block {activeContact?.name}?</h2>
              <p className="text-slate-400 text-sm mb-8">They will no longer be able to send you messages, files, or calendar invites. This action is easily reversible.</p>
              
              <div className="flex flex-col gap-3">
                 <button onClick={() => { handleBlockUser(); setShowPrivacyModal(false); }} className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl shadow-lg shadow-red-600/20 transition-all">Yes, Block User</button>
                 <button onClick={() => setShowPrivacyModal(false)} className="w-full py-3 bg-white/5 hover:bg-white/10 text-slate-300 font-bold rounded-xl transition-all">Cancel</button>
              </div>
           </div>
        </div>
      )}

      {showBlockedModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-[#11151F] border border-white/10 rounded-[32px] overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 bg-[#0B0E14]/80">
              <div>
                <h2 className="text-xl font-bold text-white">Blocked Users</h2>
                <p className="text-slate-400 text-sm">Manage people you have blocked from sending messages.</p>
              </div>
              <button onClick={() => setShowBlockedModal(false)} className="text-slate-400 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              {blockedUsers.length === 0 ? (
                <div className="text-center py-14 text-slate-400">
                  No blocked users yet. Use the block action on a chat to add someone.
                </div>
              ) : (
                blockedUsers.map(user => (
                  <div key={user.id} className="flex items-center justify-between gap-3 p-4 rounded-3xl bg-[#0B0E14]/70 border border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-[#11151F] border border-white/10 flex items-center justify-center text-slate-200 font-bold text-lg">
                        {user.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div>
                        <p className="font-semibold text-white">{user.name}</p>
                        <p className="text-sm text-slate-400">{user.role || 'User'}</p>
                      </div>
                    </div>
                    <button onClick={() => handleBlockUser(user.id)} className="px-4 py-2 rounded-2xl border border-white/10 text-sm font-semibold text-slate-100 bg-white/5 hover:bg-red-600/15 transition-colors">Unblock</button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
