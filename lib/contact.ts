import { supabase } from './supabase';

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'responded' | 'resolved';
  admin_notes?: string;
  user_id?: string;
  created_at: string;
  updated_at: string;
  user?: {
    full_name: string;
    email: string;
  };
}

export const contactService = {
  async createContactMessage(data: {
    name: string;
    email: string;
    subject: string;
    message: string;
    userId?: string;
  }): Promise<ContactMessage> {
    const { data: message, error } = await supabase
      .from('dailyearn_contact_messages')
      .insert({
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        subject: data.subject.trim(),
        message: data.message.trim(),
        user_id: data.userId || null,
        status: 'new'
      })
      .select()
      .single();

    if (error) {
      throw new Error('Failed to create contact message');
    }

    return message;
  },

  async getContactMessages(filters?: {
    status?: string;
    limit?: number;
    offset?: number;
  }): Promise<ContactMessage[]> {
    let query = supabase
      .from('dailyearn_contact_messages')
      .select(`
        *,
        dailyearn_users(full_name, email)
      `)
      .order('created_at', { ascending: false });

    if (filters?.status && filters.status !== 'all') {
      query = query.eq('status', filters.status);
    }

    if (filters?.limit) {
      const offset = filters.offset || 0;
      query = query.range(offset, offset + filters.limit - 1);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error('Failed to fetch contact messages');
    }

    return data || [];
  },

  async updateContactMessage(
    id: string,
    updates: {
      status?: string;
      admin_notes?: string;
    }
  ): Promise<ContactMessage> {
    const updateData: any = {
      updated_at: new Date().toISOString()
    };

    if (updates.status) updateData.status = updates.status;
    if (updates.admin_notes !== undefined) updateData.admin_notes = updates.admin_notes;

    const { data, error } = await supabase
      .from('dailyearn_contact_messages')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error('Failed to update contact message');
    }

    return data;
  },

  async getContactMessageById(id: string): Promise<ContactMessage | null> {
    const { data, error } = await supabase
      .from('dailyearn_contact_messages')
      .select(`
        *,
        dailyearn_users(full_name, email)
      `)
      .eq('id', id)
      .single();

    if (error) {
      return null;
    }

    return data;
  },

  async getContactStats(): Promise<{
    total: number;
    new: number;
    read: number;
    responded: number;
    resolved: number;
  }> {
    const { data, error } = await supabase
      .from('dailyearn_contact_messages')
      .select('status');

    if (error) {
      throw new Error('Failed to fetch contact stats');
    }

    const stats = {
      total: data.length,
      new: 0,
      read: 0,
      responded: 0,
      resolved: 0
    };

    data.forEach(message => {
      if (message.status in stats) {
        stats[message.status as keyof typeof stats]++;
      }
    });

    return stats;
  }
};
