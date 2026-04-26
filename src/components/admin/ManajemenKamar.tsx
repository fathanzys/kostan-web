import { Plus, BedDouble, CheckCircle, XCircle, Edit2, Trash2 } from 'lucide-react';
import styles from '@/app/admin/admin.module.css';

interface ManajemenKamarProps {
  rooms: any[];
  filteredRooms: any[];
  toggleStatus: (id: number) => void;
  handleEditRoom: (room: any) => void;
  handleDeleteRoom: (id: number) => void;
  handleAddRoom: () => void;
}

export default function ManajemenKamar({ 
  rooms, 
  filteredRooms, 
  toggleStatus, 
  handleEditRoom, 
  handleDeleteRoom,
  handleAddRoom 
}: ManajemenKamarProps) {
  return (
    <div className={styles.tableSection}>
      <div className={styles.tableHeader}>
        <div className={styles.tableTitle}>
          <h2>Manajemen Kamar</h2>
          <span className={styles.countBadge}>{filteredRooms.length} Kamar</span>
        </div>
        <button onClick={handleAddRoom} className="btn btn-primary btn-sm">
          <Plus size={18} /> Tambah Kamar Baru
        </button>
      </div>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Nama Kamar</th>
              <th>Harga Sewa</th>
              <th>Status</th>
              <th>Penghuni Saat Ini</th>
              <th style={{ textAlign: 'right' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredRooms.map(room => (
              <tr key={room.id} className={styles.tableRow}>
                <td>
                  <div className={styles.roomNameCell}>
                    <div className={styles.roomIcon}><BedDouble size={16} /></div>
                    <strong>{room.name}</strong>
                  </div>
                </td>
                <td>Rp {room.price.toLocaleString()}</td>
                <td>
                  <span className={`${styles.statusBadge} ${room.status === 'Available' ? styles.statusAvailable : styles.statusOccupied}`}>
                    <div className={styles.dot}></div>
                    {room.status === 'Available' ? 'Tersedia' : 'Terisi'}
                  </span>
                </td>
                <td>{room.occupant}</td>
                <td>
                  <div className={styles.actions}>
                    <button 
                      className={styles.actionBtn} 
                      title="Edit Data"
                      onClick={() => handleEditRoom(room)}
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      className={styles.actionBtn} 
                      style={{ color: 'var(--destructive)' }}
                      onClick={() => handleDeleteRoom(room.id)}
                    >
                      <Trash2 size={16} />
                    </button>
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
