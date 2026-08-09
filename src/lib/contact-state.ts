/**
 * Shared shape for the contact form's action state.
 *
 * Kept out of the `"use server"` module on purpose: those files may only export
 * async functions, so the initial-state object can't live alongside the action.
 */
export type ContactState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Partial<Record<"name" | "email" | "reason" | "body", string>>;
  /** Echoed back so a failed submit doesn't wipe what the visitor typed. */
  values?: { name: string; email: string; reason: string; body: string };
};

export const initialContactState: ContactState = { status: "idle" };
