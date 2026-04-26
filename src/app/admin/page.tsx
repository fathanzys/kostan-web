'use client';

import { useState, useEffect } from 'react';
import { Users, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import styles from './admin.module.css';
import { supabase, Room } from '@/lib/supabase';

import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import DashboardOverview from '@/components/admin/DashboardOverview';
import ManajemenKamar from '@/components/admin/ManajemenKamar';
import AdminModal from '@/components/admin/AdminModal';
import SuperAdminTab from '@/components/admin/SuperAdminTab';
import DataPenghuniTab from '@/components/admin/DataPenghuniTab';
import LaporanKeuanganTab from '@/components/admin/LaporanKeuanganTab';

export default function AdminDashboard() {
  const [userRole, setUserRole] = useState('admin');
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: profile } = await supabase
          .from('admin_profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();
        if (profile) {
          setUserRole(profile.role);
        }
      }
    };
    fetchUser();
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .order('id', { ascending: true });
    
    if (error) {
      console.error('Error fetching rooms:', error);
    } else {
      setRooms(data || []);
    }
    setIsLoading(false);
  };

  const [formData, setFormData] = useState<{
    name: string;
    price: string;
    status: string;
    occupant: string;
    image: string;
    description: string;
    facilities: string;
    imageFile?: File | null;
  }>({
    name: '',
    price: '',
    status: 'Available',
    occupant: '-',
    image: '',
    description: '',
    facilities: '',
    imageFile: null
  });

  const toggleStatus = async (id: number) => {
    // Note: To be fully implemented if toggle button is used, but for now we edit via modal.
  };

  const handleAddRoom = () => {
    setEditingRoom(null);
    setFormData({ 
      name: '', 
      price: '', 
      status: 'Available', 
      occupant: '-',
      image: '',
      description: '',
      facilities: '',
      imageFile: null
    });
    setIsModalOpen(true);
  };

  const handleEditRoom = (room: Room) => {
    setEditingRoom(room);
    setFormData({ 
      name: room.name, 
      price: room.price.toString(), 
      status: room.status, 
      occupant: room.occupant || '-',
      image: room.image || '',
      description: room.description || '',
      facilities: room.facilities?.join(', ') || '',
      imageFile: null
    });
    setIsModalOpen(true);
  };

  const handleDeleteRoom = async (id: number) => {
    if (!confirm('Yakin ingin menghapus kamar ini?')) return;
    
    const { error } = await supabase.from('rooms').delete().eq('id', id);
    if (!error) {
      setRooms(rooms.filter(r => r.id !== id));
    } else {
      console.error('Error deleting room:', error);
      alert('Gagal menghapus kamar');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let imageUrl = formData.image || 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=800';

    if (formData.imageFile) {
      const fileExt = formData.imageFile.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `rooms/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('kostan_media')
        .upload(filePath, formData.imageFile);

      if (uploadError) {
        alert('Gagal upload gambar: ' + uploadError.message);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from('kostan_media')
        .getPublicUrl(filePath);
        
      imageUrl = publicUrlData.publicUrl;
    }

    const payload = {
      name: formData.name,
      price: parseInt(formData.price),
      status: formData.status,
      occupant: formData.occupant,
      image: imageUrl,
      description: formData.description,
      facilities: formData.facilities.split(',').map(f => f.trim()).filter(f => f !== '')
    };

    if (editingRoom) {
      const { error } = await supabase.from('rooms').update(payload).eq('id', editingRoom.id);
      if (!error) {
        setRooms(rooms.map(r => r.id === editingRoom.id ? { ...r, ...payload } : r));
      } else {
        console.error('Update room error:', error);
        alert(`Gagal mengupdate kamar: ${error.message || 'Unknown error'}`);
      }
    } else {
      const { data, error } = await supabase.from('rooms').insert([payload]).select();
      if (!error && data) {
        setRooms([...rooms, data[0]]);
      } else {
        console.error('Insert room error:', error, 'payload:', payload);
        alert(`Gagal menambah kamar: ${error?.message || 'Unknown error'}`);
      }
    }
    setIsModalOpen(false);
  };

  const filteredRooms = rooms.filter(r => 
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.occupant.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.adminLayout}>
      <AdminModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editingRoom={editingRoom}
        formData={formData}
        setFormData={setFormData}
        handleSubmit={handleSubmit}
      />
      <AdminSidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        userRole={userRole}
        isOpen={isMobileSidebarOpen}
        setIsOpen={setIsMobileSidebarOpen}
      />

      <main className={styles.content}>
        <AdminHeader 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm}
          onMenuClick={() => setIsMobileSidebarOpen(true)}
        />

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className={styles.pageTitle}>
            <h1>
              {activeTab === 'dashboard' && 'Dashboard Overview'}
              {activeTab === 'rooms' && 'Manajemen Kamar'}
              {activeTab === 'occupants' && 'Data Penghuni'}
              {activeTab === 'finance' && 'Laporan Keuangan'}
              {activeTab === 'super_admin' && 'Akses Admin'}
              {activeTab === 'settings' && 'Pengaturan'}
            </h1>
            <p className="text-muted">
              {activeTab === 'dashboard' && 'Selamat datang kembali! Berikut ringkasan hari ini.'}
              {activeTab === 'rooms' && 'Kelola data kamar, harga, dan ketersediaan.'}
              {activeTab === 'occupants' && 'Pantau dan kelola data seluruh penghuni kost.'}
              {activeTab === 'finance' && 'Laporan pemasukan dan pengeluaran secara real-time.'}
              {activeTab === 'super_admin' && 'Kelola persetujuan dan hak akses admin lain.'}
              {activeTab === 'settings' && 'Konfigurasi pengaturan sistem Kost H Kodir.'}
            </p>
          </div>

          {(activeTab === 'dashboard' || activeTab === 'finance') && (
            <DashboardOverview rooms={rooms} />
          )}

          {(activeTab === 'dashboard' || activeTab === 'rooms') && (
            isLoading ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--muted-foreground)' }}>Memuat data dari Supabase...</div>
            ) : (
              <ManajemenKamar 
                rooms={rooms} 
                filteredRooms={filteredRooms}
                toggleStatus={toggleStatus}
                handleEditRoom={handleEditRoom}
                handleDeleteRoom={handleDeleteRoom}
                handleAddRoom={handleAddRoom}
              />
            )
          )}

          {activeTab === 'occupants' && <DataPenghuniTab />}
          {activeTab === 'finance' && <LaporanKeuanganTab />}
          {activeTab === 'settings' && <div style={{ padding: '3rem', textAlign: 'center', background: 'var(--card)', borderRadius: '16px' }}>Pengaturan Segera Hadir</div>}
          {activeTab === 'super_admin' && <SuperAdminTab />}

        </motion.div>
      </main>
    </div>
  );
}

