import { LucideIcon } from 'lucide-react';
import styles from '@/app/admin/admin.module.css';

interface PlaceholderTabProps {
  icon: LucideIcon;
  title: string;
}

export default function PlaceholderTab({ icon: Icon, title }: PlaceholderTabProps) {
  return (
    <div className={styles.tableSection} style={{ padding: '4rem', textAlign: 'center', color: 'var(--muted-foreground)' }}>
      <div style={{ background: 'var(--accent)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
        <Icon size={32} />
      </div>
      <h3>Modul {title} dalam Pengembangan</h3>
      <p>Fitur untuk tab ini sedang dalam tahap integrasi database (Supabase).</p>
    </div>
  );
}
