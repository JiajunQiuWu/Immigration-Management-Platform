"use client";

import { FormEvent, useState } from "react";
import axios from "axios";
import { LoaderCircle, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { api } from "@/lib/api";

export interface NewProcedureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void | Promise<void>;
}

export function NewProcedureModal({
  isOpen,
  onClose,
  onSuccess,
}: NewProcedureModalProps) {
  const t = useTranslations("dashboard");
  const [procedureCode, setProcedureCode] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await api.post("/user/procedures", {
        procedureCode,
        ...(appointmentDate && {
          appointmentDate: new Date(`${appointmentDate}T00:00:00`).toISOString(),
        }),
        ...(notes && { notes }),
      });

      await onSuccess();
      setProcedureCode("");
      setAppointmentDate("");
      setNotes("");
      onClose();
    } catch (requestError: unknown) {
      if (axios.isAxiosError(requestError)) {
        const serverMessage = requestError.response?.data?.message;
        const readableMessage = Array.isArray(serverMessage)
          ? serverMessage.join(" ")
          : typeof serverMessage === "string"
            ? serverMessage
            : null;

        if (requestError.response?.status === 400) {
          setError(readableMessage || t("validationError"));
        } else if (requestError.response?.status === 401) {
          setError(readableMessage || t("unauthorizedError"));
        } else if (!requestError.response) {
          setError(t("networkError"));
        } else {
          setError(readableMessage || t("createError"));
        }
      } else {
        setError(t("createError"));
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-[#102d2b]/55 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="procedure-modal-title"
        className="max-h-[92vh] w-full overflow-y-auto rounded-t-2xl bg-white p-5 text-[#173d3b] shadow-2xl sm:max-w-xl sm:rounded-2xl sm:p-7"
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 id="procedure-modal-title" className="font-serif text-2xl">
            {t("newProcedure")}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-[#71847b] hover:bg-[#f4f6f2] hover:text-[#173d3b]"
            aria-label={t("cancel")}
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block text-sm font-semibold" htmlFor="procedure-code">
            {t("procedureCode")}
            <input
              id="procedure-code"
              required
              maxLength={100}
              value={procedureCode}
              onChange={(event) => setProcedureCode(event.target.value)}
              placeholder={t("procedurePlaceholder")}
              className="mt-2 h-12 w-full rounded-xl border border-[#d6dfd8] px-4 font-normal outline-none focus:border-[#d9a441] focus:ring-4 focus:ring-[#d9a441]/15"
            />
          </label>
          <label className="block text-sm font-semibold" htmlFor="appointment-date">
            {t("appointmentDate")}
            <input
              id="appointment-date"
              type="date"
              value={appointmentDate}
              onChange={(event) => setAppointmentDate(event.target.value)}
              className="mt-2 h-12 w-full rounded-xl border border-[#d6dfd8] px-4 font-normal outline-none focus:border-[#d9a441] focus:ring-4 focus:ring-[#d9a441]/15"
            />
          </label>
          <label className="block text-sm font-semibold" htmlFor="procedure-notes">
            {t("notes")}
            <textarea
              id="procedure-notes"
              maxLength={5000}
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder={t("notesPlaceholder")}
              rows={3}
              className="mt-2 w-full resize-none rounded-xl border border-[#d6dfd8] px-4 py-3 font-normal outline-none focus:border-[#d9a441] focus:ring-4 focus:ring-[#d9a441]/15"
            />
          </label>
          {error && (
            <p role="alert" className="rounded-lg bg-[#fce9e3] px-4 py-3 text-sm text-[#a33f2d]">
              {error}
            </p>
          )}
          <div className="flex justify-end gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-3 text-sm font-semibold text-[#52665f] hover:bg-[#f4f6f2]"
            >
              {t("cancel")}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 rounded-xl bg-[#d9a441] px-5 py-3 text-sm font-semibold text-[#173d3b] disabled:opacity-60"
            >
              {isSubmitting && (
                <LoaderCircle className="animate-spin" size={16} aria-hidden="true" />
              )}
              {isSubmitting ? t("creating") : t("create")}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
