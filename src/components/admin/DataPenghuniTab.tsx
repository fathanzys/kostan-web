import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Users, Phone, Calendar, Trash2, Edit, XCircle } from 'lucide-react';
import styles from '@/app/admin/admin.module.css';
import { AnimatePresence, motion } from 'framer-motion';

export default function DataPenghuniTab() {
  const [occupants, setOccupants] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOccupant, setEditingOccupant] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    room_id: '',
    move_in_date: new Date().toISOString().split('T')[0],
    status: 'Active'
  });

  const fetchOccupants = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('occupants')
      .select('*, rooms(name)')
      .order('created_at', { ascending: false });
    
    if (!error && data) {
      setOccupants(data);
    }
    
    // Fetch rooms for dropdown
    const { data: roomData } = await supabase.from('rooms').select('id, name');
    if (roomData) setRooms(roomData);
    
    setLoading(false);
  };

  useEffect(() => {
    fetchOccupants();
  }, []);

  const handleAdd = () => {
    setEditingOccupant(null);
    setFormData({
      name: '',
      phone: '',
      room_id: rooms.length > 0 ? rooms[0].id : '',
      move_in_date: new Date().toISOString().split('T')[0],
      status: 'Active'
    });
    setIsModalOpen(true);
  };

  const handleEdit = (occ: any) => {
    setEditingOccupant(occ);
    setFormData({
      name: occ.name,
      phone: occ.phone || '',
      room_id: occ.room_id || '',
      move_in_date: occ.move_in_date || new Date().toISOString().split('T')[0],
      status: occ.status
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...formData, room_id: formData.room_id ? parseInt(formData.room_id) : null };

    if (editingOccupant) {
      const { error } = await supabase.from('occupants').update(payload).eq('id', editingOccupant.id);
      if (!error) {
        fetchOccupants();
        setIsModalOpen(false);
      } else {
        alert('Gagal mengupdate: ' + error.message);
      }
    } else {
      const { error } = await supabase.from('occupants').insert([payload]);
      if (!error) {
        fetchOccupants();
        setIsModalOpen(false);
      } else {
        alert('Gagal menambah: ' + error.message);
      }
    }
  };

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
        <button className="btn btn-primary" onClick={handleAdd}>
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
                    <button className={styles.actionBtn} title="Edit" onClick={() => handleEdit(occ)}>
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

      <AnimatePresence>
        {isModalOpen && (
          <div className={styles.modalOverlay}>
            <motion.div 
              className={styles.modalContent}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
            >
              <div className={styles.modalHeader}>
                <h2>{editingOccupant ? 'Edit Penghuni' : 'Tambah Penghuni'}</h2>
                <button onClick={() => setIsModalOpen(false)} className={styles.closeBtn}><XCircle size={24} /></button>
              </div>
              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                  <label>Nama Penghuni</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Kontak (No HP / WhatsApp)</label>
                  <input 
                    type="text" 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Pilih Kamar</label>
                  <select 
                    value={formData.room_id}
                    onChange={(e) => setFormData({...formData, room_id: e.target.value})}
                  >
                    <option value="">-- Tidak Ada Kamar --</option>
                    {rooms.map(r => (
                      <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>Tanggal Masuk</label>
                  <input 
                    type="date" 
                    required 
                    value={formData.move_in_date}
                    onChange={(e) => setFormData({...formData, move_in_date: e.target.value})}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Status</label>
                  <select 
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                  >
                    <option value="Active">Aktif</option>
                    <option value="Inactive">Tidak Aktif (Pindah)</option>
                  </select>
                </div>
                <div className={styles.formActions}>
                  <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)}>Batal</button>
                  <button type="submit" className="btn btn-primary">Simpan Data</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
