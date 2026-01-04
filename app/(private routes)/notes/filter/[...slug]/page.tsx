import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import type { Metadata } from "next";
import { fetchNotes } from "@/lib/api/serverApi";
import NotesClient from "./Notes.client";
import { NoteTag } from "@/types/note";

export default async function NotesPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug } = await params;

  const tag = slug?.[0] && slug[0] !== "all" ? (slug[0] as NoteTag) : undefined;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", { tag: tag ?? "all" }],
    queryFn: () =>
      fetchNotes({ tag, page: 1 }, { cookies: cookieStore.toString() }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={tag ?? "all"} />
    </HydrationBoundary>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const filter = slug?.[0] ?? "All";

  const title = `Note Hub — Notes (${filter})`;
  const description = `Note Hub: listing notes filtered by '${filter}'.`;
  const url = `https://08-zustand-iota-sage.vercel.app/notes/filter/${filter}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          alt: `Note Hub - ${filter}`,
        },
      ],
    },
  };
}
