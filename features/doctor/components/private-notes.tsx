"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Lock } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { FormError, FormField } from "@/features/auth/components/form-field";

import { addPrivateNoteAction } from "../actions";
import { TEXTAREA_CLASS, formatDateTime } from "../constants";
import { noteSchema, type NoteFormValues } from "../schemas";
import type { PrivateNote } from "../types";

export function PrivateNotes({
  id,
  notes,
}: {
  id: string;
  notes: PrivateNote[];
}) {
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NoteFormValues>({
    resolver: zodResolver(noteSchema),
    defaultValues: { content: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null);
    const result = await addPrivateNoteAction(id, values);
    if (!result.ok) return setServerError(result.message);
    toast.success("Private note added.");
    reset();
  });

  return (
    <div className="flex flex-col gap-4">
      <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Lock aria-hidden className="size-3" />
        Never visible to the patient.
      </p>

      {notes.length === 0 ? (
        <p className="text-sm text-muted-foreground">No private notes yet.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {notes.map((n) => (
            <li key={n.id} className="rounded-[10px] bg-muted p-3">
              <p className="text-sm whitespace-pre-wrap text-foreground">
                {n.content}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {formatDateTime(n.createdAt)}
              </p>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-3">
        <FormField
          label="New note"
          htmlFor="note"
          error={errors.content?.message}
        >
          <textarea
            id="note"
            rows={3}
            placeholder="Write a private note..."
            className={TEXTAREA_CLASS}
            {...register("content")}
          />
        </FormField>
        <FormError message={serverError} />
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-[38px] px-4"
          >
            {isSubmitting && <Loader2 className="animate-spin" />}
            Add note
          </Button>
        </div>
      </form>
    </div>
  );
}
