import { SendWhatsAppInput, SendWhatsAppOutput, WhatsAppProvider } from "./whatsapp.provider";

export class MetaWhatsAppProvider implements WhatsAppProvider {
  private getApiConfig(config?: Record<string, unknown>) {
    const accessToken = (config?.accessToken as string) || process.env.META_ACCESS_TOKEN;
    const phoneNumberId = (config?.phoneNumberId as string) || process.env.META_PHONE_NUMBER_ID;

    if (!accessToken || !phoneNumberId) {
      throw new Error("WhatsApp API Configuration (Access Token or Phone Number ID) is missing.");
    }

    return { accessToken, phoneNumberId };
  }

  async sendMessage(
    input: SendWhatsAppInput,
    config?: Record<string, unknown>
  ): Promise<SendWhatsAppOutput> {
    try {
      const { accessToken, phoneNumberId } = this.getApiConfig(config);
      const version = (config?.version as string) || "v20.0";
      const url = `https://graph.facebook.com/${version}/${phoneNumberId}/messages`;

      const formattedTo = input.to.replace(/\D/g, ""); // Remove non-digits

      // If it's a template message (e.g. for official WhatsApp campaign approvals)
      const bodyPayload = input.templateName
        ? {
            messaging_product: "whatsapp",
            to: formattedTo,
            type: "template",
            template: {
              name: input.templateName,
              language: { code: input.templateLanguage || "en_US" },
              components: input.components || [],
            },
          }
        : {
            messaging_product: "whatsapp",
            to: formattedTo,
            type: "text",
            text: { body: input.message },
          };

      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyPayload),
      });

      const responseData = await response.json();

      if (!response.ok) {
        return {
          id: "",
          status: "failed",
          error: responseData.error?.message || "WhatsApp send request failed",
        };
      }

      return {
        id: responseData.messages?.[0]?.id || "",
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
