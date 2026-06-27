export interface SendWhatsAppInput {
  to: string;
  message: string;
  templateName?: string;
  templateLanguage?: string;
  components?: unknown[];
}

export interface SendWhatsAppOutput {
  id: string;
  status: "success" | "failed";
  error?: string;
}

export interface WhatsAppProvider {
  sendMessage(
    input: SendWhatsAppInput,
    config?: Record<string, unknown>
  ): Promise<SendWhatsAppOutput>;
}
