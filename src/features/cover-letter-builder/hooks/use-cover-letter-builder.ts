"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { updateCoverLetterAction } from "@/features/cover-letter-builder/actions/update-cover-letter";
import type { CoverLetterBuilderData } from "@/features/cover-letter-builder/types/cover-letter-content";

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

  const updateStyle = useCallback(
    (styleUpdate: Partial<CoverLetterBuilderData["style"]>) => {
      setContent((prev) => ({
        ...prev,
        style: {
          ...prev.style,
          ...styleUpdate,
        } as CoverLetterBuilderData["style"],
      }));
      setIsDirty(true);
    },
    [],
  );

  const save = useCallback(
    async (idToSave?: string, title?: string) => {
      const activeId = idToSave || id;
      if (!activeId || !isDirtyRef.current) return null;

      setIsSaving(true);
      try {
        const result = await updateCoverLetterAction(activeId, {
          content: contentRef.current,
          title: title,
        });

        if (result.success) {
          setIsDirty(false);
          if (typeof window !== "undefined") {
            localStorage.removeItem(`cover-letter-draft-${activeId}`);
          }
          return result.data;
        } else {
          toast.error(result.error);
          return null;
        }
      } catch (error) {
        console.error("Save error:", error);
        toast.error("Gagal menyimpan cover letter");
        return null;
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
    updateStyle,
    save,
    setContent,
    setIsDirty,
    contentRef,
    isDirtyRef,
  };
}
