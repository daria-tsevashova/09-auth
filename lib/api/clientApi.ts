import { api } from "./api";
import { User } from "@/types/user";
import { Note, CreateNoteData } from "@/types/note";

// Auth
export type LoginRequest = { email: string; password: string };

export async function login(payload: LoginRequest): Promise<User> {
  const res = await api.post<User>("/auth/login", payload);
  return res.data;
}

export async function logout(): Promise<void> {
  const res = await api.post("/auth/logout");
  if (res.status >= 400) {
    throw new Error("Logout failed");
  }
}

export async function checkSession(): Promise<User | null> {
  const res = await api.get<User | null>("/auth/session");
  return res.data ?? null;
}

export type RegisterRequest = {
  email: string;
  password: string;
};

export async function register(payload: RegisterRequest): Promise<User> {
  const res = await api.post<User>("/auth/register", payload);
  return res.data;
}

// User Profile
export async function getCurrentUser(): Promise<User> {
  const res = await api.get<User>("/users/me");
  return res.data;
}

export type UpdateUserRequest = {
  username?: string;
  avatar?: string;
};

export async function updateUserProfile(
  payload: UpdateUserRequest
): Promise<User> {
  const res = await api.patch<User>("/users/me", payload);
  return res.data;
}

// Notes
export type FetchNotesParams = {
  search?: string;
  page?: number;
  tag?: string;
};

export type FetchNotesResponse = {
  notes: Note[];
  totalPages: number;
};

export async function fetchNotes(
  params?: FetchNotesParams
): Promise<FetchNotesResponse> {
  const res = await api.get<FetchNotesResponse>("/notes", { params });
  return res.data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const res = await api.get<Note>(`/notes/${id}`);
  return res.data;
}

export async function createNote(payload: CreateNoteData): Promise<Note> {
  const res = await api.post<Note>("/notes", payload);
  return res.data;
}

export async function deleteNote(id: string): Promise<Note> {
  const res = await api.delete<Note>(`/notes/${id}`);
  if (res.status >= 400) {
    throw new Error("Delete failed");
  }
  return res.data;
}
