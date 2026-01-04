import { tags } from "@/types/note";
import type { Metadata } from "next";
import css from "./CreateNote.module.css";
import NoteForm from "@/components/NoteForm/NoteForm";

const CreateNote = async () => {
  const categories = tags; // ["Todo","Work",...]

  return (
    <main className={css.main}>
      <div className={css.container}>
        <h1 className={css.title}>Create note</h1>
        <NoteForm />
      </div>
    </main>
  );
};

export default CreateNote;

export const metadata: Metadata = {
  title: "Note Hub — Create Note",
  description: "Create a new note in Note Hub. Add title, content and tag.",
  openGraph: {
    title: "Note Hub — Create Note",
    description: "Create a new note in Note Hub. Add title, content and tag.",
    url: "https://08-zustand-iota-sage.vercel.app/notes/action/create",
    images: [
      {
        url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
        alt: "Note Hub - Create Note",
      },
    ],
  },
};
