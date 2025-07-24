// Client-side email service that calls API routes
export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export const clientEmailService = {
  async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      const response = await fetch('/api/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(options),
      });

      if (response.ok) {
        return true;
      } else {
        const error = await response.json();
        console.error('Error sending email:', error);
        return false;
      }
    } catch (error) {
      console.error('Error calling email API:', error);
      return false;
    }
  },

  async sendWelcomeEmail(userEmail: string, userName: string): Promise<boolean> {
    try {
      const response = await fetch('/api/email/welcome', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userEmail, userName }),
      });

      if (response.ok) {
        return true;
      } else {
        const error = await response.json();
        console.error('Error sending welcome email:', error);
        return false;
      }
    } catch (error) {
      console.error('Error calling welcome email API:', error);
      return false;
    }
  },

  async sendPasswordResetEmail(userEmail: string, userName: string, resetToken: string): Promise<boolean> {
    try {
      const response = await fetch('/api/email/password-reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userEmail, userName, resetToken }),
      });

      if (response.ok) {
        return true;
      } else {
        const error = await response.json();
        console.error('Error sending password reset email:', error);
        return false;
      }
    } catch (error) {
      console.error('Error calling password reset email API:', error);
      return false;
    }
  },

  async sendVerificationEmail(userEmail: string, userName: string, verificationCode: string): Promise<boolean> {
    try {
      const response = await fetch('/api/email/verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userEmail, userName, verificationCode }),
      });

      if (response.ok) {
        return true;
      } else {
        const error = await response.json();
        console.error('Error sending verification email:', error);
        return false;
      }
    } catch (error) {
      console.error('Error calling verification email API:', error);
      return false;
    }
  },
};
