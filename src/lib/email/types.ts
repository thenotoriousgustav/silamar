/**
 * Email service interface for dependency injection.
 * Implementations can use Resend, SendGrid, or any compatible provider.
 */

export type SendEmailParams = {
  /** Recipient email address */
  to: string;
  /** Email subject line */
  subject: string;
  /** HTML content of the email */
  html: string;
};

export type SendEmailResult = {
  /** Unique identifier of the sent email (provider-specific) */
  id: string;
};

export interface EmailClient {
  /** Send an email with HTML content */
  sendEmail(params: SendEmailParams): Promise<SendEmailResult>;
}
