import React, { useState, useEffect } from 'react';
import { Send, User as UserIcon, LogOut, RefreshCw, MessageSquare } from 'lucide-react';

const PostSkeleton = () => (
  <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 mb-6">
    <div className="flex items-center gap-4 mb-6">
      <div className="w-12 h-12 rounded-2xl skeleton"></div>
      <div className="flex-1 space-y-2">
        <div className="h-3 w-32 rounded-full skeleton"></div>
        <div className="h-2 w-20 rounded-full skeleton opacity-50"></div>
      </div>
    </div>
    <div className="space-y-3">
      <div className="h-3 w-full rounded-full skeleton"></div>
      <div className="h-3 w-[70%] rounded-full skeleton opacity-60"></div>
    </div>
  </div>
);

const FeedView = ({ auth, posts, onLogout, onPost, isLoading, isPosting }) => {
  const [content, setContent] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (content.trim() && content.length <= 140) {
      onPost(content);
      setContent('');
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfdff]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100/50">
        <div className="max-w-5xl mx-auto px-6 h-20 flex justify-between items-center">
          <h1 className="text-xl font-black text-slate-800 tracking-tight italic">AREP</h1>
          
          <div className="flex items-center gap-6">
            <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-blue-600 shadow-sm">
                <UserIcon size={16} />
              </div>
              <span className="text-sm font-bold text-slate-700">{auth.username}</span>
            </div>
            <button 
              onClick={onLogout}
              className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
            >
              <LogOut size={22} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto py-12 px-6">
        {/* Create Post */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-blue-50/50 border border-white mb-12 animate-slide-up">
          <form onSubmit={handleSubmit}>
            <div className="flex gap-5">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-2xl shadow-xl shadow-blue-100 shrink-0">
                {auth.username?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <textarea
                  className="w-full resize-none border-none focus:ring-0 text-xl p-0 placeholder:text-slate-300 min-h-[120px] bg-transparent text-slate-700 leading-relaxed"
                  placeholder="¿Qué está pasando?"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  maxLength={140}
                ></textarea>
              </div>
            </div>
            <div className="flex justify-between items-center mt-6 pt-6 border-t border-slate-50">
              <div className="flex items-center gap-3">
                <div className="h-1.5 w-32 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 ${
                      content.length > 130 ? 'bg-red-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${(content.length / 140) * 100}%` }}
                  ></div>
                </div>
                <span className={`text-[10px] font-black tracking-widest ${
                  content.length > 130 ? 'text-red-500' : 'text-slate-300'
                }`}>
                  {content.length}/140
                </span>
              </div>
              <button 
                type="submit"
                disabled={isPosting || !content.trim()}
                className="bg-blue-600 text-white px-8 py-3.5 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 active:scale-95 disabled:opacity-30 flex items-center gap-2"
              >
                {isPosting ? <RefreshCw className="animate-spin" size={18} /> : <Send size={18} />}
                Publicar
              </button>
            </div>
          </form>
        </div>

        {/* List */}
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">Timeline Global</h2>
            <div className="w-10 h-1 bg-blue-100 rounded-full"></div>
          </div>

          {isLoading ? (
            <>
              <PostSkeleton />
              <PostSkeleton />
              <PostSkeleton />
            </>
          ) : posts.length === 0 ? (
            <div className="py-24 text-center bg-white rounded-[2.5rem] border-2 border-dashed border-slate-100">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <MessageSquare className="text-slate-200" size={32} />
              </div>
              <p className="text-slate-400 font-bold text-lg">No hay posts todavía</p>
              <p className="text-slate-300 text-sm mt-1">Comparte tus ideas con el mundo</p>
            </div>
          ) : (
            posts.map((post, idx) => (
              <div 
                key={post.id} 
                className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 hover-lift animate-fade-in group"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center font-bold text-xl group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                    {post.username?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-800 text-lg leading-none">{post.username}</h3>
                    <p className="text-[10px] text-slate-300 font-black uppercase tracking-tighter mt-2">
                      {new Date(post.createdAt).toLocaleDateString(undefined, { 
                        month: 'long', 
                        day: 'numeric', 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>
                <p className="text-slate-600 text-lg leading-relaxed break-words font-medium">{post.content}</p>
              </div>
            ))
          )}
        </div>
        {/* Student Footer */}
        <footer className="mt-20 pt-10 border-t border-slate-100 text-center space-y-3 pb-12">
           <p className="text-slate-300 text-[10px] font-black uppercase tracking-[0.4em]">Laboratorio de Microservicios</p>
           <div className="flex justify-center gap-6 text-slate-400 text-xs font-bold">
              <span>Sebastian</span>
              <span>Angel</span>
              <span>Pablo</span>
           </div>
           <p className="text-slate-200 text-[9px] font-medium italic">Sistemas Distribuidos y Arquitecturas de Software</p>
        </footer>
      </main>
    </div>
  );
};

export default FeedView;
