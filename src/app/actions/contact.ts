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

  const send = (recipients: string[], text: string) =>
    fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: recipients,
        reply_to: values.email,
        subject,
        text,
      }),
    });

  /**
   * Resend's shared sender only delivers to the address that owns the account,
   * and rejects the whole message if any other recipient is named. That is the
   * one thing deciding the shape below, and it stops applying the moment
   * CONTACT_FROM_EMAIL moves onto a domain verified at resend.com/domains.
   *
   * Off the shared sender, both parties go on one message: one thread, one
   * subject, the visitor able to see they were included.
   *
   * On it, they cannot. A single message naming the visitor is refused
   * outright and the enquiry is lost along with the copy, so the enquiry is
   * sent alone and the copy follows as a separate, expendable request.
   */
  const onSharedSender = from.trim().toLowerCase().endsWith("@resend.dev");
  const senderWantsCopy = values.email.toLowerCase() !== to.toLowerCase();
  const together = senderWantsCopy && !onSharedSender;

  try {
    const response = await send(
      together ? [to, values.email] : [to],
      together
        ? [
            details,
            "",
            "--",
            // The one message is read from both ends, so the footer has to
            // make sense to either reader.
            `Sent from the contact form on ${person.name}'s site. Both of you are on this message.`,
          ].join("\n")
        : details,
    );

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

  // Only reached while on the shared sender, where the visitor could not be
  // named on the message above. Deliberately best effort: Resend rejects this
  // for every address but the account owner's, and a copy that cannot be
  // delivered is no reason to tell someone their enquiry failed when it has
  // already been delivered.
  if (senderWantsCopy && !together) {
    try {
      const copy = await send(
        [values.email],
        [
          `Thanks for getting in touch. ${person.name} has received this and will reply soon.`,
          "",
          "Your message:",
          "",
          details,
        ].join("\n"),
      );
      if (!copy.ok) {
        console.warn(
          "[contact] Sender copy not delivered (the enquiry itself was sent):",
          copy.status,
          await copy.text(),
        );
      }
    } catch (error) {
      console.warn("[contact] Sender copy failed (the enquiry itself was sent):", error);
    }
  }

  return {
    status: "success",
    message: "Thanks, your message is on its way. I'll reply soon.",
  };
}
