"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { toast } from "sonner";
import {
  updateCoverLetterAction,
} from "@/features/cover-letter-builder/actions";
import { CoverLetterBuilderData } from "@/features/cover-letters-list/schema";

const DEFAULT_CONTENT: CoverLetterBuilderData = {
  fullName: "",
  phone: "",
  email: "",
  address: "",
  cityAndPostal: "",
  recipientName: "",
  companyName: "",
  department: "",
  recipientAddress: "",
  recipientCityAndPostal: "",
  subject: "",
  content: "",
};

export function useCoverLetterBuilder(
  id?: string,
  initialContent?: Partial<CoverLetterBuilderData>,
) {
  const [content, setContent] = useState<CoverLetterBuilderData>({
    ...DEFAULT_CONTENT,
    ...initialContent,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const contentRef = useRef(content);
  const isDirtyRef = useRef(isDirty);

  useEffect(() => {
    contentRef.current = content;
  }, [content]);

  useEffect(() => {
    isDirtyRef.current = isDirty;
  }, [isDirty]);

  // Sync to localStorage
  useEffect(() => {
    if (id && isDirty && typeof window !== "undefined") {
      const timer = setTimeout(() => {
        localStorage.setItem(
          `cover-letter-draft-${id}`,
          JSON.stringify({
            content,
            updatedAt: new Date().toISOString(),
          }),
        );
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [content, isDirty, id]);

  const updateContent = useCallback(
    (update: Partial<CoverLetterBuilderData>) => {
      setContent((prev) => ({ ...prev, ...update }));
      setIsDirty(true);
    },
    [],
  );

  const save = useCallback(
    async (idToSave?: string, title?: string) => {
      const activeId = idToSave || id;
      if (!activeId || !isDirtyRef.current) return;

      setIsSaving(true);
      try {
        const result = await updateCoverLetterAction(activeId, {
          content: contentRef.current,
          title: title,
        });

        setIsDirty(false);
        if (typeof window !== "undefined") {
          localStorage.removeItem(`cover-letter-draft-${activeId}`);
        }
        return result;
      } catch (error) {
        console.error("Save error:", error);
        toast.error("Gagal menyimpan cover letter");
        return false;
      } finally {
        setIsSaving(false);
      }
    },
    [id],
  );

  return {
    content,
    isSaving,
    isDirty,
    updateContent,
    save,
    setContent,
    setIsDirty,
    contentRef,
    isDirtyRef,
  };
}
