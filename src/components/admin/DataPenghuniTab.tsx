import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Users, Phone, Calendar, Trash2, Edit } from 'lucide-react';
import styles from '@/app/admin/admin.module.css';

export default function DataPenghuniTab() {
  const [occupants, setOccupants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOccupants = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('occupants')
      .select('*, rooms(name)')
      .order('created_at', { ascending: false });
    
    if (!error && data) {
      setOccupants(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOccupants();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Yakin ingin menghapus data penghuni ini?')) return;
    const { error } = await supabase.from('occupants').delete().eq('id', id);
    if (!error) {
      fetchOccupants();
    } else {
      alert('Gagal menghapus penghuni: ' + error.message);
    }
  };

  if (loading) {
    return <div style={{ padding: '3rem', textAlign: 'center' }}>Memuat data penghuni...</div>;
  }

  return (
    <div className={styles.tableSection}>
      <div className={styles.tableHeader}>
        <div className={styles.tableTitle}>
          <h2>Data Penghuni</h2>
          <span className={styles.countBadge}>{occupants.length} Orang</span>
        </div>
        <button className="btn btn-primary" onClick={() => alert('Fitur tambah penghuni segera hadir!')}>
          Tambah Penghuni
        </button>
      </div>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Nama Penghuni</th>
              <th>Kamar</th>
              <th>Kontak</th>
              <th>Tanggal Masuk</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {occupants.map(occ => (
              <tr key={occ.id} className={styles.tableRow}>
                <td>
                  <div className={styles.roomNameCell}>
                    <div className={styles.roomIcon}><Users size={16} /></div>
                    <strong>{occ.name}</strong>
                  </div>
                </td>
                <td>{occ.rooms?.name || '-'}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--muted-foreground)' }}>
                    <Phone size={14} /> {occ.phone || '-'}
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--muted-foreground)' }}>
                    <Calendar size={14} /> {occ.move_in_date}
                  </div>
                </td>
                <td>
                  <span className={`${styles.statusBadge} ${occ.status === 'Active' ? styles.statusAvailable : styles.statusOccupied}`}>
                    <div className={styles.dot}></div>
                    {occ.status === 'Active' ? 'Aktif' : 'Tidak Aktif'}
                  </span>
                </td>
                <td>
                  <div className={styles.actions}>
                    <button className={styles.actionBtn} title="Edit" onClick={() => alert('Fitur edit segera hadir!')}>
                      <Edit size={18} />
                    </button>
                    <button className={styles.actionBtn} style={{ color: 'var(--destructive)' }} title="Hapus" onClick={() => handleDelete(occ.id)}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {occupants.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>Belum ada data penghuni.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
