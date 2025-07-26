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

export interface AdminSignInData {
  username: string
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

      // Send welcome and verification emails
      // Check if we're on client or server side
      if (typeof window !== 'undefined') {
        // Client side - use API routes
        const { clientEmailService } = await import('./client-email')
        
        // Send verification email
        // await clientEmailService.sendVerificationEmail(
        //   newUser.email,
        //   newUser.full_name,
        //   verificationCode
        // )
        
        // Send welcome email
        await clientEmailService.sendWelcomeEmail(
          newUser.email,
          newUser.full_name
        )
      } else {
        // Server side - use direct email service
        const { emailService } = await import('./email')
        
        // Send verification email
        // await emailService.sendVerificationEmail(
        //   newUser.email,
        //   newUser.full_name,
        //   verificationCode
        // )
        
        // Send welcome email
        await emailService.sendWelcomeEmail(
          newUser.email,
          newUser.full_name
        )
      }

      // Store user session (same as sign in)
      localStorage.setItem('user', JSON.stringify({
        id: newUser.id,
        email: newUser.email,
        fullName: newUser.full_name,
        referralCode: newUser.referral_code,
        balance: newUser.balance,
      }))

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

  async verifyUserPassword(userId: string, password: string) {
    try {
      const { data: user, error } = await supabase
        .from('dailyearn_users')
        .select('password_hash')
        .eq('id', userId)
        .single()

      if (error || !user) {
        throw new Error('User not found')
      }

      const isValidPassword = await bcrypt.compare(password, user.password_hash)
      
      if (!isValidPassword) {
        throw new Error('Invalid password')
      }

      return true
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

      // Get the current referral reward amount from settings
      const { databaseService } = await import('./database')
      const rewardAmount = await databaseService.getReferralRewardAmount()

      // Create referral record
      const { error: referralError } = await supabase
        .from('dailyearn_referrals')
        .insert({
          referrer_id: referrer.id,
          referred_id: referredUserId,
          reward_amount: rewardAmount
        })

      if (referralError) throw referralError

      // Update referrer's balance - add reward amount
      const { error: balanceError } = await supabase
        .rpc('increment_balance', {
          user_id: referrer.id,
          amount: rewardAmount
        })

      if (balanceError) throw balanceError

      // Create a transaction record for the referral reward
      const { error: transactionError } = await supabase
        .from('dailyearn_transactions')
        .insert({
          user_id: referrer.id,
          type: 'referral',
          amount: rewardAmount,
          description: `Referral bonus for inviting a new user (₦${rewardAmount})`
        })

      if (transactionError) throw transactionError

      return true
    } catch (error) {
      throw error
    }
  },

  async requestPasswordReset(email: string) {
    try {
      // Check if user exists
      const { data: user, error: userError } = await supabase
        .from('dailyearn_users')
        .select('id, full_name, email')
        .eq('email', email)
        .single()

      if (userError || !user) {
        throw new Error('No account found with this email address')
      }

      // Generate reset token
      const resetToken = Math.random().toString(36).substring(2, 15) + 
                        Math.random().toString(36).substring(2, 15) +
                        Date.now().toString(36)

      // Set expiration time (1 hour from now)
      const expiresAt = new Date()
      expiresAt.setHours(expiresAt.getHours() + 1)

      // Store reset token in database
      const { error: tokenError } = await supabase
        .from('dailyearn_password_reset_tokens')
        .insert({
          user_id: user.id,
          token: resetToken,
          expires_at: expiresAt.toISOString()
        })

      if (tokenError) throw tokenError

      // Send password reset email
      let emailSent = false
      
      // Check if we're on client or server side
      if (typeof window !== 'undefined') {
        // Client side - use API routes
        const { clientEmailService } = await import('./client-email')
        emailSent = await clientEmailService.sendPasswordResetEmail(
          user.email,
          user.full_name,
          resetToken
        )
      } else {
        // Server side - use direct email service
        const { emailService } = await import('./email')
        emailSent = await emailService.sendPasswordResetEmail(
          user.email,
          user.full_name,
          resetToken
        )
      }

      if (!emailSent) {
        throw new Error('Failed to send password reset email')
      }

      return true
    } catch (error) {
      throw error
    }
  },

