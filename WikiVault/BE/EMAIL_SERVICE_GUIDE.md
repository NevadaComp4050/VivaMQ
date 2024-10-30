# Email Service Guide

## Using the Email Service

1. Import the email service in the module/file:

```typescript
import { emailService } from '../services/email.service';
```

2. Use the email service methods to send emails:

```typescript
// Sending a sign-up email
await emailService.sendSignUpEmail('user@example.com', 'John Doe');

// Sending a password reset email
await emailService.sendPasswordResetEmail('user@example.com', 'https://example.com/reset-password?token=abc123');

// Sending an invite to teaching team email
await emailService.sendInviteToTeachingTeamEmail('teacher@example.com', 'Jane Smith', 'https://example.com/accept-invite?token=xyz789');

// Sending a removed from teaching team email
await emailService.sendRemovedFromTeachingTeamEmail('teacher@example.com', 'Jane Smith');
```

## Creating Email Templates

1. Create a new HTML file in the `email-templates` directory.
2. Use HTML and inline CSS to design your email template.
3. Use `{{variableName}}` syntax for dynamic content.

Example template (`new-template.html`):

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{title}}</title>
</head>
<body style="font-family: sans-serif; line-height: 1.5; color: #333;">
    <h1>Hello, {{name}}!</h1>
    <p>{{message}}</p>
    <a href="{{actionLink}}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">{{actionText}}</a>
</body>
</html>
```

4. Update the `EmailService` class to include a method for the new template:

```typescript
async sendNewTemplateEmail(to: string, name: string, message: string, actionLink: string) {
  return this.sendTransactionalEmail(
    to,
    'New Template Email',
    'new-template.html',
    { name, message, actionLink, actionText: 'Click Here', title: 'New Template' }
  );
}
```

5. Use the new method in the application:

```typescript
await emailService.sendNewTemplateEmail('user@example.com', 'John Doe', 'This is a test message', 'https://example.com/action');
```

Remember to restart dev server after adding new templates or updating the email service.