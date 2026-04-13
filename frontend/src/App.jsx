import React, { useState, useEffect } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { LogOut, LogIn, Send } from 'lucide-react'

const API_BASE_URL = 'http://localhost:8080/api';

function App() {
  const { loginWithRedirect, logout, user, isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
  const [posts, setPosts] = useState([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [apiUser, setApiUser] = useState(null);

  useEffect(() => {
    fetchStream();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      syncUser();
    }
  }, [isAuthenticated]);

  const fetchStream = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/stream`);
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      }
    } catch (error) {
      console.error("Error fetching stream:", error);
    }
  };

  const syncUser = async () => {
    try {
      const token = await getAccessTokenSilently();
      const response = await fetch(`${API_BASE_URL}/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setApiUser(data);
      }
    } catch (error) {
      console.error("Error syncing user:", error);
    }
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!newPostContent.trim() || newPostContent.length > 140) return;

    setIsPosting(true);
    try {
      const token = await getAccessTokenSilently();
      const response = await fetch(`${API_BASE_URL}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content: newPostContent })
      });

      if (response.ok) {
        setNewPostContent('');
        fetchStream(); // refresh feed
      }
    } catch (error) {
      console.error("Error creating post:", error);
    } finally {
      setIsPosting(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen bg-gray-100">Cargando...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <header className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-500 tracking-tight">MiniTwitter</h1>
          <div>
            {!isAuthenticated ? (
              <button 
                onClick={() => loginWithRedirect()}
                className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-full font-semibold hover:bg-blue-600 transition"
              >
                <LogIn size={18} /> Iniciar Sesión
              </button>
            ) : (
              <div className="flex items-center gap-4">
                <span className="font-medium text-gray-700">{user?.nickname}</span>
                <button 
                  onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
                  className="flex items-center gap-2 text-gray-500 hover:text-red-500 transition font-medium"
                >
                  <LogOut size={18} /> Salir
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-xl mx-auto mt-8 px-4">
        {isAuthenticated && apiUser && (
          <div className="bg-white p-4 rounded-xl shadow-sm mb-6 border border-gray-100">
            <form onSubmit={handlePostSubmit}>
              <textarea
                className="w-full resize-none border-b-2 border-transparent focus:border-blue-500 focus:ring-0 outline-none text-lg p-2 transition bg-gray-50 rounded-md"
                placeholder="¿Qué está pasando?"
                rows="3"
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                maxLength={140}
              ></textarea>
              <div className="flex justify-between items-center mt-3 pt-2">
                <span className={`text-sm font-medium ${newPostContent.length > 130 ? 'text-red-500' : 'text-gray-400'}`}>
                  {newPostContent.length}/140
                </span>
                <button 
                  type="submit"
                  disabled={isPosting || !newPostContent.trim() || newPostContent.length > 140}
                  className="bg-blue-500 text-white px-6 py-2 rounded-full font-bold hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Send size={16} /> Postear
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="space-y-4">
          {posts.length === 0 ? (
            <p className="text-center text-gray-500 mt-10">No hay posts aún. ¡Sé el primero!</p>
          ) : (
            posts.map(post => (
              <div key={post.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:bg-gray-50 transition">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-400 to-indigo-500 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                    {post.username.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{post.username}</h3>
                    <p className="text-xs text-gray-500">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <p className="text-gray-800 text-lg break-words">{post.content}</p>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  )
}

export default App