  async resetPassword(token: string, newPassword: string) {
    try {
      // Verify token and get user info
      const { data: tokenData, error: tokenError } = await supabase
        .from('dailyearn_password_reset_tokens')
        .select(`
          id,
          user_id,
          expires_at,
          used,
          dailyearn_users (
            id,
            email,
            full_name
          )
        `)
        .eq('token', token)
        .eq('used', false)
        .single()

      if (tokenError || !tokenData) {
        throw new Error('Invalid or expired reset token')
      }

      // Check if token has expired
      if (new Date(tokenData.expires_at) < new Date()) {
        throw new Error('Reset token has expired')
      }

      // Hash new password
      const passwordHash = await bcrypt.hash(newPassword, 12)

      // Update user password
      const { error: updateError } = await supabase
        .from('dailyearn_users')
        .update({ 
          password_hash: passwordHash,
          updated_at: new Date().toISOString()
        })
        .eq('id', tokenData.user_id)

      if (updateError) throw updateError

      // Mark token as used
      const { error: markUsedError } = await supabase
        .from('dailyearn_password_reset_tokens')
        .update({ used: true })
        .eq('id', tokenData.id)

      if (markUsedError) throw markUsedError

      return true
    } catch (error) {
      throw error
    }
  },

  async validateResetToken(token: string) {
    try {
      const { data: tokenData, error } = await supabase
        .from('dailyearn_password_reset_tokens')
        .select('id, expires_at, used')
        .eq('token', token)
        .eq('used', false)
        .single()

      if (error || !tokenData) {
        return { valid: false, message: 'Invalid reset token' }
      }

      if (new Date(tokenData.expires_at) < new Date()) {
        return { valid: false, message: 'Reset token has expired' }
      }

      return { valid: true, message: 'Token is valid' }
    } catch (error) {
      return { valid: false, message: 'Error validating token' }
    }
  },

  async updatePassword(userId: string, currentPassword: string, newPassword: string) {
    try {
      // First verify the current password
      await this.verifyUserPassword(userId, currentPassword)

      // Hash the new password
      const newPasswordHash = await bcrypt.hash(newPassword, 10)

      // Update the password in the database
      const { error } = await supabase
        .from('dailyearn_users')
        .update({ password_hash: newPasswordHash })
        .eq('id', userId)

      if (error) {
        throw new Error('Failed to update password')
      }

      return true
    } catch (error) {
      throw error
    }
  }
}

export const adminAuthService = {
  async signIn(data: AdminSignInData) {
    try {
      // Fetch admin record from Supabase
      const { data: admin, error } = await supabase
        .from('dailyearn_admins')
        .select('*')
        .eq('username', data.username)
        .single()
      if (error || !admin) {
        throw new Error('Invalid username or password')
      }
      // Verify password
      const isValidPassword = await bcrypt.compare(data.password, admin.password_hash)
      if (!isValidPassword) {
        throw new Error('Invalid username or password')
      }
      // Store admin session
      if (typeof window !== 'undefined') {
        localStorage.setItem('adminSession', JSON.stringify({
          username: data.username,
          role: 'admin',
          loginTime: new Date().toISOString()
        }))
      }
      return { success: true, admin: { username: data.username, role: 'admin' } }
    } catch (error) {
      throw error
    }
  },

  async signOut() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('adminSession')
    }
    return { success: true }
  },

  isAuthenticated() {
    if (typeof window === 'undefined') return false
    const session = localStorage.getItem('adminSession')
    if (!session) return false
    try {
      const adminData = JSON.parse(session)
      return !!adminData.username
    } catch {
      return false
    }
  },
  getSession() {
    if (typeof window === 'undefined') return null
    const session = localStorage.getItem('adminSession')
    if (!session) return null
    try {
      return JSON.parse(session)
    } catch {
      return null
    }
  }
}