'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Home, Lock, Mail, UserPlus, LogIn } from 'lucide-react';
import { motion } from 'framer-motion';
import styles from './login.module.css';

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      if (isLogin) {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) throw signInError;

        // Check approval status
        if (data.user) {
          const { data: profile } = await supabase
            .from('admin_profiles')
            .select('is_approved')
            .eq('id', data.user.id)
            .single();

          if (profile && !profile.is_approved) {
            await supabase.auth.signOut();
            throw new Error('Akun Anda belum disetujui oleh Super Admin. Silakan tunggu.');
          }
          
          router.push('/admin');
        }
      } else {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });

        if (signUpError) throw signUpError;
        setMessage('Registrasi berhasil! Silakan tunggu persetujuan Super Admin untuk bisa login.');
        setIsLogin(true);
      }
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.backBtn} onClick={() => router.push('/')}>
        <Home size={20} /> Kembali ke Beranda
      </div>

      <motion.div 
        className={styles.card}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className={styles.header}>
          <div className={styles.logoCircle}>
            <Lock size={24} />
          </div>
          <h1>{isLogin ? 'Login Admin' : 'Daftar Admin'}</h1>
          <p className="text-muted">
            {isLogin 
              ? 'Masuk ke sistem manajemen Kostan Premium.' 
              : 'Daftar untuk mendapatkan akses admin.'}
          </p>
        </div>

        {error && <div className={styles.errorAlert}>{error}</div>}
        {message && <div className={styles.successAlert}>{message}</div>}

        <form onSubmit={handleAuth} className={styles.form}>
          <div className={styles.formGroup}>
            <label>Email</label>
            <div className={styles.inputWrapper}>
              <Mail className={styles.inputIcon} size={18} />
              <input 
                type="email" 
                placeholder="admin@kostan.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Password</label>
            <div className={styles.inputWrapper}>
              <Lock className={styles.inputIcon} size={18} />
              <input 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className={`btn btn-primary ${styles.submitBtn}`} disabled={loading}>
            {loading ? 'Memproses...' : (isLogin ? <><LogIn size={18} /> Masuk</> : <><UserPlus size={18} /> Daftar</>)}
          </button>
        </form>

        <div className={styles.footer}>
          <p>
            {isLogin ? "Belum punya akun?" : "Sudah punya akun?"}
            <button 
              className={styles.switchBtn} 
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setMessage('');
              }}
            >
              {isLogin ? 'Daftar di sini' : 'Login di sini'}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
