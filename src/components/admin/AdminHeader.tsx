import { useState } from 'react';
import { Search, Bell, ChevronDown, User, Settings, LogOut, Menu } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import styles from '@/app/admin/admin.module.css';

interface AdminHeaderProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onMenuClick: () => void;
}

export default function AdminHeader({ searchTerm, setSearchTerm, onMenuClick }: AdminHeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  return (
    <header className={styles.header}>
      <button className={styles.menuBtn} onClick={onMenuClick}>
        <Menu size={24} />
      </button>
      
      <div className={styles.searchBar}>
        <Search size={20} className={styles.searchIcon} />
        <input 
          type="text" 
          placeholder="Cari kamar..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className={styles.headerActions}>
        <button className={styles.iconBtn}><Bell size={20} /></button>
        <div style={{ position: 'relative' }}>
          <div 
            className={styles.userProfile} 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <div className={styles.avatar}>AD</div>
            <div className={styles.userInfo}>
              <span className={styles.userName}>Admin Utama</span>
              <span className={styles.userRole}>Pemilik Kost</span>
            </div>
            <ChevronDown size={16} style={{ transition: 'transform 0.2s', transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0)' }} />
          </div>

          {isDropdownOpen && (
            <div className={styles.dropdownMenu}>
              <div className={styles.dropdownHeader}>
                <strong>Akun Saya</strong>
              </div>
              <a href="#" className={styles.dropdownItem}>
                <User size={16} /> Profil
              </a>
              <a href="#" className={styles.dropdownItem}>
                <Settings size={16} /> Pengaturan
              </a>
              <div className={styles.dropdownDivider}></div>
              <button onClick={handleLogout} className={`${styles.dropdownItem} ${styles.dropdownDanger}`}>
                <LogOut size={16} /> Keluar Aplikasi
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
