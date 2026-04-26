import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { TrendingUp, TrendingDown, Trash2, PlusCircle, MinusCircle } from 'lucide-react';
import styles from '@/app/admin/admin.module.css';

export default function LaporanKeuanganTab() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('transactions')
      .select('*, occupants(name)')
      .order('date', { ascending: false });
    
    if (!error && data) {
      setTransactions(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Yakin ingin menghapus transaksi ini?')) return;
    const { error } = await supabase.from('transactions').delete().eq('id', id);
    if (!error) {
      fetchTransactions();
    } else {
      alert('Gagal menghapus transaksi: ' + error.message);
    }
  };

  const totalIncome = transactions.filter(t => t.type === 'Income').reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'Expense').reduce((acc, curr) => acc + curr.amount, 0);

  if (loading) {
    return <div style={{ padding: '3rem', textAlign: 'center' }}>Memuat data keuangan...</div>;
  }

  return (
    <div className={styles.tableSection}>
      <div className={styles.tableHeader} style={{ flexWrap: 'wrap', gap: '1rem' }}>
        <div className={styles.tableTitle}>
          <h2>Laporan Keuangan</h2>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '0.5rem 1rem', borderRadius: '8px', fontWeight: 'bold' }}>
            Pemasukan: Rp {totalIncome.toLocaleString()}
          </div>
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '0.5rem 1rem', borderRadius: '8px', fontWeight: 'bold' }}>
            Pengeluaran: Rp {totalExpense.toLocaleString()}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn btn-outline" style={{ color: '#10b981', borderColor: '#10b981' }} onClick={() => alert('Segera hadir')}>
            <PlusCircle size={18} /> Pemasukan
          </button>
          <button className="btn btn-outline" style={{ color: '#ef4444', borderColor: '#ef4444' }} onClick={() => alert('Segera hadir')}>
            <MinusCircle size={18} /> Pengeluaran
          </button>
        </div>
      </div>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Tanggal</th>
              <th>Deskripsi</th>
              <th>Tipe</th>
              <th>Jumlah (Rp)</th>
              <th>Penghuni (Opsional)</th>
              <th style={{ textAlign: 'right' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(trx => (
              <tr key={trx.id} className={styles.tableRow}>
                <td>{trx.date}</td>
                <td><strong>{trx.description}</strong></td>
                <td>
                  <span className={`${styles.statusBadge} ${trx.type === 'Income' ? styles.statusAvailable : styles.statusOccupied}`}>
                    <div className={styles.dot}></div>
                    {trx.type === 'Income' ? 'Pemasukan' : 'Pengeluaran'}
                  </span>
                </td>
                <td style={{ color: trx.type === 'Income' ? '#10b981' : '#ef4444', fontWeight: 'bold' }}>
                  {trx.type === 'Income' ? '+' : '-'} {trx.amount.toLocaleString()}
                </td>
                <td>{trx.occupants?.name || '-'}</td>
                <td>
                  <div className={styles.actions}>
                    <button className={styles.actionBtn} style={{ color: 'var(--destructive)' }} title="Hapus" onClick={() => handleDelete(trx.id)}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {transactions.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>Belum ada data transaksi.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
