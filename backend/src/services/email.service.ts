// src/services/email.service.ts

import path from 'path';
import fs from 'fs/promises';
import { Resend } from 'resend';
import { resendConfig } from '../config/resend.config';

// Import/Create the interfaces
interface CreateEmailResponseSuccess {
  /** The ID of the newly created email. */
  id: string;
}

interface ErrorResponse {
  message: string;
}

interface CreateEmailResponse {
  data: CreateEmailResponseSuccess | null;
  error: ErrorResponse | null;
}

class EmailService {
  private readonly resend: Resend;
  private templates: Record<string, string> = {};
  private readonly loadingTemplates: Promise<void>;

  constructor() {
    this.resend = new Resend(resendConfig.apiKey);
    this.loadingTemplates = this.loadTemplates();
  }

  private async loadTemplates() {
    const templateDir = path.join(__dirname, '..', 'email-templates');
    const templateFiles = [
      'signup-template.html',
      'password-reset-template.html',
      'invite-teaching-team-template.html',
      'removed-teaching-team-template.html',
    ];

    for (const file of templateFiles) {
      const content = await fs.readFile(path.join(templateDir, file), 'utf-8');
      this.templates[file] = content;
    }
  }

  private replaceVariables(
    template: string,
    variables: Record<string, string>
  ): string {
    return template.replace(/\{\{(\w+)\}\}/g, (_, key) => variables[key] || '');
  }

  async sendTransactionalEmail(
    to: string,
    subject: string,
    templateName: string,
    variables: Record<string, string>
  ): Promise<CreateEmailResponse> {
    await this.loadingTemplates;

    if (!this.templates[templateName]) {
      throw new Error(`Template ${templateName} not found`);
    }

    const html = this.replaceVariables(this.templates[templateName], variables);

    const resendResponse = await this.resend.emails.send({
      from: resendConfig.from ?? 'no-reply@vivamq.app',
      to,
      subject,
      html,
    });

    console.log('Email sent successfully:', resendResponse);

    return {
      data: { id: resendResponse.data?.id ?? '' },
      error: null,
    };
  }

  async sendSignUpEmail(
    to: string,
    name: string
  ): Promise<CreateEmailResponse> {
    return await this.sendTransactionalEmail(
      to,
      'Welcome to Our Platform',
      'signup-template.html',
      { name }
    );
  }

  async sendPasswordResetEmail(
    to: string,
    resetLink: string
  ): Promise<CreateEmailResponse> {
    return await this.sendTransactionalEmail(
      to,
      'Password Reset Request',
      'password-reset-template.html',
      { resetLink }
    );
  }

  async sendInviteToTeachingTeamEmail(
    to: string,
    name: string,
    inviteLink: string
  ): Promise<CreateEmailResponse> {
    return await this.sendTransactionalEmail(
      to,
      'Invitation to Join Teaching Team',
      'invite-teaching-team-template.html',
      { name, inviteLink }
    );
  }

  async sendRemovedFromTeachingTeamEmail(
    to: string,
    name: string
  ): Promise<CreateEmailResponse> {
    return await this.sendTransactionalEmail(
      to,
      'Update on Your Teaching Team Status',
      'removed-teaching-team-template.html',
      { name }
    );
  }
}

export const emailService = new EmailService();

export default EmailService;
