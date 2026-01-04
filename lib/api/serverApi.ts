import { api} from "./api";
import { Note }from "@/types/note";
import { User } from "@/types/user";
type CookiesParam = { cookies?: string };


export async function checkSession({ cookies }: CookiesParam = {}): Promise<User | null> {
  const res = await api.get<User | null>("/auth/session", {
    headers: cookies ? { cookie: cookies } : undefined,
  });
  return res.data ?? null;
}

export async function getMe({ cookies }: CookiesParam = {}): Promise<User> {
  const res = await api.get<User>("/users/me", {
    headers: cookies ? { cookie: cookies } : undefined,
  });
  return res.data;
}

export async function fetchNotes(params?: Record<string, any>, { cookies }: CookiesParam = {}): Promise<Note[]> {
  const res = await api.get<Note[]>("/notes", {
    params,
    headers: cookies ? { cookie: cookies } : undefined,
  });
  return res.data;
}

export async function fetchNoteById(id: string, { cookies }: CookiesParam = {}): Promise<Note> {
  const res = await api.get<Note>(`/notes/${id}`, {
    headers: cookies ? { cookie: cookies } : undefined,
  });
  return res.data;
}