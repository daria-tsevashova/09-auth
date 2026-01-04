"use client";

import Modal from "@/components/Modal/Modal";
import { useRouter } from "next/navigation";
import css from "./NotePreview.module.css";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { fetchNoteById } from "@/lib/api/clientApi";
import Loader from "@/components/Loader/Loader";
import ErrorMessage from "@/components/ErrorMessage/ErrorMessage";

export default function NotePreviewClient() {
  const router = useRouter();
  const close = () => router.back();
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
    <>
      <Modal onClose={close}>
        <button className={css.backBtn} onClick={close}>
          Close
        </button>
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
      </Modal>
    </>
  );
}
