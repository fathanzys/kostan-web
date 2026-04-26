'use client';

import { useState } from 'react';
import { MessageSquare, X, Send, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Chatbot.module.css';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        className={styles.chatbotFab} 
        onClick={() => setIsOpen(true)}
        style={{ display: isOpen ? 'none' : 'flex' }}
      >
        <MessageSquare size={24} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className={styles.chatWindow}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <div className={styles.chatHeader}>
              <div>
                <h4>Asisten AI Kost H Kodir</h4>
                <span className={styles.status}>Online</span>
              </div>
              <button className={styles.closeBtn} onClick={() => setIsOpen(false)}>
                <X size={20} />
              </button>
            </div>
            
            <div className={styles.chatBody}>
              <div className={styles.overlay}>
                <AlertCircle size={32} className={styles.alertIcon} />
                <p>Fitur AI Chatbot ini masih dalam tahap pengembangan.</p>
                <p style={{ fontSize: '0.8rem', marginTop: '0.5rem', opacity: 0.8 }}>Segera Hadir!</p>
              </div>
              
              <div className={styles.messageRow + ' ' + styles.botMessage}>
                <div className={styles.avatar}>AI</div>
                <div className={styles.bubble}>
                  Halo! Saya adalah asisten AI Kost H Kodir. Ada yang bisa saya bantu terkait ketersediaan kamar, harga, atau fasilitas?
                </div>
              </div>
            </div>

            <div className={styles.chatFooter}>
              <input type="text" placeholder="Ketik pesan..." disabled />
              <button disabled><Send size={18} /></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
