import EmailService from '../email.service';
import { Resend } from 'resend';
import { resendConfig } from '../../config/resend.config';

// Define the interfaces to match CreateEmailResponse
interface CreateEmailResponseSuccess {
  id: string;
}

interface ErrorResponse {
  message: string;
}

interface CreateEmailResponse {
  data: CreateEmailResponseSuccess | null;
  error: ErrorResponse | null;
}

// Mock 'resend' module before any imports
jest.mock('resend', () => ({
  Resend: jest.fn().mockImplementation(() => ({
    emails: {
      send: jest.fn().mockResolvedValue({ data: { id: '12345' } }), // Mocked Resend response
    },
  })),
}));

// Mock 'resendConfig' module to provide a valid API key
jest.mock('../../config/resend.config', () => ({
  resendConfig: {
    apiKey: 're_test_key', // Mock API key
    from: 'no-reply@vivamq.test', // Mock from email
  },
}));

describe('EmailService', () => {
  let emailService: EmailService;
  const mockedResend = Resend as jest.MockedClass<typeof Resend>;

  beforeEach(() => {
    jest.clearAllMocks();
    emailService = new EmailService();
  });

  describe('replaceVariables', () => {
    it('should replace variables in the template', () => {
      const template = '<html>Hello {{name}}</html>';
      const variables = { name: 'John' };
      const result = (emailService as any)['replaceVariables'](
        template,
        variables
      );
      expect(result).toBe('<html>Hello John</html>');
    });

    it('should replace multiple variables in the template', () => {
      const template = '<html>Hello {{name}} {{surname}}</html>';
      const variables = { name: 'John', surname: 'Doe' };
      const result = (emailService as any)['replaceVariables'](
        template,
        variables
      );
      expect(result).toBe('<html>Hello John Doe</html>');
    });

    it('should replace missing variables with empty strings', () => {
      const template = '<html>Hello {{name}} {{surname}}</html>';
      const variables = { name: 'John' };
      const result = (emailService as any)['replaceVariables'](
        template,
        variables
      );
      expect(result).toBe('<html>Hello John </html>');
    });
  });

  describe('sendSignUpEmail', () => {
    it('should send a sign-up email and return CreateEmailResponse', async () => {
      const response: CreateEmailResponse = {
        data: { id: '12345' },
        error: null,
      };

      jest
        .spyOn(emailService, 'sendTransactionalEmail')
        .mockResolvedValue(response);

      const result = await emailService.sendSignUpEmail(
        'test@example.com',
        'John'
      );

      expect(emailService.sendTransactionalEmail).toHaveBeenCalledWith(
        'test@example.com',
        'Welcome to Our Platform',
        'signup-template.html',
        { name: 'John' }
      );

      expect(result).toEqual(response);
    });

    it('should throw an error when sendTransactionalEmail throws', async () => {
      const errorMessage = 'Error sending sign-up email';
      jest
        .spyOn(emailService, 'sendTransactionalEmail')
        .mockRejectedValue(new Error(errorMessage));

      await expect(
        emailService.sendSignUpEmail('test@example.com', 'John')
      ).rejects.toThrow(errorMessage);
    });
  });

  describe('sendPasswordResetEmail', () => {
    it('should send a password reset email and return CreateEmailResponse', async () => {
      const response: CreateEmailResponse = {
        data: { id: '67890' },
        error: null,
      };

      jest
        .spyOn(emailService, 'sendTransactionalEmail')
        .mockResolvedValue(response);

      const result = await emailService.sendPasswordResetEmail(
        'test@example.com',
        'https://resetlink.com'
      );

      expect(emailService.sendTransactionalEmail).toHaveBeenCalledWith(
        'test@example.com',
        'Password Reset Request',
        'password-reset-template.html',
        { resetLink: 'https://resetlink.com' }
      );

      expect(result).toEqual(response);
    });

    it('should throw an error when sendTransactionalEmail throws', async () => {
      const errorMessage = 'Error sending password reset email';
      jest
        .spyOn(emailService, 'sendTransactionalEmail')
        .mockRejectedValue(new Error(errorMessage));

      await expect(
        emailService.sendPasswordResetEmail(
          'test@example.com',
          'https://resetlink.com'
        )
      ).rejects.toThrow(errorMessage);
    });
  });

  describe('sendInviteToTeachingTeamEmail', () => {
    it('should send an invite to teaching team email and return CreateEmailResponse', async () => {
      const response: CreateEmailResponse = {
        data: { id: '54321' },
        error: null,
      };

      jest
        .spyOn(emailService, 'sendTransactionalEmail')
        .mockResolvedValue(response);

      const result = await emailService.sendInviteToTeachingTeamEmail(
        'teacher@example.com',
        'Jane',
        'https://invitelink.com'
      );

      expect(emailService.sendTransactionalEmail).toHaveBeenCalledWith(
        'teacher@example.com',
        'Invitation to Join Teaching Team',
        'invite-teaching-team-template.html',
        { name: 'Jane', inviteLink: 'https://invitelink.com' }
      );

      expect(result).toEqual(response);
    });

    it('should throw an error when sendTransactionalEmail throws', async () => {
      const errorMessage = 'Error sending invite to teaching team email';
      jest
        .spyOn(emailService, 'sendTransactionalEmail')
        .mockRejectedValue(new Error(errorMessage));

      await expect(
        emailService.sendInviteToTeachingTeamEmail(
          'teacher@example.com',
          'Jane',
          'https://invitelink.com'
        )
      ).rejects.toThrow(errorMessage);
    });
  });

  describe('sendRemovedFromTeachingTeamEmail', () => {
    it('should send a removed from teaching team email and return CreateEmailResponse', async () => {
      const response: CreateEmailResponse = {
        data: { id: '98765' },
        error: null,
      };

      jest
        .spyOn(emailService, 'sendTransactionalEmail')
        .mockResolvedValue(response);

      const result = await emailService.sendRemovedFromTeachingTeamEmail(
        'teacher@example.com',
        'Jane'
      );

      expect(emailService.sendTransactionalEmail).toHaveBeenCalledWith(
        'teacher@example.com',
        'Update on Your Teaching Team Status',
        'removed-teaching-team-template.html',
        { name: 'Jane' }
      );

      expect(result).toEqual(response);
    });

    it('should throw an error when sendTransactionalEmail throws', async () => {
      const errorMessage = 'Error sending removed from teaching team email';
      jest
        .spyOn(emailService, 'sendTransactionalEmail')
        .mockRejectedValue(new Error(errorMessage));

      await expect(
        emailService.sendRemovedFromTeachingTeamEmail(
          'teacher@example.com',
          'Jane'
        )
      ).rejects.toThrow(errorMessage);
    });
  });
});
