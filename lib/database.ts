import { supabase } from './supabase'

export interface UserData {
  id: string
  email: string
  full_name: string
  referral_code: string
  balance: number
  email_verified: boolean
}

export interface ReferralData {
  id: string
  referrer_id: string
  referred_id: string
  reward_amount: number
  created_at: string
  referred_user: {
    full_name: string
    email: string
  }
}

export interface TransactionData {
  id: string
  user_id: string
  type: 'referral' | 'task' | 'payout'
  amount: number
  description: string
  created_at: string
}

export const databaseService = {
  async getUserData(userId: string): Promise<UserData | null> {
    try {
      const { data, error } = await supabase
        .from('dailyearn_users')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching user data:', error)
      return null
    }
  },

  async getUserReferrals(userId: string): Promise<ReferralData[]> {
    try {
      const { data, error } = await supabase
        .from('dailyearn_referrals')
        .select(`
          *,
          referred_user:dailyearn_users!referred_id (
            full_name,
            email
          )
        `)
        .eq('referrer_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching referrals:', error)
      return []
    }
  },

  async getReferralStats(userId: string) {
    try {
      const { data, error } = await supabase
        .from('dailyearn_referrals')
        .select('reward_amount')
        .eq('referrer_id', userId)

      if (error) throw error

      const totalReferrals = data?.length || 0
      const totalEarnings = data?.reduce((sum, ref) => sum + parseFloat(ref.reward_amount.toString()), 0) || 0

      return {
        totalReferrals,
        totalEarnings
      }
    } catch (error) {
      console.error('Error fetching referral stats:', error)
      return { totalReferrals: 0, totalEarnings: 0 }
    }
  },

  async getTopReferrers(limit: number = 10) {
    try {
      const { data, error } = await supabase
        .from('dailyearn_referrals')
        .select(`
          referrer_id,
          referrer:dailyearn_users!referrer_id (
            full_name,
            email
          )
        `)
        .limit(limit)

      if (error) throw error

      // Group by referrer and count
      const referrerCounts = data?.reduce((acc, ref) => {
        const referrerId = ref.referrer_id
        if (!acc[referrerId]) {
          acc[referrerId] = {
            referrer: ref.referrer,
            count: 0,
            earnings: 0
          }
        }
        acc[referrerId].count += 1
        acc[referrerId].earnings += 10 // 10 naira per referral
        return acc
      }, {} as any) || {}

      // Convert to array and sort
      const topReferrers = Object.values(referrerCounts)
        .sort((a: any, b: any) => b.count - a.count)
        .slice(0, limit)

      return topReferrers
    } catch (error) {
      console.error('Error fetching top referrers:', error)
      return []
    }
  }
}