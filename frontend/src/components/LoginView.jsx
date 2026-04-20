import React, { useState } from 'react';
import { AtSign, Lock, LogIn } from 'lucide-react';

const LoginView = ({ onLogin }) => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const success = await onLogin(form.username, form.password);
    if (!success) {
      setError('Credenciales incorrectas. Intenta de nuevo.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8faff] p-6 relative overflow-hidden">
      {/* Abstract Background Shapes */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100/50 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-100/50 rounded-full blur-3xl animate-pulse"></div>

      <div className="w-full max-w-md animate-scale-in z-10">
        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-indigo-100/50 overflow-hidden border border-white/50">
          <div className="p-10 text-center bg-gradient-to-br from-blue-600 to-indigo-700">
            <h1 className="text-3xl font-black text-white tracking-tight">AREP</h1>
            <p className="text-blue-100 mt-2 font-medium">Arquitectura de microservicios</p>
          </div>

          <div className="p-10 space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-slate-800">Bienvenido</h2>
              <p className="text-slate-400 text-sm">Ingresa tus datos para acceder al timeline.</p>
            </div>

            {error && (
              <div className="p-4 bg-red-50 text-red-500 rounded-2xl text-sm font-semibold border border-red-100 animate-fade-in flex items-center gap-2">
                <span>⚠️</span> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative group">
                <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={18} />
                <input 
                  type="text" 
                  placeholder="Usuario"
                  className="w-full bg-slate-50 border-2 border-transparent rounded-2xl py-4 pl-12 pr-4 focus:bg-white focus:border-blue-500 transition-all outline-none text-slate-700 font-medium"
                  value={form.username}
                  onChange={e => setForm({...form, username: e.target.value})}
                  required
                />
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={18} />
                <input 
                  type="password" 
                  placeholder="Contraseña"
                  className="w-full bg-slate-50 border-2 border-transparent rounded-2xl py-4 pl-12 pr-4 focus:bg-white focus:border-blue-500 transition-all outline-none text-slate-700 font-medium"
                  value={form.password}
                  onChange={e => setForm({...form, password: e.target.value})}
                  required
                />
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? 'Validando...' : <><LogIn size={18} /> Entrar</>}
              </button>
            </form>

            <div className="pt-6 border-t border-slate-50">
              <p className="text-center text-xs text-slate-400">
                Acceso demo: <b className="text-blue-500">sebastian</b> / <b className="text-blue-500">password123</b>
              </p>
            </div>
          </div>
        </div>
        
        <footer className="text-center mt-8 space-y-2">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">
            PROYECTO ACADÉMICO - AREP 2026
          </p>
          <div className="flex justify-center gap-4 text-slate-300 text-xs font-bold">
            <span>Sebastian</span>
            <span className="w-1 h-1 rounded-full bg-slate-200 mt-1.5"></span>
            <span>Angel</span>
            <span className="w-1 h-1 rounded-full bg-slate-200 mt-1.5"></span>
            <span>Pablo</span>
          </div>
          <p className="text-slate-200 text-[9px] font-medium">Escuela Colombiana de Ingeniería Julio Garavito</p>
        </footer>
      </div>
    </div>
  );
};

export default LoginView;
