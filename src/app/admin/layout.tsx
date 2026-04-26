'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/login');
        return;
      }

      // Check if user is in admin_profiles and approved
      const { data: profile } = await supabase
        .from('admin_profiles')
        .select('is_approved')
        .eq('id', session.user.id)
        .single();

      if (!profile || !profile.is_approved) {
        await supabase.auth.signOut();
        router.push('/login');
        return;
      }

      setIsAuthorized(true);
    };

    checkAuth();
  }, [router]);

  if (!isAuthorized) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        Memverifikasi akses admin...
      </div>
    );
  }

  return <>{children}</>;
}
