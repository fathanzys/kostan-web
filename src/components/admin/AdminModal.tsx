import { XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from '@/app/admin/admin.module.css';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingRoom: any;
  formData: any;
  setFormData: (data: any) => void;
  handleSubmit: (e: React.FormEvent) => void;
}

export default function AdminModal({
  isOpen,
  onClose,
  editingRoom,
  formData,
  setFormData,
  handleSubmit
}: AdminModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className={styles.modalOverlay}>
          <motion.div 
            className={styles.modalContent}
            style={{ maxHeight: '90vh', overflowY: 'auto' }}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
          >
            <div className={styles.modalHeader}>
              <h2>{editingRoom ? 'Edit Data Kamar' : 'Tambah Kamar Baru'}</h2>
              <button onClick={onClose} className={styles.closeBtn}><XCircle size={24} /></button>
            </div>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label>Nama Kamar</label>
                <input 
                  type="text" 
                  placeholder="Contoh: Kamar A-05" 
                  required 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Harga Sewa (Per Bulan)</label>
                <input 
                  type="number" 
                  placeholder="Contoh: 1500000" 
                  required 
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Status Kamar</label>
                <select 
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                >
                  <option value="Available">Tersedia (Available)</option>
                  <option value="Occupied">Terisi (Occupied)</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>Nama Penghuni (Opsional)</label>
                <input 
                  type="text" 
                  placeholder="-" 
                  value={formData.occupant}
                  onChange={(e) => setFormData({...formData, occupant: e.target.value})}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Foto Kamar (Upload file atau masukkan URL)</label>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setFormData({...formData, imageFile: e.target.files[0]});
                      }
                    }}
                    style={{ flex: 1, padding: '0.5rem', border: '1px dashed var(--border)', borderRadius: '0.5rem' }}
                  />
                </div>
                <input 
                  type="text" 
                  placeholder="Atau paste URL gambar..." 
                  value={formData.image}
                  onChange={(e) => setFormData({...formData, image: e.target.value})}
                />
                {formData.imageFile && <small style={{ color: 'var(--primary)' }}>File siap di-upload: {formData.imageFile.name}</small>}
              </div>
              <div className={styles.formGroup}>
                <label>Fasilitas (Pisahkan dengan koma)</label>
                <input 
                  type="text" 
                  placeholder="AC, Kasur, Lemari, Wifi" 
                  value={formData.facilities}
                  onChange={(e) => setFormData({...formData, facilities: e.target.value})}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Deskripsi Kamar</label>
                <textarea 
                  rows={4}
                  placeholder="Kamar luas dan nyaman..." 
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--foreground)', fontFamily: 'inherit' }}
                />
              </div>
              <div className={styles.formActions}>
                <button type="button" onClick={onClose} className="btn btn-outline">Batal</button>
                <button type="submit" className="btn btn-primary">{editingRoom ? 'Simpan Perubahan' : 'Tambah Kamar'}</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
