import { NextRequest, NextResponse } from 'next/server';
import { emailService } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const { userEmail, userName, resetToken } = await request.json();

    if (!userEmail || !userName || !resetToken) {
      return NextResponse.json(
        { error: 'Missing required fields: userEmail, userName, and resetToken' },
        { status: 400 }
      );
    }

    const success = await emailService.sendPasswordResetEmail(userEmail, userName, resetToken);

    if (success) {
      return NextResponse.json({ message: 'Password reset email sent successfully' });
    } else {
      return NextResponse.json(
        { error: 'Failed to send password reset email' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in password reset email API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
