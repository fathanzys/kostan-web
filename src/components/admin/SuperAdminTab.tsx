import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Shield, CheckCircle, XCircle } from 'lucide-react';
import styles from '@/app/admin/admin.module.css';

export default function SuperAdminTab() {
  const [admins, setAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAdmins = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('admin_profiles')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error && data) {
      setAdmins(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleApprove = async (id: string) => {
    const { error } = await supabase
      .from('admin_profiles')
      .update({ is_approved: true })
      .eq('id', id);
    
    if (!error) {
      fetchAdmins();
    } else {
      alert('Gagal menyetujui admin: ' + error.message);
    }
  };

  const handleRevoke = async (id: string) => {
    const { error } = await supabase
      .from('admin_profiles')
      .update({ is_approved: false })
      .eq('id', id);
    
    if (!error) {
      fetchAdmins();
    } else {
      alert('Gagal mencabut akses admin: ' + error.message);
    }
  };

  if (loading) {
    return <div style={{ padding: '3rem', textAlign: 'center' }}>Memuat daftar admin...</div>;
  }

  return (
    <div className={styles.tableSection}>
      <div className={styles.tableHeader}>
        <div className={styles.tableTitle}>
          <h2>Manajemen Admin</h2>
          <span className={styles.countBadge}>{admins.length} Pengguna</span>
        </div>
      </div>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Email Admin</th>
              <th>Role</th>
              <th>Status Persetujuan</th>
              <th style={{ textAlign: 'right' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {admins.map(admin => (
              <tr key={admin.id} className={styles.tableRow}>
                <td>
                  <div className={styles.roomNameCell}>
                    <div className={styles.roomIcon}><Shield size={16} /></div>
                    <strong>{admin.email}</strong>
                  </div>
                </td>
                <td>
                  <span style={{ textTransform: 'capitalize' }}>
                    {admin.role.replace('_', ' ')}
                  </span>
                </td>
                <td>
                  <span className={`${styles.statusBadge} ${admin.is_approved ? styles.statusAvailable : styles.statusOccupied}`}>
                    <div className={styles.dot}></div>
                    {admin.is_approved ? 'Disetujui' : 'Menunggu'}
                  </span>
                </td>
                <td>
                  <div className={styles.actions}>
                    {admin.role !== 'super_admin' && (
                      admin.is_approved ? (
                        <button 
                          className="btn btn-outline btn-sm"
                          onClick={() => handleRevoke(admin.id)}
                        >
                          <XCircle size={14} /> Cabut Akses
                        </button>
                      ) : (
                        <button 
                          className="btn btn-primary btn-sm"
                          onClick={() => handleApprove(admin.id)}
                        >
                          <CheckCircle size={14} /> Setujui
                        </button>
                      )
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
