"use server";

import { contactReasons, person } from "@/content/site";
import type { ContactState } from "@/lib/contact-state";

// Deliberately permissive: the goal is catching typos, not policing valid addresses.
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function str(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function submitContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const values = {
    name: str(formData, "name"),
    email: str(formData, "email"),
    reason: str(formData, "reason"),
    body: str(formData, "body"),
  };

  // Honeypot: hidden from humans, irresistible to naive bots.
  if (str(formData, "company")) {
    return { status: "success", message: "Thanks, your message is on its way." };
  }

  const fieldErrors: NonNullable<ContactState["fieldErrors"]> = {};

  if (values.name.length < 2) fieldErrors.name = "Please enter your name.";
  else if (values.name.length > 80) fieldErrors.name = "That name is too long.";

  if (!EMAIL.test(values.email)) fieldErrors.email = "Please enter a valid email.";

  if (values.reason && !contactReasons.includes(values.reason as never)) {
    fieldErrors.reason = "Please pick one of the listed options.";
  }

  if (values.body.length < 10) {
    fieldErrors.body = "A sentence or two would help.";
  } else if (values.body.length > 2000) {
    fieldErrors.body = "Please keep it under 2000 characters.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { status: "error", fieldErrors, values };
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL ?? person.email;
  const from = process.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !from) {
    // Without mail credentials the message would vanish silently, so say so
    // plainly rather than showing a success state that isn't true.
    console.warn(
      "[contact] RESEND_API_KEY or CONTACT_FROM_EMAIL is unset, message not sent.",
      values,
    );
    return {
      status: "error",
      message: `The form isn't connected to an email service yet. Please reach me directly at ${person.email}.`,
      values,
    };
  }

  const subject = `Portfolio enquiry: ${values.reason || "General"} (${values.name})`;
  const details = [
    `Name:   ${values.name}`,
    `Email:  ${values.email}`,
    `About:  ${values.reason || "Not specified"}`,
    "",
    values.body,
  ].join("\n");

  // One message, to the inbox, and nothing else.
  //
  // Earlier versions also copied the visitor. That needs Resend to accept a
  // recipient other than the account owner, which needs a DNS-verified sending
  // domain, which needs a domain: vercel.app is Vercel's zone and cannot take
  // the records. `reply_to` carries the visitor's address, so replying still
  // reaches them directly from the inbox.
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: values.email,
        subject,
        text: details,
      }),
    });

    if (!response.ok) {
      const detail = await response.text();
      console.error("[contact] Resend rejected the request:", response.status, detail);
      return {
        status: "error",
        message: `Something went wrong sending that. Please email me at ${person.email}.`,
        values,
      };
    }
  } catch (error) {
    console.error("[contact] Network error sending message:", error);
    return {
      status: "error",
      message: `Couldn't reach the mail service. Please email me at ${person.email}.`,
      values,
    };
  }

  return {
    status: "success",
    message: "Thanks, your message is on its way. I'll reply soon.",
  };
}
