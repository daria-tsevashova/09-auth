"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { fetchNoteById } from "@/lib/api/clientApi";
import Loader from "@/components/Loader/Loader";
import ErrorMessage from "@/components/ErrorMessage/ErrorMessage";
import css from "./page.module.css";

export default function NoteDetails() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, error } = useQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });

  if (isLoading) return <Loader />;
  if (error) return <ErrorMessage />;
  if (!data) return null;

  return (
    <div className={css.container}>
      <div className={css.item}>
        <div className={css.header}>
          <h2>{data.title}</h2>
          <span className={css.tag}>{data.tag}</span>
        </div>
        <p className={css.content}>{data.content}</p>
        <p className={css.date}>
          Created: {new Date(data.createdAt).toLocaleString()}
        </p>{" "}
      </div>
    </div>
  );
}
