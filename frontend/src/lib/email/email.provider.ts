export interface SendEmailInput {
  to: string;
  subject: string;
  body: string;
  from?: string;
  fromName?: string;
}

export interface SendEmailOutput {
  id: string;
  status: "success" | "failed";
  error?: string;
}

export interface EmailProvider {
  sendEmail(
    input: SendEmailInput,
    config?: Record<string, unknown>
  ): Promise<SendEmailOutput>;
}
