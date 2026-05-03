"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { HtmlResume } from "../../(dashboard)/resume-builder/components/html-resume";
import { ResumeContent } from "@/types/resume";

export default function ResumePreviewPage() {
  const params = useParams();
  const [data, setData] = useState<ResumeContent | null>(null);

  useEffect(() => {
    // Inject fonts into the iframe
    const style = document.createElement("style");
    style.innerHTML = `
      @font-face {
        font-family: 'Calibri';
        src: url('/fonts/calibri.ttf') format('truetype');
      }
      @font-face {
        font-family: 'Georgia';
        src: url('/fonts/georgia.ttf') format('truetype');
      }
      @font-face {
        font-family: 'Times New Roman';
        src: url('/fonts/times.ttf') format('truetype');
      }
      @font-face {
        font-family: 'Helvetica';
        src: url('/fonts/helvetica.ttf') format('truetype');
      }
      
      .font-serif { font-family: 'Times New Roman', serif; }
      .font-sans { font-family: 'Helvetica', sans-serif; }
      .font-calibri { font-family: 'Calibri', sans-serif; }
      .font-georgia { font-family: 'Georgia', serif; }
    `;
    document.head.appendChild(style);

    // Listen for messages from the parent window
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === "UPDATE_RESUME") {
        setData(event.data.data);
      }
    };

    window.addEventListener("message", handleMessage);

    // Also send a "READY" message so the parent knows it can start sending data
    window.parent.postMessage({ type: "PREVIEW_READY" }, "*");

    return () => window.removeEventListener("message", handleMessage);
  }, []);

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 font-sans">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <p className="text-sm font-medium text-slate-500">
            Menyiapkan Preview...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-8 print:p-0">
      <div id="resume-root" className="mx-auto">
        <HtmlResume data={data} />
      </div>
    </div>
  );
}
