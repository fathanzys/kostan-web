'use client';

import { useState, useEffect, use } from 'react';
import { ArrowLeft, Check, Phone, Star, MapPin, Share2 } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './room-detail.module.css';
import { supabase, Room } from '@/lib/supabase';
import Chatbot from '@/components/Chatbot';

export default function RoomDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const roomId = resolvedParams.id;

  const [room, setRoom] = useState<Room | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const fetchRoom = async () => {
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .eq('id', roomId)
        .single();
      
      if (!error && data) {
        setRoom(data);
      }
      setIsLoading(false);
    };
    fetchRoom();
  }, [roomId]);

  if (isLoading) {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Memuat data kamar...</div>;
  }

  if (!room) {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Kamar tidak ditemukan.</div>;
  }

  return (
    <main className={styles.container}>
      <motion.nav 
        className={styles.nav}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Link href="/" className={styles.backBtn}>
          <ArrowLeft size={20} /> Kembali Ke Beranda
        </Link>
        <button className={styles.shareBtn}><Share2 size={18} /></button>
      </motion.nav>

      <div className={styles.grid}>
        {/* Images Gallery */}
        <motion.section 
          className={styles.gallery}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className={styles.mainImage}>
            <AnimatePresence mode='wait'>
              <motion.img 
                key={activeImage}
                src={room.image} 
                alt={room.name}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              />
            </AnimatePresence>
          </div>
          <div className={styles.thumbGrid}>
            <motion.div 
              className={`${styles.thumbWrapper} ${styles.activeThumb}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <img src={room.image} alt={`${room.name}`} />
            </motion.div>
          </div>
        </motion.section>

        {/* Info Content */}
        <motion.section 
          className={styles.info}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className={styles.header}>
            <div className={styles.statusBadge}>{room.status === 'Available' ? 'Tersedia Sekarang' : 'Kamar Terisi'}</div>
            <h1 className="heading-lg">{room.name}</h1>
            <div className={styles.meta}>
              <div className={styles.rating}><Star size={16} fill="currentColor" /> 4.9 (12 Review)</div>
              <div className={styles.location}><MapPin size={16} /> Lantai 1</div>
            </div>
          </div>

          <motion.div 
            className={styles.priceSection}
            whileHover={{ scale: 1.02 }}
          >
            <div className={styles.price}>
              Rp {room.price.toLocaleString('id-ID')}<span>/bulan</span>
            </div>
            <p className={styles.inclusive}>*Sudah termasuk air dan iuran lingkungan</p>
          </motion.div>

          <div className={styles.description}>
            <h3>Deskripsi Kamar</h3>
            <p>Nikmati kenyamanan maksimal di kamar ini. Kamar ini dirancang untuk Anda yang menginginkan privasi dan fasilitas lengkap dalam satu ruangan. Dengan sirkulasi udara yang baik dan pencahayaan alami, kamar ini sangat cocok untuk produktivitas Anda.</p>
          </div>

          <div className={styles.facilities}>
            <h3>Fasilitas Unggulan</h3>
            <div className={styles.facilityGrid}>
              {room.facilities?.map((f, idx) => (
                <motion.div 
                  key={f} 
                  className={styles.facilityItem}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + (idx * 0.05) }}
                >
                  <Check size={18} className={styles.checkIcon} /> {f}
                </motion.div>
              ))}
            </div>
          </div>

          <div className={styles.cta}>
            <a 
              href={`https://wa.me/6281211101540?text=Halo, saya tertarik dengan ${room.name}. Apakah masih tersedia untuk bulan depan?`} 
              className="btn btn-primary"
              target="_blank" rel="noopener noreferrer"
              style={{ width: '100%', padding: '1.25rem', fontSize: '1.1rem' }}
            >
              <Phone size={20} /> Hubungi Pemilik Sekarang
            </a>
            <p className={styles.disclaimer}>Tanpa komisi agen & proses survey dibantu pemilik.</p>
          </div>
        </motion.section>
      </div>
      <Chatbot />
    </main>
  );
}
