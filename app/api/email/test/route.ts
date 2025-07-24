import { NextRequest, NextResponse } from 'next/server';
import { emailService } from '@/lib/email';

export async function GET() {
  try {
    // Test email configuration
    const testEmail = process.env.SMTP_USER || 'test@example.com';
    
    const success = await emailService.sendEmail({
      to: testEmail,
      subject: 'DailyEarn Email Test',
      html: `
        <h1>Email Configuration Test</h1>
        <p>If you receive this email, your email configuration is working correctly!</p>
        <p>Test sent at: ${new Date().toISOString()}</p>
      `,
      text: 'Email Configuration Test - If you receive this email, your email configuration is working correctly!'
    });

    if (success) {
      return NextResponse.json({ 
        message: 'Test email sent successfully',
        testEmail: testEmail
      });
    } else {
      return NextResponse.json(
        { error: 'Failed to send test email' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in email test:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
}
