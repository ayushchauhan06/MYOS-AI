import { Resend } from "resend";
import { EmailProvider, SendEmailInput, SendEmailOutput } from "./email.provider";

export class ResendProvider implements EmailProvider {
  private getClient(apiKey?: string): Resend {
    const key = apiKey || process.env.RESEND_API_KEY;
    if (!key) {
      throw new Error("Resend API Key is missing. Please set it in Settings or environment variables.");
    }
    return new Resend(key);
  }

  async sendEmail(
    input: SendEmailInput,
    config?: Record<string, unknown>
  ): Promise<SendEmailOutput> {
    try {
      const apiKey = config?.apiKey as string | undefined;
      const client = this.getClient(apiKey);

      const fromEmail = input.from || (config?.fromEmail as string) || process.env.RESEND_FROM_EMAIL || "hello@myos.ai";
      const fromName = input.fromName || (config?.fromName as string) || "MYOS AI";

      const response = await client.emails.send({
        from: `${fromName} <${fromEmail}>`,
        to: input.to,
        subject: input.subject,
        text: input.body,
      });

      if (response.error) {
        return {
          id: "",
          status: "failed",
          error: response.error.message,
        };
      }

      return {
        id: response.data?.id || "",
        status: "success",
      };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      return {
        id: "",
        status: "failed",
        error: errorMsg,
      };
    }
  }
}
