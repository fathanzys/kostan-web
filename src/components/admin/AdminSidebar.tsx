'use client';

import { useRouter } from 'next/navigation';
import { LayoutDashboard, BedDouble, Users, TrendingUp, Settings, LogOut, Shield } from 'lucide-react';
import styles from '@/app/admin/admin.module.css';
import { supabase } from '@/lib/supabase';

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole: string;
}

export default function AdminSidebar({ activeTab, setActiveTab, userRole }: AdminSidebarProps) {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarBrand}>
        <div className={styles.logoCircle}>K</div>
        <span>Kostan<span>Admin</span></span>
      </div>
      <nav className={styles.sidebarNav}>
        <a href="#" className={activeTab === 'dashboard' ? styles.active : ''} onClick={(e) => { e.preventDefault(); setActiveTab('dashboard'); }}><LayoutDashboard size={20} /> Dashboard</a>
        <a href="#" className={activeTab === 'rooms' ? styles.active : ''} onClick={(e) => { e.preventDefault(); setActiveTab('rooms'); }}><BedDouble size={20} /> Manajemen Kamar</a>
        <a href="#" className={activeTab === 'occupants' ? styles.active : ''} onClick={(e) => { e.preventDefault(); setActiveTab('occupants'); }}><Users size={20} /> Data Penghuni</a>
        <a href="#" className={activeTab === 'finance' ? styles.active : ''} onClick={(e) => { e.preventDefault(); setActiveTab('finance'); }}><TrendingUp size={20} /> Laporan Keuangan</a>
        {userRole === 'super_admin' && (
          <a href="#" className={activeTab === 'super_admin' ? styles.active : ''} onClick={(e) => { e.preventDefault(); setActiveTab('super_admin'); }}><Shield size={20} /> Akses Admin</a>
        )}
        <div className={styles.navSeparator}></div>
        <a href="#" className={activeTab === 'settings' ? styles.active : ''} onClick={(e) => { e.preventDefault(); setActiveTab('settings'); }}><Settings size={20} /> Pengaturan</a>
      </nav>
      <div className={styles.sidebarFooter}>
        <button className={styles.logoutBtn} onClick={handleLogout}>
          <LogOut size={20} /> Keluar Sesi
        </button>
      </div>
    </aside>
  );
}

