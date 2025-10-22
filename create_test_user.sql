-- 建立測試使用者
-- Email: test@example.com
-- Password: test123456

-- 插入到 auth.users
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  aud,
  role
) VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'test@example.com',
  crypt('test123456', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  'authenticated',
  'authenticated'
) ON CONFLICT (email) DO NOTHING;

-- 驗證使用者已建立
SELECT id, email, created_at FROM auth.users WHERE email = 'test@example.com';

