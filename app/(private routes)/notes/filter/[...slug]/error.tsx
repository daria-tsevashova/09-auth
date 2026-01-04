"use client";

export default function NotesError({ error }: { error: Error }) {
  return (
    <div>
      <p>Could not fetch the list of notes. {error.message}</p>
    </div>
  );
}
