'use client';

import { useRouter } from 'next/navigation';
import { LayoutDashboard, BedDouble, Users, TrendingUp, Settings, LogOut, Shield } from 'lucide-react';
import styles from '@/app/admin/admin.module.css';
import { supabase } from '@/lib/supabase';

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole: string;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export default function AdminSidebar({ activeTab, setActiveTab, userRole, isOpen, setIsOpen }: AdminSidebarProps) {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    setIsOpen(false);
  };

  return (
    <>
      <div className={`${styles.sidebarOverlay} ${isOpen ? styles.sidebarOverlayOpen : ''}`} onClick={() => setIsOpen(false)}></div>
      <aside className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ''}`}>
      <div className={styles.sidebarBrand}>
        <div className={styles.logoCircle}>K</div>
        <span>Kost H Kodir<span> Admin</span></span>
      </div>
      <nav className={styles.sidebarNav}>
        <a href="#" className={activeTab === 'dashboard' ? styles.active : ''} onClick={(e) => { e.preventDefault(); handleTabClick('dashboard'); }}><LayoutDashboard size={20} /> Dashboard</a>
        <a href="#" className={activeTab === 'rooms' ? styles.active : ''} onClick={(e) => { e.preventDefault(); handleTabClick('rooms'); }}><BedDouble size={20} /> Manajemen Kamar</a>
        <a href="#" className={activeTab === 'occupants' ? styles.active : ''} onClick={(e) => { e.preventDefault(); handleTabClick('occupants'); }}><Users size={20} /> Data Penghuni</a>
        <a href="#" className={activeTab === 'finance' ? styles.active : ''} onClick={(e) => { e.preventDefault(); handleTabClick('finance'); }}><TrendingUp size={20} /> Laporan Keuangan</a>
        {userRole === 'super_admin' && (
          <a href="#" className={activeTab === 'super_admin' ? styles.active : ''} onClick={(e) => { e.preventDefault(); handleTabClick('super_admin'); }}><Shield size={20} /> Akses Admin</a>
        )}
        <div className={styles.navSeparator}></div>
        <a href="#" className={activeTab === 'settings' ? styles.active : ''} onClick={(e) => { e.preventDefault(); handleTabClick('settings'); }}><Settings size={20} /> Pengaturan</a>
      </nav>
      <div className={styles.sidebarFooter}>
        <button className={styles.logoutBtn} onClick={handleLogout}>
          <LogOut size={20} /> Keluar Sesi
        </button>
      </div>
    </aside>
    </>
  );
}

