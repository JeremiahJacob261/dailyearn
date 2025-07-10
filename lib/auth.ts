import { supabase } from './supabase'
import bcrypt from 'bcryptjs'

export interface SignUpData {
  fullName: string
  email: string
  password: string
  referralId?: string
}

export interface SignInData {
  email: string
  password: string
}

export const authService = {
  async signUp(data: SignUpData) {
    try {
      // Check if user already exists
      const { data: existingUser } = await supabase
        .from('dailyearn_users')
        .select('id')
        .eq('email', data.email)
        .single()

      if (existingUser) {
        throw new Error('User already exists')
      }

      // Hash password
      const passwordHash = await bcrypt.hash(data.password, 10)

      // Generate referral code
      const referralCode = 'REF' + Math.floor(Math.random() * 999999).toString().padStart(6, '0')

      // Insert user
      const { data: newUser, error } = await supabase
        .from('dailyearn_users')
        .insert({
          email: data.email,
          password_hash: passwordHash,
          full_name: data.fullName,
          referral_id: data.referralId || null,
          referral_code: referralCode,
        })
        .select()
        .single()

      if (error) throw error

      // If user has a referral code, process the referral
      if (data.referralId) {
        await this.processReferral(data.referralId, newUser.id)
      }

      // Generate verification code
      const verificationCode = Math.floor(10000 + Math.random() * 90000).toString()
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

      await supabase
        .from('dailyearn_verification_codes')
        .insert({
          user_id: newUser.id,
          code: verificationCode,
          expires_at: expiresAt.toISOString(),
        })

      return { user: newUser, verificationCode }
    } catch (error) {
      throw error
    }
  },

  async signIn(data: SignInData) {
    try {
      const { data: user, error } = await supabase
        .from('dailyearn_users')
        .select('*')
        .eq('email', data.email)
        .single()

      if (error || !user) {
        throw new Error('Invalid email or password')
      }

      const isValidPassword = await bcrypt.compare(data.password, user.password_hash)
      
      if (!isValidPassword) {
        throw new Error('Invalid email or password')
      }

      // Store user session
      localStorage.setItem('user', JSON.stringify({
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        referralCode: user.referral_code,
        balance: user.balance,
      }))

      return user
    } catch (error) {
      throw error
    }
  },

  async verifyEmail(code: string) {
    try {
      const { data: verificationData, error } = await supabase
        .from('dailyearn_verification_codes')
        .select('*')
        .eq('code', code)
        .eq('used', false)
        .single()

      if (error || !verificationData) {
        throw new Error('Invalid verification code')
      }

      // Check if code is expired
      if (new Date() > new Date(verificationData.expires_at)) {
        throw new Error('Verification code has expired')
      }

      // Mark code as used
      await supabase
        .from('dailyearn_verification_codes')
        .update({ used: true })
        .eq('id', verificationData.id)

      // Mark user as verified
      await supabase
        .from('dailyearn_users')
        .update({ email_verified: true })
        .eq('id', verificationData.user_id)

      return true
    } catch (error) {
      throw error
    }
  },

  async validateReferralCode(referralCode: string) {
    try {
      const { data: referrer, error } = await supabase
        .from('dailyearn_users')
        .select('id, full_name')
        .eq('referral_code', referralCode)
        .single()

      if (error || !referrer) {
        throw new Error('Invalid referral code')
      }

      return referrer
    } catch (error) {
      throw error
    }
  },

  async processReferral(referralCode: string, referredUserId: string) {
    try {
      // Get referrer details
      const { data: referrer, error: referrerError } = await supabase
        .from('dailyearn_users')
        .select('id')
        .eq('referral_code', referralCode)
        .single()

      if (referrerError || !referrer) {
        throw new Error('Invalid referral code')
      }

      // Create referral record
      const { error: referralError } = await supabase
        .from('dailyearn_referrals')
        .insert({
          referrer_id: referrer.id,
          referred_id: referredUserId,
          reward_amount: 10.00 // 10 naira reward
        })

      if (referralError) throw referralError

      // Update referrer's balance - add 10 naira
      const { error: balanceError } = await supabase
        .rpc('increment_balance', {
          user_id: referrer.id,
          amount: 10.00
        })

      if (balanceError) throw balanceError

      return true
    } catch (error) {
      throw error
    }
  }
}