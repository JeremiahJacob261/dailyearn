import nodemailer from 'nodemailer';

// Create transporter using the SMTP credentials
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '465'),
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export const emailService = {
  async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      await transporter.sendMail({
        from: process.env.SMTP_FROM || 'akpomoshix@gmail.com',
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
      });
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  },

  async sendWelcomeEmail(userEmail: string, userName: string): Promise<boolean> {
    const subject = 'Welcome to DailyEarn! 🎉';
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to DailyEarn</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
          .header { background: linear-gradient(135deg, #9BFF00, #7ed321); padding: 40px 20px; text-align: center; }
          .header h1 { color: #000; margin: 0; font-size: 28px; font-weight: bold; }
          .content { padding: 40px 20px; }
          .welcome-message { font-size: 18px; color: #333; line-height: 1.6; margin-bottom: 30px; }
          .features { background-color: #f8f9fa; padding: 30px 20px; border-radius: 8px; margin: 30px 0; }
          .feature { display: flex; align-items: center; margin: 15px 0; }
          .feature-icon { width: 24px; height: 24px; margin-right: 15px; }
          .cta-button { display: inline-block; background: linear-gradient(135deg, #9BFF00, #7ed321); color: #000; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; margin: 20px 0; }
          .footer { background-color: #333; color: #fff; padding: 30px 20px; text-align: center; }
          .social-links { margin: 20px 0; }
          .social-links a { color: #9BFF00; text-decoration: none; margin: 0 10px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>DailyEarn</h1>
            <p style="color: #000; font-size: 16px; margin: 10px 0 0 0;">Earn Money Daily with Simple Tasks</p>
          </div>
          
          <div class="content">
            <div class="welcome-message">
              <h2 style="color: #333; margin-bottom: 20px;">Welcome ${userName}! 🎉</h2>
              <p>Thank you for joining DailyEarn! We're excited to have you as part of our community where you can earn money by completing simple tasks.</p>
              <p>Your account is now active and ready to use. Here's what you can do:</p>
            </div>

            <div class="features">
              <h3 style="color: #333; margin-bottom: 20px;">What You Can Do:</h3>
              
              <div class="feature">
                <span style="font-size: 20px;">💰</span>
                <div style="margin-left: 15px;">
                  <strong>Complete Tasks & Earn</strong><br>
                  <span style="color: #666;">Complete simple tasks and get rewarded instantly</span>
                </div>
              </div>
              
              <div class="feature">
                <span style="font-size: 20px;">👥</span>
                <div style="margin-left: 15px;">
                  <strong>Refer Friends</strong><br>
                  <span style="color: #666;">Earn ₦50 for every friend you refer who joins</span>
                </div>
              </div>
              
              <div class="feature">
                <span style="font-size: 20px;">💸</span>
                <div style="margin-left: 15px;">
                  <strong>Withdraw Earnings</strong><br>
                  <span style="color: #666;">Request payouts directly to your Nigerian bank account</span>
                </div>
              </div>
              
              <div class="feature">
                <span style="font-size: 20px;">📱</span>
                <div style="margin-left: 15px;">
                  <strong>Mobile Optimized</strong><br>
                  <span style="color: #666;">Earn on the go with our mobile-friendly platform</span>
                </div>
              </div>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://dailyearn.com'}/signin" class="cta-button">
                Start Earning Now →
              </a>
            </div>

            <div style="background-color: #e8f5e8; padding: 20px; border-radius: 8px; border-left: 4px solid #9BFF00;">
              <h4 style="color: #333; margin: 0 0 10px 0;">💡 Pro Tip:</h4>
              <p style="color: #555; margin: 0;">Share your referral code with friends and family to maximize your earnings. You'll get rewarded for every successful referral!</p>
            </div>
          </div>

          <div class="footer">
            <h3>Need Help?</h3>
            <p>If you have any questions or need assistance, feel free to contact our support team.</p>
            
            <div class="social-links">
              <p>Follow us for updates and tips:</p>
              <a href="#">Facebook</a> | 
              <a href="#">Twitter</a> | 
              <a href="#">Instagram</a>
            </div>
            
            <p style="font-size: 12px; color: #ccc; margin-top: 30px;">
              © 2025 DailyEarn. All rights reserved.<br>
              This email was sent to ${userEmail}
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
      Welcome to DailyEarn, ${userName}!
      
      Thank you for joining our platform where you can earn money by completing simple tasks.
      
      What you can do:
      - Complete tasks and earn money instantly
      - Refer friends and earn ₦50 per referral
      - Withdraw earnings to your Nigerian bank account
      - Use our mobile-optimized platform anywhere
      
      Start earning now: ${process.env.NEXT_PUBLIC_APP_URL || 'https://dailyearn.com'}/signin
      
      Need help? Contact our support team.
      
      © 2025 DailyEarn. All rights reserved.
    `;

    return this.sendEmail({
      to: userEmail,
      subject,
      html,
      text,
    });
  },

  async sendPasswordResetEmail(userEmail: string, userName: string, resetToken: string): Promise<boolean> {
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://dailyearn.com'}/reset-password?token=${resetToken}`;
    const subject = 'Reset Your DailyEarn Password 🔐';
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
          .header { background: linear-gradient(135deg, #ff6b6b, #ee5a52); padding: 40px 20px; text-align: center; }
          .header h1 { color: #fff; margin: 0; font-size: 28px; font-weight: bold; }
          .content { padding: 40px 20px; }
          .reset-message { font-size: 18px; color: #333; line-height: 1.6; margin-bottom: 30px; }
          .cta-button { display: inline-block; background: linear-gradient(135deg, #ff6b6b, #ee5a52); color: #fff; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; margin: 20px 0; }
          .security-notice { background-color: #fff3cd; padding: 20px; border-radius: 8px; border-left: 4px solid #ffc107; margin: 30px 0; }
          .footer { background-color: #333; color: #fff; padding: 30px 20px; text-align: center; }
          .token-display { background-color: #f8f9fa; padding: 15px; border-radius: 8px; font-family: monospace; font-size: 16px; letter-spacing: 1px; margin: 20px 0; word-break: break-all; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Password Reset</h1>
            <p style="color: #fff; font-size: 16px; margin: 10px 0 0 0;">DailyEarn Account Security</p>
          </div>
          
          <div class="content">
            <div class="reset-message">
              <h2 style="color: #333; margin-bottom: 20px;">Hi ${userName},</h2>
              <p>We received a request to reset your DailyEarn account password. If you made this request, click the button below to reset your password:</p>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" class="cta-button">
                Reset My Password
              </a>
            </div>

            <div class="security-notice">
              <h4 style="color: #856404; margin: 0 0 10px 0;">⚠️ Security Notice:</h4>
              <ul style="color: #856404; margin: 10px 0; padding-left: 20px;">
                <li>This link will expire in 1 hour for security reasons</li>
                <li>If you didn't request this reset, please ignore this email</li>
                <li>Never share this link with anyone</li>
                <li>Always keep your password secure and unique</li>
              </ul>
            </div>

            <div style="border: 1px solid #ddd; padding: 20px; border-radius: 8px; margin: 30px 0;">
              <h4 style="color: #333; margin: 0 0 15px 0;">Alternative Method:</h4>
              <p style="color: #666; margin-bottom: 10px;">If the button above doesn't work, copy and paste this link into your browser:</p>
              <div class="token-display">${resetUrl}</div>
            </div>

            <div style="background-color: #e8f4f8; padding: 20px; border-radius: 8px; border-left: 4px solid #17a2b8;">
              <h4 style="color: #333; margin: 0 0 10px 0;">💡 Tips for a Strong Password:</h4>
              <ul style="color: #555; margin: 10px 0; padding-left: 20px;">
                <li>Use at least 8 characters</li>
                <li>Include uppercase and lowercase letters</li>
                <li>Add numbers and special characters</li>
                <li>Avoid using personal information</li>
              </ul>
            </div>
          </div>

          <div class="footer">
            <h3>Need Help?</h3>
            <p>If you're having trouble resetting your password or didn't request this change, please contact our support team immediately.</p>
            
            <p style="font-size: 12px; color: #ccc; margin-top: 30px;">
              © 2025 DailyEarn. All rights reserved.<br>
              This email was sent to ${userEmail} for security purposes.
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
      Password Reset Request - DailyEarn
      
      Hi ${userName},
      
      We received a request to reset your DailyEarn account password.
      
      Reset your password by visiting this link:
      ${resetUrl}
      
      Security Notes:
      - This link expires in 1 hour
      - If you didn't request this, ignore this email
      - Never share this link with anyone
      
      Need help? Contact our support team.
      
      © 2025 DailyEarn. All rights reserved.
    `;

    return this.sendEmail({
      to: userEmail,
      subject,
      html,
      text,
    });
  },

  async sendVerificationEmail(userEmail: string, userName: string, verificationCode: string): Promise<boolean> {
    const subject = 'Verify Your DailyEarn Account ✅';
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Account</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
          .header { background: linear-gradient(135deg, #28a745, #20c997); padding: 40px 20px; text-align: center; }
          .header h1 { color: #fff; margin: 0; font-size: 28px; font-weight: bold; }
          .content { padding: 40px 20px; text-align: center; }
          .verification-code { background: linear-gradient(135deg, #007bff, #0056b3); color: #fff; font-size: 32px; font-weight: bold; letter-spacing: 8px; padding: 20px; border-radius: 12px; margin: 30px 0; display: inline-block; }
          .footer { background-color: #333; color: #fff; padding: 30px 20px; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Email Verification</h1>
            <p style="color: #fff; font-size: 16px; margin: 10px 0 0 0;">DailyEarn Account Activation</p>
          </div>
          
          <div class="content">
            <h2 style="color: #333; margin-bottom: 20px;">Hi ${userName}!</h2>
            <p style="color: #666; font-size: 18px; line-height: 1.6;">Thank you for signing up for DailyEarn. To complete your registration, please verify your email address by entering the code below:</p>
            
            <div class="verification-code">${verificationCode}</div>
            
            <p style="color: #666; margin-top: 30px;">Enter this code on the verification page to activate your account and start earning money!</p>
            
            <div style="background-color: #fff3cd; padding: 20px; border-radius: 8px; border-left: 4px solid #ffc107; margin: 30px 0; text-align: left;">
              <h4 style="color: #856404; margin: 0 0 10px 0;">⏰ Important:</h4>
              <ul style="color: #856404; margin: 0; padding-left: 20px;">
                <li>This code expires in 10 minutes</li>
                <li>Keep this code confidential</li>
                <li>If you didn't sign up, please ignore this email</li>
              </ul>
            </div>
          </div>

          <div class="footer">
            <p>Need help? Contact our support team.</p>
            <p style="font-size: 12px; color: #ccc; margin-top: 20px;">
              © 2025 DailyEarn. All rights reserved.<br>
              This email was sent to ${userEmail}
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
      Email Verification - DailyEarn
      
      Hi ${userName}!
      
      Thank you for signing up for DailyEarn. 
      
      Your verification code is: ${verificationCode}
      
      Enter this code on the verification page to activate your account.
      
      Important:
      - This code expires in 10 minutes
      - Keep this code confidential
      - If you didn't sign up, ignore this email
      
      © 2025 DailyEarn. All rights reserved.
    `;

    return this.sendEmail({
      to: userEmail,
      subject,
      html,
      text,
    });
  },
};
