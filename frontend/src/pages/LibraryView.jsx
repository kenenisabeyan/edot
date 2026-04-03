import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { BookOpen, Search, Download, Plus, Trash2, FileText, Loader2, AlertCircle, Globe, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Markdown from 'markdown-to-jsx';
import 'github-markdown-css';

export default function LibraryView() {
  const { user } = useAuth();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Upload Form State
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploadData, setUploadData] = useState({ title: '', author: '', category: 'General', file: null, container: 'download', download_permission: false, courseId: '' });
  const [submitting, setSubmitting] = useState(false);
  const [uploadError, setUploadError] = useState('');

  // Three-container architecture
  const [activeContainer, setActiveContainer] = useState('download'); // download, secure, wiki
  const [secureResource, setSecureResource] = useState(null);
  const [wikiMarkdown, setWikiMarkdown] = useState('');
  const [wikiPreview, setWikiPreview] = useState('');
  const [selectedWikiResource, setSelectedWikiResource] = useState(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewTarget, setReviewTarget] = useState(null);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewDecision, setReviewDecision] = useState('approved');
  const [globalTasks, setGlobalTasks] = useState([]);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/library');
      setResources(data.data || []);
    } catch (err) {
      console.error('Failed to fetch library resources', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setUploadData({ ...uploadData, file: e.target.files[0] });
    }
  };

  const handleWikiChange = (e) => {
    setWikiMarkdown(e.target.value);
    setWikiPreview(e.target.value);
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!uploadData.title || !uploadData.author || !uploadData.file) return;

    setSubmitting(true);
    setUploadError('');

    try {
      // 1. Upload File
      const fileData = new FormData();
      fileData.append('image', uploadData.file); // The server endpoint typically expects "image" or "document" depending on the general upload middleware
      
      const uploadRes = await api.post('/upload', fileData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      if (!uploadRes.data.success) throw new Error('File upload failed on server');
      
      const fileUrl = uploadRes.data.filePath;

      // 2. Save Resource
      await api.post('/library', {
        title: uploadData.title,
        author: uploadData.author,
        category: uploadData.category,
        container: uploadData.container || 'download',
        courseId: uploadData.courseId || 'general',
        fileUrl: fileUrl,
        status: user?.role === 'admin' ? 'approved' : 'pending',
        isLive: user?.role === 'admin',
        download_permission: uploadData.download_permission,
        wikiMarkdown: uploadData.container === 'wiki' ? wikiMarkdown : ''
      });

      // 3. Reset and Refresh
      setUploadData({ title: '', author: '', category: 'General', file: null });
      setShowUploadForm(false);
      fetchResources();

    } catch (err) {
      setUploadError(err.response?.data?.message || err.message || 'Error uploading file');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to permanently delete this resource?')) {
      try {
        await api.delete(`/library/${id}`);
        fetchResources();
      } catch (err) {
        console.error('Failed to delete resource', err);
        alert(err.response?.data?.message || 'Error deleting file.');
      }
    }
  };

  const canUpload = user?.role === 'admin' || user?.role === 'instructor';

  const pendingQueue = resources.filter((r) => r.status === 'pending');
  const studentEnrolledCourses = user?.enrolledCourses || [];

  const visibleResources = resources.filter((r) => {
    if (user?.role === 'student') {
      return r.status === 'approved' && studentEnrolledCourses.includes(r.courseId);
    }
    if (user?.role === 'parent') {
      return true;
    }
    if (user?.role === 'instructor') {
      return r.uploadedBy === user?._id || r.status === 'approved';
    }
    return true;
  });

  const filteredResources = visibleResources.filter(r => 
    r.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    r.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const setRoleGlobalTasks = () => {
    const tasks = [];
    if (user?.role === 'admin') {
      tasks.push({id:1, title:'Review pending uploads', status:'urgent'});
      tasks.push({id:2, title:'Confirm new course creation approvals', status:'open'});
    }
    if (user?.role === 'instructor') {
      tasks.push({id:3, title:'Submit content for review', status:'due soon'});
      tasks.push({id:4, title:'Grade pending student quizzes', status:'open'});
    }
    if (user?.role === 'student') {
      tasks.push({id:5, title:'Complete next module assignment', status:'upcoming'});
      tasks.push({id:6, title:'Prepare for next quiz', status:'upcoming'});
    }
    if (user?.role === 'parent') {
      tasks.push({id:7, title:'Review child progress report', status:'open'});
      tasks.push({id:8, title:'Check schedule for next week', status:'open'});
    }
    setGlobalTasks(tasks);
  };

  useEffect(() => {
    setRoleGlobalTasks();
  }, [user]);

  const handleSubmitForReview = async (resource) => {
    const patchedResources = resources.map((r) => 
      r._id === resource._id ? { ...r, status: 'pending', adminComments: '' } : r
    );
    setResources(patchedResources);
    if (user?.role === 'instructor') {
      // Inform user of pending status (no backend in this mock)
      window.alert('Resource submitted to admin for review.');
    }
    setActiveContainer('download');
  };

  const openReviewModal = (resource) => {
    setReviewTarget(resource);
    setReviewComment(resource.adminComments || '');
    setReviewModalOpen(true);
    setReviewDecision('approved');
  };

  const handleReviewSubmit = () => {
    if (!reviewTarget) return;
    const updatedResources = resources.map((r) => {
      if (r._id === reviewTarget._id) {
        return {
          ...r,
          status: reviewDecision === 'approved' ? 'approved' : 'rejected',
          adminComments: reviewComment,
        };
      }
      return r;
    });
    setResources(updatedResources);
    setReviewModalOpen(false);
  };

  const selectSecureResource = (resource) => {
    setSecureResource(resource);
  };


  if (loading && resources.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in flex flex-col space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">Digital Library</h1>
          <p className="text-slate-300 text-sm mt-1">Explore books, research papers, and documents.</p>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-5 h-5 absolute left-3 top-3 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search resources..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-white/10 bg-[#0B0E14] text-white rounded-xl outline-none focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700] transition-all font-medium"
            />
          </div>
          {canUpload && !showUploadForm && (
            <button 
              onClick={() => setShowUploadForm(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-[#008A32] to-[#006622] hover:shadow-lg hover:shadow-[#008A32]/20 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-sm shrink-0"
            >
              <Plus className="w-5 h-5" /> Upload File
            </button>
          )}
        </div>
      </div>

      {/* Three-Container Navigation */}
      <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl p-2">
        {['download', 'secure', 'wiki'].map((key) => (
          <button
            key={key}
            onClick={() => setActiveContainer(key)}
            className={`px-3 py-1.5 rounded-lg text-sm font-semibold ${activeContainer === key ? 'bg-cyan-500 text-white' : 'text-slate-300 hover:bg-white/10'}`}
          >
            {key === 'download' ? 'Download Vault' : key === 'secure' ? 'Secure Viewer' : 'EDOT Wiki'}
          </button>
        ))}
      </div>

      {/* Upload Form Engine */}
      {showUploadForm && (
        <div className="rounded-3xl border border-white/5 bg-white/5 backdrop-blur-xl p-6 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-center mb-6">
             <h2 className="text-xl font-bold text-white flex items-center gap-2">
                 <FileText className="w-5 h-5 text-[#E30A17]" /> Upload New Resource
             </h2>
             <button onClick={() => setShowUploadForm(false)} className="text-slate-400 hover:text-white font-medium text-sm">Cancel</button>
          </div>
          
          {uploadError && (
             <div className="mb-4 bg-rose-50 text-rose-600 p-3 rounded-xl flex items-center gap-2 text-sm font-semibold border border-rose-200">
                <AlertCircle className="w-5 h-5" /> {uploadError}
             </div>
          )}

          <form onSubmit={handleUploadSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-1 md:col-span-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Document Title</label>
                    <input 
                      type="text" required placeholder="Advanced Mathematics Vol 2"
                      value={uploadData.title} onChange={(e) => setUploadData({ ...uploadData, title: e.target.value })}
                      className="w-full bg-[#0B0E14] border border-white/10 text-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#FFD700] font-semibold placeholder-slate-500"
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Author / Publisher</label>
                    <input 
                      type="text" required placeholder="John Doe"
                      value={uploadData.author} onChange={(e) => setUploadData({ ...uploadData, author: e.target.value })}
                      className="w-full bg-[#0B0E14] border border-white/10 text-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#FFD700] font-semibold placeholder-slate-500"
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Category</label>
                    <select 
                      value={uploadData.category} onChange={(e) => setUploadData({ ...uploadData, category: e.target.value })}
                      className="w-full bg-[#0B0E14] border border-white/10 text-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#FFD700] font-semibold cursor-pointer"
                    >
                      <option value="General">General Education</option>
                      <option value="Science">Science & Technology</option>
                      <option value="Mathematics">Mathematics</option>
                      <option value="Literature">Literature & Languages</option>
                      <option value="History">History & Social Science</option>
                      <option value="Research">Research Papers</option>
                      <option value="Syllabus">Curriculum / Syllabus</option>
                    </select>
                </div>
            </div>

            <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">File Attachment</label>
                <div className="relative border-2 border-dashed border-white/10 rounded-2xl p-6 bg-[#0B0E14]/50 hover:bg-white/5 transition-colors group cursor-pointer">
                    <input 
                      type="file" 
                      required
                      accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                    />
                    <div className="flex flex-col items-center justify-center text-center space-y-2">
                       <div className="w-12 h-12 rounded-full bg-white/5 text-[#E30A17] flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Download className="w-6 h-6" />
                       </div>
                       <div>
                         {uploadData.file ? (
                            <p className="font-bold text-[#FFD700]">{uploadData.file.name}</p>
                         ) : (
                            <p className="font-semibold text-slate-300">Drag & Drop your file here, or click to browse</p>
                         )}
                         <p className="text-xs text-slate-400 mt-1">Supports PDF, DOCX, PPTX (Max 10MB)</p>
                       </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-2">
                <button 
                  type="submit" 
                  disabled={submitting}
                  className="bg-gradient-to-r from-[#008A32] to-[#006622] hover:shadow-[#008A32]/20 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all w-full sm:w-auto disabled:opacity-70"
                >
                  {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Plus className="w-5 h-5" /> Save to Library</>}
                </button>
            </div>
          </form>
        </div>
      )}

      {/* Container Display */}
      {activeContainer === 'download' && (
        <>
          {filteredResources.length === 0 && !showUploadForm ? (
            <div className="p-12 text-center rounded-3xl border border-white/5 bg-white/5 backdrop-blur-xl shadow-sm flex flex-col items-center justify-center">
              <div className="w-20 h-20 bg-white/5 text-slate-400 border border-white/10 rounded-full flex items-center justify-center mb-4">
                <BookOpen className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No downloadable resources found</h3>
              <p className="text-slate-400 max-w-sm mb-6">No downloads available for your role or access level currently.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredResources.map((resource) => {
                const isOwner = resource.uploadedBy === user?._id || user?.role === 'admin';
                const canDownload = user?.role !== 'student' || resource.permission === 'granted';
                return (
                  <div key={resource._id} className="rounded-3xl border border-white/5 bg-white/5 backdrop-blur-xl shadow-sm overflow-hidden flex flex-col group hover:shadow-md transition-shadow relative">
                    {isOwner && (
                      <button
                        onClick={() => handleDelete(resource._id)}
                        title="Delete Resource"
                        className="absolute top-3 right-3 bg-white/10 hover:bg-[#E30A17]/20 text-[#E30A17] border border-transparent hover:border-[#E30A17]/30 p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all z-10 shadow-sm backdrop-blur"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}

                    <div className="h-40 bg-[#0B0E14] flex items-center justify-center relative overflow-hidden group-hover:bg-[#FFD700]/5 transition-colors">
                      <FileText className="w-16 h-16 text-[#FFD700]/20 group-hover:scale-110 transition-transform duration-500" />
                      <div className="absolute bottom-3 left-3 bg-[#008A32]/20 backdrop-blur px-3 py-1 rounded-lg text-xs font-bold text-[#008A32] shadow-sm border border-[#008A32]/20">
                        {resource.fileUrl?.split('.').pop()?.toUpperCase() || 'FILE'}
                      </div>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex gap-2 items-center mb-2">
                          <span className="text-[10px] font-bold text-[#FFD700] bg-[#FFD700]/10 border border-[#FFD700]/20 px-2.5 py-1 rounded-md uppercase tracking-wider">
                            {resource.category || 'General'}
                          </span>
                        </div>
                        <h3 className="font-bold text-lg text-white line-clamp-2 leading-tight mb-1" title={resource.title}>{resource.title}</h3>
                        <p className="text-slate-400 text-sm font-medium mb-4 line-clamp-1 border-b border-dashed border-white/5 pb-3">By {resource.author}</p>
                      </div>

                      <div className="space-y-2">
                        {canDownload ? (
                          <a
                            href={resource.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-center py-2 rounded-xl bg-[#008A32] text-white font-bold hover:bg-[#006622] transition-all"
                          >
                            <Download className="w-4 h-4 inline-block mr-2" /> Download
                          </a>
                        ) : (
                          <button className="w-full py-2 rounded-xl bg-[#FFD700] text-black font-bold">Enroll or Request Access</button>
                        )}
                        {user?.role === 'instructor' && resource.uploadedBy === user?._id && resource.status === 'draft' && (
                          <button onClick={() => handleSubmitForReview(resource)} className="w-full py-2 rounded-xl bg-[#008A32]/90 text-white font-bold">Submit for Review</button>
                        )}
                        {user?.role === 'admin' && resource.status === 'pending' && (
                          <button onClick={() => openReviewModal(resource)} className="w-full py-2 rounded-xl bg-[#E30A17] text-white font-bold">Review</button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {activeContainer === 'secure' && (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-4">
          <div className="rounded-3xl border border-white/10 p-4 bg-white/5">
            <h2 className="text-lg font-bold text-white mb-3">Secure Viewer Resources</h2>
            {filteredResources.length === 0 ? (
              <p className="text-slate-400">No secure documents for your account.</p>
            ) : (
              <div className="space-y-2">
                {filteredResources.map((resource) => (
                  <button
                    key={resource._id}
                    onClick={() => selectSecureResource(resource)}
                    className={`w-full text-left px-3 py-2 rounded-lg ${secureResource?._id === resource._id ? 'bg-cyan-500 text-white' : 'bg-white/10 text-slate-100 hover:bg-white/20'}`}>
                    {resource.title}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="rounded-3xl border border-white/10 p-4 bg-white/5" onContextMenu={(e) => user?.role === 'student' && e.preventDefault()}>
            <h2 className="text-lg font-bold text-white mb-3">Secure Document Reader</h2>
            {secureResource ? (
              <iframe
                src={secureResource.fileUrl}
                title={secureResource.title}
                className="w-full h-96 border border-white/10 rounded-lg"
                sandbox="allow-same-origin allow-scripts"
              />
            ) : (
              <p className="text-slate-400">Select a resource from the list to preview in the secure reader.</p>
            )}
            <p className="text-xs text-slate-500 mt-2">Right-click is blocked in this viewer for students.</p>
          </div>
        </div>
      )}

      {activeContainer === 'wiki' && (
        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-4">
          <aside className="rounded-3xl border border-white/10 p-4 bg-white/5">
            <h2 className="text-white font-bold mb-3">EDOT Wiki Navigation</h2>
            <ul className="text-slate-200 space-y-2 text-sm">
              <li><a className="hover:text-cyan-300" href="#overview">Overview</a></li>
              <li><a className="hover:text-cyan-300" href="#workflows">Workflows</a></li>
              <li><a className="hover:text-cyan-300" href="#roles">Role Permissions</a></li>
              <li><a className="hover:text-cyan-300" href="#submission">Submission Rules</a></li>
            </ul>
          </aside>
          <section className="rounded-3xl border border-white/10 p-4 bg-white/5 space-y-4 text-slate-200">
            <article id="overview"><h3 className="text-lg font-semibold text-white">Overview</h3><p>The EDOT Library is a multi-container resource hub: </p></article>
            <article id="workflows"><h3 className="text-lg font-semibold text-white">Workflows</h3><p>Instructors create and submit content, Admin reviews, Students consume with access gating.</p></article>
            <article id="roles"><h3 className="text-lg font-semibold text-white">Role Permissions</h3><p>Admin: full CRUD, Instructor: own CRUD + submit; Student: read/download if permitted; Parent: summary-only.</p></article>
            <article id="submission"><h3 className="text-lg font-semibold text-white">Submission</h3><p>New materials are staged as Draft/Pending. Admin can Approve or Request Corrections.</p></article>
          </section>
        </div>
      )}

      {/* Pending Queue for Admin only */}
      {user?.role === 'admin' && (
        <div className="rounded-3xl border border-white/10 p-4 bg-white/5 mt-4">
          <h3 className="text-white font-bold mb-3">Pending Approval Queue</h3>
          {pendingQueue.length === 0 ? (
            <p className="text-slate-400">No items are pending approval.</p>
          ) : pendingQueue.map((item) => (
            <div key={item._id} className="mb-2 p-3 border border-white/10 rounded-xl bg-[#0B0E14]/80">
              <div className="flex justify-between items-center">
                <p className="text-white font-semibold">{item.title}</p>
                <button onClick={() => openReviewModal(item)} className="px-2 py-1 text-xs rounded-lg bg-[#E30A17] text-white">Review</button>
              </div>
              <p className="text-xs text-slate-300">Uploaded by {item.author} | Category: {item.category}</p>
            </div>
          ))}
        </div>
      )}

      {reviewModalOpen && reviewTarget && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-[#0B0E14] border border-white/10 rounded-3xl p-6">
            <h4 className="text-xl font-bold text-white mb-3">Review & Comment</h4>
            <p className="text-sm text-slate-300 mb-2">Resource: {reviewTarget.title}</p>
            <textarea
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              className="w-full h-28 p-3 rounded-xl bg-[#0B0E14] border border-white/10 text-white outline-none mb-3"
              placeholder="Leave feedback or request corrections..."
            />
            <div className="flex gap-2 mb-4">
              <button onClick={() => setReviewDecision('approved')} className={`px-3 py-2 rounded-lg text-sm ${reviewDecision === 'approved' ? 'bg-[#008A32] text-white' : 'bg-white/10 text-white'}`}>Approve</button>
              <button onClick={() => setReviewDecision('rejected')} className={`px-3 py-2 rounded-lg text-sm ${reviewDecision === 'rejected' ? 'bg-[#E30A17] text-white' : 'bg-white/10 text-white'}`}>Reject</button>
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => setReviewModalOpen(false)} className="px-4 py-2 rounded-lg bg-white/10 text-white">Cancel</button>
              <button onClick={handleReviewSubmit} className="px-4 py-2 rounded-lg bg-cyan-500 text-white">Submit</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

