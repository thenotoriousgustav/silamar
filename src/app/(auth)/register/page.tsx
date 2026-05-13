import type { Metadata } from "next";

import { RegisterPageClient } from "./register-page-client";

export const metadata: Metadata = {
  title: "Daftar",
  description: "Buat akun SiLamar gratis dan mulai buat resume ATS-friendly",
};

export default function RegisterPage() {
  return <RegisterPageClient />;
}
