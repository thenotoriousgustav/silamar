"use client";

import React, { useMemo } from "react";

import { CoverLetterBuilderData } from "@/features/cover-letter-builder/types/cover-letter-content";

interface HtmlCoverLetterProps {
  data: Partial<CoverLetterBuilderData>;
}

const A4_HEIGHT = 1123;
const PAGE_PADDING = 100; // 50px top + 50px bottom
const _CONTENT_HEIGHT_LIMIT = A4_HEIGHT - PAGE_PADDING;

export function HtmlCoverLetter({ data }: HtmlCoverLetterProps) {
  const {
    fullName,
    phone,
    email,
    address,
    cityAndPostal,
    recipientName,
    companyName,
    department,
    recipientAddress,
    recipientCityAndPostal,
    subject,
    content,
  } = data;

  const pages = useMemo(() => {
    const pageContents: React.ReactNode[] = [];

    // Full cover letter as a single page
    const Header = (
      <div className="mb-10">
        <div className="mb-8 text-right">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 uppercase">
            {fullName || "NAMA ANDA"}
          </h1>
          <div className="mt-1 text-[11px] leading-relaxed text-gray-500">
            {address && <div>{address}</div>}
            {cityAndPostal && <div>{cityAndPostal}</div>}
            {email && <div>{email}</div>}
            {phone && <div>{phone}</div>}
          </div>
        </div>

        <div className="mb-8">
          <div className="mb-4 text-[11px] text-gray-500">
            {new Date().toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </div>
          <div className="text-[11px] font-bold text-gray-900">
            {recipientName || "Nama Penerima"}
          </div>
          <div className="text-[11px] leading-relaxed text-gray-600">
            {department && <div>{department}</div>}
            {companyName && <div className="font-semibold">{companyName}</div>}
            {recipientAddress && <div>{recipientAddress}</div>}
            {recipientCityAndPostal && <div>{recipientCityAndPostal}</div>}
          </div>
        </div>

        {subject && (
          <div className="mb-8">
            <div className="text-[11px] font-bold text-gray-900 uppercase">
              Perihal: {subject}
            </div>
          </div>
        )}

        <div className="text-justify text-[11px] leading-loose whitespace-pre-wrap text-gray-800">
          {content || "Tulis isi surat lamaran Anda di sini..."}
        </div>

        <div className="mt-12">
          <div className="mb-10 text-right text-[11px] text-gray-600">
            Hormat saya,
          </div>
          <div className="text-right text-[11px] font-bold text-gray-900">
            {fullName || "Nama Anda"}
          </div>
        </div>
      </div>
    );

    pageContents.push(Header);
    return pageContents;
  }, [data]);

  return (
    <div className="flex flex-col items-center gap-10 pb-10 font-serif">
      {pages.map((pageContent, idx) => (
        <div
          key={idx}
          className="relative min-h-280.75 w-198.5 bg-white p-12.5 text-gray-900 shadow-2xl transition-all"
        >
          <div className="relative z-10 h-full w-full">{pageContent}</div>
          {pages.length > 1 && (
            <div className="absolute right-0 bottom-6 left-0 flex items-center justify-center">
              <div className="flex h-6 w-12 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-400">
                {idx + 1}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
