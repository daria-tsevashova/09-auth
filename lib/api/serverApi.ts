import { api } from "./api";
import { Note } from "@/types/note";
import { User } from "@/types/user";
import type { AxiosResponse } from "axios";
import { cookies } from "next/headers";

type CookiesParam = { cookies?: string };

export async function checkSession({ cookies }: CookiesParam = {}): Promise<
  AxiosResponse<User | null>
> {
  const res = await api.get<User | null>("/auth/session", {
    headers: cookies ? { cookie: cookies } : undefined,
  });
  return res;
}

export async function getMe(): Promise<User> {
  const cookieStore = await cookies();
  const cookieString = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");
  
  const res = await api.get<User>("/users/me", {
    headers: { cookie: cookieString },
  });
  return res.data;
}

export async function fetchNotes(
  params?: { search?: string; page?: number; tag?: string },
  { cookies }: CookiesParam = {}
): Promise<Note[]> {
  const res = await api.get<Note[]>("/notes", {
    params,
    headers: cookies ? { cookie: cookies } : undefined,
  });
  return res.data;
}

export async function fetchNoteById(
  id: string,
  { cookies }: CookiesParam = {}
): Promise<Note> {
  const res = await api.get<Note>(`/notes/${id}`, {
    headers: cookies ? { cookie: cookies } : undefined,
  });
  return res.data;
}
