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

export interface TaskData {
  id: string;
  title: string;
  description: string;
  reward: number;
  duration: string;
  link: string;
  created_at: string;
  updated_at: string;
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
  },

  async createPayoutRequest({ userId, fullName, accountName, accountNumber, bank, amount }: {
    userId: string,
    fullName: string,
    accountName: string,
    accountNumber: string,
    bank: string,
    amount: number
  }) {
    try {
      // Insert payout request
      const { data, error } = await supabase
        .from('dailyearn_payouts')
        .insert({
          user_id: userId,
          full_name: fullName,
          account_name: accountName,
          account_number: accountNumber,
          bank,
          amount,
          status: 'pending',
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating payout request:', error);
      throw error;
    }
  },

  async getUserPayouts(userId: string) {
    try {
      const { data, error } = await supabase
        .from('dailyearn_payouts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching user payouts:', error);
      return [];
    }
  },

  async deductUserBalance(userId: string, amount: number) {
    try {
      // Use negative value to decrement
      const { error } = await supabase.rpc('increment_balance', {
        user_id: userId,
        amount: -Math.abs(amount),
      });
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deducting user balance:', error);
      throw error;
    }
  },

  async incrementUserBalance(userId: string, amount: number) {
    try {
      const { error } = await supabase.rpc('increment_balance', {
        user_id: userId,
        amount: Math.abs(amount),
      });
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error incrementing user balance:', error);
      throw error;
    }
  },

  async getAllTasks(): Promise<TaskData[]> {
    try {
      const { data, error } = await supabase
        .from('dailyearn_tasks')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching tasks:', error);
      return [];
    }
  },

  async getTaskById(taskId: string): Promise<TaskData | null> {
    try {
      const { data, error } = await supabase
        .from('dailyearn_tasks')
        .select('*')
        .eq('id', taskId)
        .single();
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching task:', error);
      return null;
    }
  },

  async getAllUsers(): Promise<UserData[]> {
    try {
      const { data, error } = await supabase
        .from('dailyearn_users')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  },

  async createTask(taskData: {
    title: string;
    description: string;
    reward: number;
    category: string;
    link?: string;
    status: string;
  }) {
    try {
      const { data, error } = await supabase
        .from('dailyearn_tasks')
        .insert({
          title: taskData.title,
          description: taskData.description,
          reward: taskData.reward,
          category: taskData.category,
          link: taskData.link,
          status: taskData.status,
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  },

  async updateTask(taskId: string, taskData: {
    title: string;
    description: string;
    reward: number;
    category: string;
    link?: string;
    status: string;
  }) {
    try {
      const { data, error } = await supabase
        .from('dailyearn_tasks')
        .update({
          title: taskData.title,
          description: taskData.description,
          reward: taskData.reward,
          category: taskData.category,
          link: taskData.link,
          status: taskData.status,
          updated_at: new Date().toISOString(),
        })
        .eq('id', taskId)
        .select()
        .single();
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  },

  async deleteTask(taskId: string) {
    try {
      const { error } = await supabase
        .from('dailyearn_tasks')
        .delete()
        .eq('id', taskId);
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  },

  async completeTask(userId: string, taskId: string, reward: number) {
    try {
      // Check if user has already completed this task
      const { data: existingCompletion } = await supabase
        .from('dailyearn_transactions')
        .select('id')
        .eq('user_id', userId)
        .eq('task_id', taskId)
        .eq('type', 'task')
        .single();

      if (existingCompletion) {
        throw new Error('Task already completed');
      }

      // First, increment the user's balance with the task reward
      await this.incrementUserBalance(userId, reward);

      // Create a transaction record
      const { error: transactionError } = await supabase
        .from('dailyearn_transactions')
        .insert({
          user_id: userId,
          type: 'task',
          amount: reward,
          description: `Task completion reward`,
          task_id: taskId,
        });

      if (transactionError) {
        console.error('Error creating transaction record:', transactionError);
        // Don't throw here - the balance was already updated
      }

      return true;
    } catch (error) {
      console.error('Error completing task:', error);
      throw error;
    }
  },

  async getUserCompletedTasks(userId: string): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('dailyearn_transactions')
        .select('task_id')
        .eq('user_id', userId)
        .eq('type', 'task')
        .not('task_id', 'is', null);

      if (error) throw error;
      return data?.map(t => t.task_id).filter(Boolean) || [];
    } catch (error) {
      console.error('Error fetching completed tasks:', error);
      return [];
    }
  },

  async getUserTransactions(userId: string): Promise<TransactionData[]> {
    try {
      const { data, error } = await supabase
        .from('dailyearn_transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching user transactions:', error);
      return [];
    }
  }
}