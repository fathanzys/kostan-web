import { Search, Bell, ChevronDown } from 'lucide-react';
import styles from '@/app/admin/admin.module.css';

interface AdminHeaderProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export default function AdminHeader({ searchTerm, setSearchTerm }: AdminHeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.searchBar}>
        <Search size={20} className={styles.searchIcon} />
        <input 
          type="text" 
          placeholder="Cari kamar atau penghuni..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className={styles.headerActions}>
        <button className={styles.iconBtn}><Bell size={20} /></button>
        <div className={styles.userProfile}>
          <div className={styles.avatar}>AD</div>
          <div className={styles.userInfo}>
            <span className={styles.userName}>Admin Utama</span>
            <span className={styles.userRole}>Pemilik Kost</span>
          </div>
          <ChevronDown size={16} />
        </div>
      </div>
    </header>
  );
}
