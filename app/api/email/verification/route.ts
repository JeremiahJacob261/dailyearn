import { NextRequest, NextResponse } from 'next/server';
import { emailService } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const { userEmail, userName, verificationCode } = await request.json();

    if (!userEmail || !userName || !verificationCode) {
      return NextResponse.json(
        { error: 'Missing required fields: userEmail, userName, and verificationCode' },
        { status: 400 }
      );
    }

    const success = await emailService.sendVerificationEmail(userEmail, userName, verificationCode);

    if (success) {
      return NextResponse.json({ message: 'Verification email sent successfully' });
    } else {
      return NextResponse.json(
        { error: 'Failed to send verification email' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in verification email API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
