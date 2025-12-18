import { Resend } from "resend";

// Lazy initialization of Resend client
let resendClient: Resend | null = null;

export function getResend(): Resend {
  if (!resendClient) {
    resendClient = new Resend(process.env.RESEND_API_KEY);
  }
  return resendClient;
}

// Legacy export for backwards compatibility
export const resend = {
  emails: {
    send: async (...args: Parameters<Resend["emails"]["send"]>) => {
      return getResend().emails.send(...args);
    },
  },
};

// Email configuration
export const emailConfig = {
  from: process.env.EMAIL_FROM || "emmotion.ch <noreply@emmotion.ch>",
  to: process.env.EMAIL_TO || "hallo@emmotion.ch",
};
