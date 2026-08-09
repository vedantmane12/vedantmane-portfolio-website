"use client";

import { useActionState, useId, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { submitContact } from "@/app/actions/contact";
import { contactReasons } from "@/content/site";
import { initialContactState } from "@/lib/contact-state";
import { cn } from "@/lib/utils";

const fieldBase =
  "w-full rounded-full border border-border bg-surface px-5 py-3 text-base text-foreground transition-colors duration-300 placeholder:text-subtle hover:border-subtle focus:border-accent focus:outline-none";

export function ContactForm() {
  const [state, formAction, isPending] = useActionState(
    submitContact,
    initialContactState,
  );
  const ids = {
    name: useId(),
    email: useId(),
    reason: useId(),
    body: useId(),
  };

  const errors = state.fieldErrors ?? {};
  // Echoed back by the action. With JS the inputs keep their own DOM state, but
  // server actions also work with JS disabled, and there the page re-renders
  // from scratch, so these are what stop a failed submit wiping the form.
  const values = state.values;

  // Controlled so the "unselected" styling reacts to the visitor's choice;
  // with defaultValue alone the text stays dimmed after picking an option.
  const [reason, setReason] = useState(values?.reason ?? "");

  return (
    <form action={formAction} className="mt-12 max-w-2xl" noValidate>
      <div className="grid gap-6 sm:grid-cols-2">
        <Field
          id={ids.name}
          name="name"
          label="Name"
          placeholder="Vedant Mane"
          defaultValue={values?.name}
          error={errors.name}
          autoComplete="name"
        />
        <Field
          id={ids.email}
          name="email"
          type="email"
          label="Email"
          placeholder="you@example.com"
          defaultValue={values?.email}
          error={errors.email}
          autoComplete="email"
        />
      </div>

      <div className="mt-6">
        <Label htmlFor={ids.reason}>What&rsquo;s this about?</Label>
        <div className="relative">
          <select
            id={ids.reason}
            name="reason"
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            aria-invalid={errors.reason ? true : undefined}
            aria-describedby={errors.reason ? `${ids.reason}-error` : undefined}
            className={cn(
              fieldBase,
              "appearance-none pr-12",
              !reason && "text-subtle",
              errors.reason && "border-red-500/70",
            )}
          >
            <option value="">Select…</option>
            {contactReasons.map((option) => (
              <option key={option} value={option} className="text-foreground">
                {option}
              </option>
            ))}
          </select>
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="pointer-events-none absolute right-5 top-1/2 size-4 -translate-y-1/2 text-subtle"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </div>
        <FieldError id={`${ids.reason}-error`} message={errors.reason} />
      </div>

      <div className="mt-6">
        <Label htmlFor={ids.body}>What can I help you with?</Label>
        <textarea
          id={ids.body}
          name="body"
          rows={5}
          defaultValue={values?.body}
          placeholder="Hello, I'd like to enquire about…"
          aria-invalid={errors.body ? true : undefined}
          aria-describedby={errors.body ? `${ids.body}-error` : undefined}
          className={cn(
            fieldBase,
            "resize-y rounded-2xl",
            errors.body && "border-red-500/70",
          )}
        />
        <FieldError id={`${ids.body}-error`} message={errors.body} />
      </div>

      {/* Honeypot: hidden from people, left blank by them, filled by bots. */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="company">Company</label>
        <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-5">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-full border border-accent px-8 py-3 text-sm font-medium uppercase tracking-[0.08em] text-accent transition-all duration-300 hover:bg-accent hover:text-accent-foreground disabled:cursor-not-allowed disabled:opacity-55"
        >
          {isPending ? "Sending…" : "Submit"}
        </button>

        <AnimatePresence mode="wait">
          {state.status !== "idle" && state.message && (
            <motion.p
              key={state.message}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3 }}
              role="status"
              aria-live="polite"
              className={cn(
                "text-pretty text-sm",
                state.status === "success" ? "text-accent" : "text-red-400",
              )}
            >
              {state.message}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </form>
  );
}

function Label({
  htmlFor,
  children,
}: {
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-2 block text-sm font-medium text-accent"
    >
      {children}
    </label>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-2 text-sm text-red-400">
      {message}
    </p>
  );
}

function Field({
  id,
  name,
  label,
  placeholder,
  defaultValue,
  error,
  type = "text",
  autoComplete,
}: {
  id: string;
  name: string;
  label: string;
  placeholder: string;
  defaultValue?: string;
  error?: string;
  type?: string;
  autoComplete?: string;
}) {
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        defaultValue={defaultValue}
        autoComplete={autoComplete}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cn(fieldBase, error && "border-red-500/70")}
      />
      <FieldError id={`${id}-error`} message={error} />
    </div>
  );
}
