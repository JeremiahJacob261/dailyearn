-- Create users table
CREATE TABLE dailyearn_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  referral_id VARCHAR(50),
  referral_code VARCHAR(50) UNIQUE NOT NULL DEFAULT 'REF' || LPAD(FLOOR(RANDOM() * 999999)::TEXT, 6, '0'),
  balance DECIMAL(10, 2) DEFAULT 0.00,
  email_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create referrals table
CREATE TABLE dailyearn_referrals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  referrer_id UUID REFERENCES dailyearn_users(id) ON DELETE CASCADE,
  referred_id UUID REFERENCES dailyearn_users(id) ON DELETE CASCADE,
  reward_amount DECIMAL(10, 2) DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create verification_codes table
CREATE TABLE dailyearn_verification_codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES dailyearn_users(id) ON DELETE CASCADE,
  code VARCHAR(6) NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_dailyearn_users_email ON dailyearn_users(email);
CREATE INDEX idx_dailyearn_users_referral_code ON dailyearn_users(referral_code);
CREATE INDEX idx_dailyearn_verification_codes_user_id ON dailyearn_verification_codes(user_id);
CREATE INDEX idx_dailyearn_verification_codes_code ON dailyearn_verification_codes(code);


-- Add this function to your schema
CREATE OR REPLACE FUNCTION increment_balance(user_id UUID, amount DECIMAL)
RETURNS void AS $$
BEGIN
  UPDATE dailyearn_users 
  SET balance = balance + amount,
      updated_at = NOW()
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql;


CREATE TABLE dailyearn_payouts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES dailyearn_users(id) ON DELETE CASCADE,
  full_name VARCHAR(255) NOT NULL,
  account_name VARCHAR(255) NOT NULL,
  account_number VARCHAR(20) NOT NULL,
  bank VARCHAR(100) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tasks table
drop table if exists dailyearn_tasks cascade;
CREATE TABLE dailyearn_tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  reward DECIMAL(10, 2) NOT NULL,
  duration VARCHAR(50),
  category VARCHAR(100),
  link VARCHAR(500),
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create transactions table
drop table if exists dailyearn_transactions cascade;
CREATE TABLE dailyearn_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES dailyearn_users(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL CHECK (type IN ('referral', 'task', 'payout')),
  amount DECIMAL(10, 2) NOT NULL,
  description TEXT,
  task_id UUID REFERENCES dailyearn_tasks(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);