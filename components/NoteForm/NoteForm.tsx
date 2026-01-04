"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import css from "./NoteForm.module.css";
import { createNote } from "@/lib/api/clientApi";
import { useNoteDraftStore } from "@/lib/store/noteStore";
import type { CreateNoteData } from "@/types/note";

interface NoteFormProps {
  onClose?: () => void;
  formAction?: string;
}

const NoteForm = ({ onClose, formAction }: NoteFormProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const draft = useNoteDraftStore((s) => s.draft);
  const setDraft = useNoteDraftStore((s) => s.setDraft);
  const clearDraft = useNoteDraftStore((s) => s.clearDraft);

  const createMutation = useMutation({
    mutationFn: (data: CreateNoteData) => createNote(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      toast.success("Note created successfully!");
      clearDraft();
      router.back();
    },
    onError: () => {
      toast.error("Failed to create note");
    },
  });

  const onChangeField = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      const { name, value } = e.target;
      setDraft({ ...draft, [name]: value } as CreateNoteData);
    },
    [draft, setDraft]
  );

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (createMutation.isPending) return;
    // Ensure minimal validation
    if (!draft.title || draft.title.length < 3) {
      toast.error("Title must be at least 3 characters");
      return;
    }

    createMutation.mutate(draft);
  };

  const onCancel = () => {
    if (onClose) onClose();
    router.back();
  };

  return (
    <form className={css.form} method="post" onSubmit={onSubmit}>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          type="text"
          className={css.input}
          required
          minLength={3}
          maxLength={50}
          value={draft.title}
          onChange={onChangeField}
        />
        <span className={css.error} />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          rows={8}
          className={css.textarea}
          maxLength={500}
          value={draft.content}
          onChange={onChangeField}
        />
        <span className={css.error} />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          name="tag"
          className={css.select}
          value={draft.tag}
          required
          onChange={onChangeField}
        >
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
        <span className={css.error} />
      </div>

      <div className={css.actions}>
        <button type="button" className={css.cancelButton} onClick={onCancel}>
          Cancel
        </button>
        <button
          type="submit"
          className={css.submitButton}
          formAction={formAction ?? undefined}
          disabled={createMutation.isPending}
        >
          {createMutation.isPending ? "Creating..." : "Create note"}
        </button>
      </div>
    </form>
  );
};

export default NoteForm;
