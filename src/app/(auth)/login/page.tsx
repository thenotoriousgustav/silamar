import type { Metadata } from "next";

import { LoginPageClient } from "./login-page-client";

export const metadata: Metadata = {
  title: "Masuk",
  description: "Masuk ke akun SiLamar kamu dan lanjutkan perjalanan karier",
};

export default function LoginPage() {
  return <LoginPageClient />;
}
