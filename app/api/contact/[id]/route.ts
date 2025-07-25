import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { status, adminResponse } = await request.json();
    const messageId = params.id;

    if (!messageId) {
      return NextResponse.json(
        { error: 'Message ID is required' },
        { status: 400 }
      );
    }

    // Validate status
    const validStatuses = ['new', 'in_progress', 'resolved', 'closed'];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status value' },
        { status: 400 }
      );
    }

    // Build update object
    const updateData: any = {
      updated_at: new Date().toISOString()
    };

    if (status) updateData.status = status;
    if (adminResponse !== undefined) updateData.admin_response = adminResponse;

    // Update the contact message
    const { data, error } = await supabase
      .from('dailyearn_contact_messages')
      .update(updateData)
      .eq('id', messageId)
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to update message' },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Message not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      message: 'Contact message updated successfully',
      data 
    });

  } catch (error) {
    console.error('Error in contact update API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
