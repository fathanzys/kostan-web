-- Buka SQL Editor di Supabase Dashboard kamu dan jalankan query ini:

-- 1. Buat tabel admin_profiles untuk menyimpan role dan status approval
CREATE TABLE admin_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('super_admin', 'admin')),
  is_approved BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- 2. Bikin trigger biar setiap ada user baru yang daftar di Supabase Auth,
-- otomatis masuk ke tabel admin_profiles dengan status pending (is_approved = false)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.admin_profiles (id, email, role, is_approved)
  -- Kalau ini user pertama di database, jadikan super_admin dan otomatis approved
  -- Kalau bukan user pertama, jadikan admin biasa dan belum di-approve
  VALUES (
    NEW.id, 
    NEW.email, 
    CASE WHEN (SELECT COUNT(*) FROM public.admin_profiles) = 0 THEN 'super_admin' ELSE 'admin' END,
    CASE WHEN (SELECT COUNT(*) FROM public.admin_profiles) = 0 THEN true ELSE false END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 3. Setup Row Level Security (RLS) untuk tabel admin_profiles
ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;

-- Semua admin yang udah login bisa lihat profile
CREATE POLICY "Admins can view profiles" 
  ON admin_profiles FOR SELECT 
  USING (auth.uid() IS NOT NULL);

-- HANYA super_admin yang bisa update status is_approved
CREATE POLICY "Super admins can update profiles" 
  ON admin_profiles FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM admin_profiles WHERE id = auth.uid() AND role = 'super_admin'
    )
  );
