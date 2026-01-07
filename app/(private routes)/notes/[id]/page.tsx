import { fetchNoteById } from "@/lib/api/serverApi";
import type { Metadata } from "next";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import NoteDetails from "./NoteDetails.client";

interface NotesDetailsProps {
  params: Promise<{ id: string }>;
}

const NotesDetails = async ({ params }: NotesDetailsProps) => {
  const { id } = await params;
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetails />
    </HydrationBoundary>
  );
};

export default NotesDetails;

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const { id } = params;

  try {
    const note = await fetchNoteById(id);
    const title = note?.title ?? `Note ${id}`;
    const description =
      (note?.content && note.content.slice(0, 160).trim()) ||
      "No description available.";
    const url = `https://08-zustand-iota-sage.vercel.app/notes/${id}`;

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
            alt: title,
          },
        ],
      },
    };
  } catch {
    return {
      title: "Note Hub — Note",
      description: "Note details could not be loaded.",
      openGraph: {
        title: "Note Hub — Note",
        description: "Note details could not be loaded.",
        url: `https://08-zustand-iota-sage.vercel.app/notes/${params.id}`,
        images: [
          {
            url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
            alt: "Note Hub",
          },
        ],
      },
    };
  }
}
