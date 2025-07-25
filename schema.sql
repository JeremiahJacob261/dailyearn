-- Create users table
CREATE TABLE dailyearn_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  referral_id VARCHAR(50),
  referral_code VARCHAR(50) UNIQUE NOT NULL DEFAULT 'REF' || LPAD(FLOOR(RANDOM() * 999999)::TEXT, 6, '0'),
  balance DECIMAL(10, 2) DEFAULT 0.00,
  email_verified BOOLEAN DEFAULT true,
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

-- Create password_reset_tokens table
CREATE TABLE dailyearn_password_reset_tokens (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES dailyearn_users(id) ON DELETE CASCADE,
  token VARCHAR(255) NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_dailyearn_users_email ON dailyearn_users(email);
CREATE INDEX idx_dailyearn_users_referral_code ON dailyearn_users(referral_code);
CREATE INDEX idx_dailyearn_verification_codes_user_id ON dailyearn_verification_codes(user_id);
CREATE INDEX idx_dailyearn_verification_codes_code ON dailyearn_verification_codes(code);
CREATE INDEX idx_dailyearn_password_reset_tokens_user_id ON dailyearn_password_reset_tokens(user_id);
CREATE INDEX idx_dailyearn_password_reset_tokens_token ON dailyearn_password_reset_tokens(token);

-- Create settings table for admin configurations
CREATE TABLE dailyearn_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key VARCHAR(100) UNIQUE NOT NULL,
  setting_value TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default settings
INSERT INTO dailyearn_settings (setting_key, setting_value, description) VALUES
('task_reward_delay_seconds', '10', 'Number of seconds users must wait before receiving task rewards'),
('task_cooldown_seconds', '20', 'Number of seconds users must wait before attempting the same task again'),
('minimum_withdrawal_amount', '5000', 'Minimum amount users can withdraw in naira'),
('referral_reward_amount', '50', 'Amount in naira to reward users for successful referrals');

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

-- Added settings table
CREATE TABLE dailyearn_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key VARCHAR(100) UNIQUE NOT NULL,
  setting_value TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create contact messages table
CREATE TABLE dailyearn_contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(500) NOT NULL,
  message TEXT NOT NULL,
  user_id UUID REFERENCES dailyearn_users(id) ON DELETE SET NULL,
  status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'read', 'responded', 'resolved')),
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for contact messages
CREATE INDEX idx_dailyearn_contact_messages_email ON dailyearn_contact_messages(email);
CREATE INDEX idx_dailyearn_contact_messages_status ON dailyearn_contact_messages(status);
CREATE INDEX idx_dailyearn_contact_messages_user_id ON dailyearn_contact_messages(user_id);
CREATE INDEX idx_dailyearn_contact_messages_created_at ON dailyearn_contact_messages(created_at);
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'new',
  admin_response TEXT,
  user_id UUID REFERENCES dailyearn_users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for contact messages
CREATE INDEX idx_dailyearn_contact_messages_status ON dailyearn_contact_messages(status);
CREATE INDEX idx_dailyearn_contact_messages_email ON dailyearn_contact_messages(email);
CREATE INDEX idx_dailyearn_contact_messages_created_at ON dailyearn_contact_messages(created_at);

-- Default settings
INSERT INTO dailyearn_settings (setting_key, setting_value, description) VALUES
('task_reward_delay_seconds', '10', 'Number of seconds users must wait before receiving task rewards'),
('task_cooldown_seconds', '20', 'Number of seconds users must wait before attempting the same task again');