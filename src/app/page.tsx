'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Home, Zap, Shield, MapPin, Phone, ArrowRight, Star, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './page.module.css';
import { supabase, Room } from '@/lib/supabase';

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .order('id', { ascending: true });
      if (!error && data) {
        setRooms(data);
      }
      setIsLoading(false);
    };
    fetchRooms();
  }, []);

  return (
    <main className={styles.main}>
      {/* Navigation */}
      <nav className={`${styles.nav} glass`}>
        <div className="container">
          <div className={styles.navInner}>
            <div className={styles.logo}>
              <Home className={styles.logoIcon} />
              <span>Kostan<span>Premium</span></span>
            </div>

            {/* Desktop Links */}
            <div className={styles.navLinks}>
              <a href="#rooms">Kamar</a>
              <a href="#facilities">Fasilitas</a>
              <Link href="/admin" className="btn btn-outline">Admin</Link>
            </div>

            {/* Mobile Toggle */}
            <button className={styles.menuToggle} onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className={styles.mobileMenu}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className={styles.mobileLinks}>
                <a href="#rooms" onClick={() => setIsMenuOpen(false)}>Kamar</a>
                <a href="#facilities" onClick={() => setIsMenuOpen(false)}>Fasilitas</a>
                <Link href="/admin" className="btn btn-primary">Panel Admin</Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroBg}>
          <div className={styles.blob1}></div>
          <div className={styles.blob2}></div>
        </div>
        <div className="container">
          <div className={styles.heroGrid}>
            <motion.div
              className={styles.heroContent}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.div
                className={styles.badge}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Tersedia 2 Kamar Kosong
              </motion.div>
              <h1 className="heading-xl">
                Hunian Modern <br />
                <span className="text-primary">Untuk Kenyamanan Anda</span>
              </h1>
              <p className="text-muted">
                Kostan eksklusif dengan fasilitas lengkap, keamanan 24 jam,
                dan lokasi yang strategis di pusat kota. Cocok untuk mahasiswa dan pekerja.
              </p>
              <div className={styles.heroBtns}>
                <a href="#rooms" className="btn btn-primary">
                  Lihat Kamar <ArrowRight size={18} />
                </a>
                <a href="https://wa.me/628123456789" className="btn btn-outline">
                  <Phone size={18} /> Hubungi Kami
                </a>
              </div>
            </motion.div>

            <motion.div
              className={styles.heroImageContainer}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              <div className={styles.mainHeroImage}>
                <img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200" alt="Hero" />
                <div className={styles.floatingCard}>
                  <div className={styles.fcIcon}><Star fill="white" /></div>
                  <div>
                    <h4>Rating 4.9</h4>
                    <p>Dari 50+ Penghuni</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="facilities" className={`${styles.features} section`}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className="heading-lg">Fasilitas Utama</h2>
            <p className="text-muted">Semua yang Anda butuhkan untuk tinggal dengan nyaman.</p>
          </div>
          <div className={styles.featureGrid}>
            {[
              { icon: Zap, title: "Listrik & Wifi", desc: "Sudah termasuk listrik dan koneksi Wifi kencang 24 jam." },
              { icon: Shield, title: "Keamanan CCTV & Ronda Malam", desc: "Area diawasi CCTV penuh dan dijaga rutin oleh petugas ronda malam." },
              { icon: MapPin, title: "Lokasi Strategis", desc: "Sangat dekat dengan Indomaret, JakLingko, serta akses mudah ke pasar dan stasiun." },
              { icon: Home, title: "Parkir Motor", desc: "Tersedia area parkir motor yang luas dan aman di dalam pagar." }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                className={styles.featureCard}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <feature.icon className={styles.featureIcon} />
                <h3>{feature.title}</h3>
                <p className="text-muted">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Room Listing */}
      <section id="rooms" className={`${styles.rooms} section`}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className="heading-lg">Katalog Kamar</h2>
            <p className="text-muted">Pilih tipe kamar yang sesuai dengan kebutuhan Anda.</p>
          </div>
          <div className={styles.roomGrid}>
            {isLoading ? (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--muted-foreground)' }}>Memuat data kamar...</div>
            ) : rooms.length === 0 ? (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--muted-foreground)' }}>Belum ada kamar yang tersedia.</div>
            ) : (
              rooms.map((room, idx) => (
                <motion.div
                  key={room.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Link href={`/rooms/${room.id}`} className={styles.roomCard}>
                    <div className={styles.roomImage}>
                      <img src={room.image} alt={room.name} />
                      <div className={`${styles.statusBadge} ${room.status === 'Available' ? styles.available : styles.occupied}`}>
                        {room.status === 'Available' ? 'Tersedia' : 'Terisi'}
                      </div>
                    </div>
                    <div className={styles.roomInfo}>
                      <div className={styles.roomHeader}>
                        <h3>{room.name}</h3>
                        <div className={styles.rating}><Star size={14} fill="currentColor" /> 4.9</div>
                      </div>
                      <div className={styles.price}>Rp {room.price.toLocaleString()}<span>/bulan</span></div>
                      <div className={styles.facilities}>
                        {room.facilities?.map(f => <span key={f}>{f}</span>)}
                      </div>
                      <div className={`btn btn-primary ${room.status !== 'Available' ? styles.btnDisabled : ''}`} style={{ width: '100%', marginTop: '1rem' }}>
                        {room.status === 'Available' ? 'Detail Kamar' : 'Sudah Terisi'}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Maps Section */}
      <section className={`${styles.features} section`} style={{ background: 'var(--card)' }}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className="heading-lg">Lokasi Kami</h2>
            <p className="text-muted">Akses mudah kemana saja, cek lokasi kami di Google Maps.</p>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ width: '100%', height: '400px', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border)' }}
          >
            <iframe
              src="https://maps.google.com/maps?q=-6.2247246,106.7779718&t=&z=18&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className="container">
          <div className={styles.footerInner}>
            <p>&copy; 2024 Kostan Premium. All rights reserved.</p>
            <div className={styles.footerLinks}>
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
