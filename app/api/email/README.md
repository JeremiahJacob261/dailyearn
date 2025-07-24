# Email API Routes

This directory contains API routes for sending emails in the DailyEarn application. The email functionality has been moved from direct server-side calls to API routes for better separation of concerns and easier testing.

## Available Routes

### 1. Send Welcome Email
- **Endpoint**: `POST /api/email/welcome`
- **Purpose**: Send a welcome email to new users
- **Body**:
  ```json
  {
    "userEmail": "user@example.com",
    "userName": "John Doe"
  }
  ```

### 2. Send Password Reset Email
- **Endpoint**: `POST /api/email/password-reset`
- **Purpose**: Send password reset email with reset token
- **Body**:
  ```json
  {
    "userEmail": "user@example.com",
    "userName": "John Doe",
    "resetToken": "unique-reset-token"
  }
  ```

### 3. Send Verification Email
- **Endpoint**: `POST /api/email/verification`
- **Purpose**: Send email verification code to users
- **Body**:
  ```json
  {
    "userEmail": "user@example.com",
    "userName": "John Doe",
    "verificationCode": "123456"
  }
  ```

### 4. Send Custom Email
- **Endpoint**: `POST /api/email/send`
- **Purpose**: Send a custom email with specific content
- **Body**:
  ```json
  {
    "to": "user@example.com",
    "subject": "Email Subject",
    "html": "<h1>Email Content</h1>",
    "text": "Plain text content (optional)"
  }
  ```

### 5. Test Email Configuration
- **Endpoint**: `GET /api/email/test`
- **Purpose**: Test if email configuration is working
- **Response**: Sends a test email to the SMTP_USER email address

## Implementation

### Server-Side Email Service (`/lib/email.ts`)
Contains the actual email sending logic using nodemailer:
- SMTP configuration
- Email templates (HTML and text)
- Direct email sending functions

### Client-Side Email Service (`/lib/client-email.ts`)
Contains functions that call the API routes:
- Wrapper functions for each email type
- Proper error handling
- API request formatting

### Hybrid Approach in Auth Service
The auth service (`/lib/auth.ts`) uses a hybrid approach:
- **Client-side**: Calls API routes via `clientEmailService`
- **Server-side**: Directly uses `emailService` for better performance

## Usage Examples

### From Client-Side Components
```typescript
import { clientEmailService } from '@/lib/client-email';

// Send welcome email
await clientEmailService.sendWelcomeEmail('user@example.com', 'John Doe');

// Send verification email
await clientEmailService.sendVerificationEmail('user@example.com', 'John Doe', '123456');
```

### From Server-Side (API Routes)
```typescript
import { emailService } from '@/lib/email';

// Direct email sending
await emailService.sendWelcomeEmail('user@example.com', 'John Doe');
```

## Environment Variables Required

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=your-email@gmail.com
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Error Handling

All API routes include proper error handling:
- Input validation
- Try-catch blocks
- Meaningful error messages
- Appropriate HTTP status codes

## Testing

Use the test endpoint to verify email configuration:
```bash
curl http://localhost:3000/api/email/test
```

This will send a test email to the configured SMTP_USER address.
