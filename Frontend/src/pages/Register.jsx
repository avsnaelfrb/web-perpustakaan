import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';


export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    nim: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (!formData.name || !formData.email || !formData.password || !formData.nim) {
      setError('Semua field harus diisi');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Password dan konfirmasi password tidak cocok');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password minimal 6 karakter');
      setLoading(false);
      return;
    }

    if (String(formData.nim).length < 5) {
      setError('NIM tidak valid');
      setLoading(false);
      return;
    }

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        nim: Number(formData.nim)
      };

      const res = await api.post('/user/register', payload);

      const body = res.data;

      if (res.status >= 200 && res.status < 300) {
        toast.success(body?.message || 'Registrasi berhasil! 🎉', {
          style: {
            background: '#1e293b',
            color: 'white',
            borderRadius: '10px'
          },
        });

        setTimeout(() => navigate('/login'), 1200);
  
      } else {
        toast.error(body?.message || 'Registrasi gagal', {
          style: {
            background: '#fee2e2',
            color: '#991b1b',
          }
        });
      }
  
  } catch (err) {
      console.error('Register error:', err);
  
      const serverMsg = err.response?.data?.message || err.response?.data?.error;
  
      if (serverMsg) {
        toast.error(serverMsg);
      } else if (err.code === 'ERR_NETWORK' || err.message === 'Network Error') {
        toast.error('Kesalahan jaringan: tidak dapat terhubung ke server. Periksa backend/CORS.');
      } else {
        toast.error('Terjadi kesalahan. Silakan coba lagi.');
      }
  
  } finally {
      setLoading(false);
  }
}

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Register Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Logo & Title */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-900 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13..." />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">E-Library</h1>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Buat Akun Baru</h2>
            <p className="text-gray-600">Daftar untuk memulai menggunakan E-Library</p>
          </div>

          {/* Pesan Error */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Nama */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap</label>
              <input name="name" value={formData.name} onChange={handleChange} className="w-full px-4 text-white py-3 border rounded-lg" />
            </div>

            {/* NIM */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">NIM</label>
              <input name="nim" type="number" value={formData.nim} onChange={handleChange} className="w-full px-4 text-white py-3 border rounded-lg" />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input name="email" type="email" value={formData.email} onChange={handleChange} className="w-full px-4 text-white py-3 border rounded-lg" />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <input name="password" type={showPassword ? 'text' : 'password'} value={formData.password} onChange={handleChange} className="w-full px-4 text-white py-3 border rounded-lg pr-12" />
                <button type="button" onClick={() => setShowPassword(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2">...</button>
              </div>
            </div>

            {/* Konfirmasi Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Konfirmasi Password</label>
              <div className="relative">
                <input name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} value={formData.confirmPassword} onChange={handleChange} className="w-full px-4 text-white py-3 border rounded-lg pr-12" />
                <button type="button" onClick={() => setShowConfirmPassword(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2">...</button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-blue-900 text-white py-3 rounded-lg">
              {loading ? 'Mendaftar...' : 'Daftar'}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-600">
            Sudah punya akun?{' '}
            <button onClick={() => navigate('/login')} className="text-blue-900">Masuk sekarang</button>
          </p>
        </div>
      </div>

      {/* Right Side - Illustration (optional) */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-blue-900 to-indigo-600 p-12 items-center justify-center">
        {/* ... ilustrasi ... */}
      </div>
    </div>
  );
}
