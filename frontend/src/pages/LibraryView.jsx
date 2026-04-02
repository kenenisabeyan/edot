import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { BookOpen, Search, Download, Plus, Trash2, FileText, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LibraryView() {
  const { user } = useAuth();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Upload Form State
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploadData, setUploadData] = useState({ title: '', author: '', category: 'General', file: null });
  const [submitting, setSubmitting] = useState(false);
  const [uploadError, setUploadError] = useState('');

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
        fileUrl: fileUrl
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

  const filteredResources = resources.filter(r => 
    r.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    r.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Digital Library</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Explore books, research papers, and documents.</p>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-5 h-5 absolute left-3 top-3 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search resources..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-medium"
            />
          </div>
          {canUpload && !showUploadForm && (
            <button 
              onClick={() => setShowUploadForm(true)}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-sm shrink-0"
            >
              <Plus className="w-5 h-5" /> Upload File
            </button>
          )}
        </div>
      </div>

      {/* Upload Form Engine */}
      {showUploadForm && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-indigo-100 dark:border-slate-800 p-6 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-center mb-6">
             <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                 <FileText className="w-5 h-5 text-indigo-500" /> Upload New Resource
             </h2>
             <button onClick={() => setShowUploadForm(false)} className="text-slate-400 hover:text-slate-600 font-medium text-sm">Cancel</button>
          </div>
          
          {uploadError && (
             <div className="mb-4 bg-rose-50 text-rose-600 p-3 rounded-xl flex items-center gap-2 text-sm font-semibold border border-rose-200">
                <AlertCircle className="w-5 h-5" /> {uploadError}
             </div>
          )}

          <form onSubmit={handleUploadSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-1 md:col-span-1">
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Document Title</label>
                    <input 
                      type="text" required placeholder="Advanced Mathematics Vol 2"
                      value={uploadData.title} onChange={(e) => setUploadData({ ...uploadData, title: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Author / Publisher</label>
                    <input 
                      type="text" required placeholder="John Doe"
                      value={uploadData.author} onChange={(e) => setUploadData({ ...uploadData, author: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Category</label>
                    <select 
                      value={uploadData.category} onChange={(e) => setUploadData({ ...uploadData, category: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 font-semibold cursor-pointer"
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
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">File Attachment</label>
                <div className="relative border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-6 bg-slate-50/50 dark:bg-slate-800/50 hover:bg-indigo-50/50 dark:hover:bg-indigo-500/10 transition-colors group cursor-pointer">
                    <input 
                      type="file" 
                      required
                      accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                    />
                    <div className="flex flex-col items-center justify-center text-center space-y-2">
                       <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Download className="w-6 h-6" />
                       </div>
                       <div>
                         {uploadData.file ? (
                            <p className="font-bold text-indigo-600 dark:text-indigo-400">{uploadData.file.name}</p>
                         ) : (
                            <p className="font-semibold text-slate-600 dark:text-slate-300">Drag & Drop your file here, or click to browse</p>
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
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all w-full sm:w-auto disabled:opacity-70"
                >
                  {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Plus className="w-5 h-5" /> Save to Library</>}
                </button>
            </div>
          </form>
        </div>
      )}

      {/* Empty State vs Grid */}
      {filteredResources.length === 0 && !showUploadForm ? (
        <div className="bg-white dark:bg-slate-900 p-12 text-center rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center">
           <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800/50 text-slate-300 dark:text-slate-600 border border-slate-100 dark:border-slate-700 rounded-full flex items-center justify-center mb-4">
             <BookOpen className="w-10 h-10" />
           </div>
           <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No resources found</h3>
           <p className="text-slate-500 dark:text-slate-400 max-w-sm mb-6">The library is empty or no files match your search criteria. Check back later!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredResources.map((resource) => {
            const isOwner = resource.uploadedBy === user?._id || user?.role === 'admin';
            
            return (
              <div key={resource._id} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col group hover:shadow-md transition-shadow relative">
                
                {/* Delete Button overlaid on hover */}
                {isOwner && (
                  <button 
                    onClick={() => handleDelete(resource._id)}
                    title="Delete Resource"
                    className="absolute top-3 right-3 bg-white/90 hover:bg-rose-50 text-rose-500 border border-transparent hover:border-rose-200 p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all z-10 shadow-sm backdrop-blur"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}

                <div className="h-40 bg-indigo-50/50 dark:bg-slate-800 flex items-center justify-center relative overflow-hidden group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/20 transition-colors">
                   <FileText className="w-16 h-16 text-indigo-300 dark:text-indigo-500/20 group-hover:scale-110 transition-transform duration-500" />
                   
                   {/* File Type Badge decoration */}
                   <div className="absolute bottom-3 left-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur px-3 py-1 rounded-lg text-xs font-bold text-slate-500 dark:text-slate-400 shadow-sm border border-slate-100/50 dark:border-slate-700/50">
                     {resource.fileUrl?.split('.').pop()?.toUpperCase() || 'FILE'}
                   </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between bg-white dark:bg-slate-900">
                  <div>
                    <div className="flex gap-2 items-center mb-2">
                       <span className="text-[10px] font-bold text-indigo-700 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-500/10 border border-indigo-200/50 dark:border-indigo-500/20 px-2.5 py-1 rounded-md uppercase tracking-wider">
                         {resource.category || 'General'}
                       </span>
                    </div>
                    <h3 className="font-bold text-lg text-slate-800 dark:text-white line-clamp-2 leading-tight mb-1" title={resource.title}>{resource.title}</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-4 line-clamp-1 border-b border-dashed border-slate-200 dark:border-slate-800 pb-3">By {resource.author}</p>
                  </div>
                  
                  <a 
                    href={`http://localhost:5000${resource.fileUrl}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full flex justify-center items-center gap-2 py-3 rounded-xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 font-bold hover:border-indigo-600 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-500 dark:hover:border-indigo-500 transition-all group/btn"
                  >
                    <Download className="w-4 h-4 group-hover/btn:translate-y-0.5 transition-transform" /> Access File
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
