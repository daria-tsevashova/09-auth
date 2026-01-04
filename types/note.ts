export interface Note {
  id: string;
  title: string;
  content: string;
  tag: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNoteData {
  title: string;
  content: string;
  tag: string;
}

export type NoteTag = "Todo" | "Work" | "Personal" | "Shopping" | "Meeting";

export const tags: NoteTag[] = [
  "Todo",
  "Work",
  "Personal",
  "Shopping",
  "Meeting",
];
