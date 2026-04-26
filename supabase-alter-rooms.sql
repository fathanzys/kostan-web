-- Jalankan ini di SQL Editor Supabase untuk nambahin kolom deskripsi
ALTER TABLE rooms 
ADD COLUMN IF NOT EXISTS description TEXT DEFAULT 'Nikmati kenyamanan maksimal di kamar ini. Kamar ini dirancang untuk Anda yang menginginkan privasi dan fasilitas lengkap dalam satu ruangan. Dengan sirkulasi udara yang baik dan pencahayaan alami, kamar ini sangat cocok untuk produktivitas Anda.';
