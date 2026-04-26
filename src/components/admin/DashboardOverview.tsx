import { BedDouble, Users, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import styles from '@/app/admin/admin.module.css';

interface DashboardOverviewProps {
  rooms: any[];
}

export default function DashboardOverview({ rooms }: DashboardOverviewProps) {
  return (
    <div className={styles.statsGrid}>
      {[
        { label: "Total Kamar", value: rooms.length.toString(), icon: BedDouble, color: "#10b981" },
        { label: "Okupansi", value: `${Math.round((rooms.filter(r => r.status === 'Occupied').length / rooms.length) * 100)}%`, icon: Users, color: "#3b82f6" },
        { label: "Estimasi Pendapatan", value: `Rp ${(rooms.filter(r => r.status === 'Occupied').reduce((acc, r) => acc + r.price, 0) / 1000000).toFixed(1)}M`, icon: TrendingUp, color: "#f59e0b" }
      ].map((stat, i) => (
        <motion.div 
          key={i}
          className={styles.statCard}
          whileHover={{ y: -5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className={styles.statIcon} style={{ background: `${stat.color}15`, color: stat.color }}>
            <stat.icon size={24} />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>{stat.label}</span>
            <span className={styles.statValue}>{stat.value}</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
