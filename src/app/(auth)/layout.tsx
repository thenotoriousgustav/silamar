export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="bg-surface-950 min-h-dvh">{children}</div>;
}
