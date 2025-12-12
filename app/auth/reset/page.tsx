// app/auth/reset/page.tsx
import ResetPasswordForm from "./reset-password-form";

export default async function ResetPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string }>;
}) {
  const { code } = await searchParams;

  return (
    <main className="min-h-[70vh] px-4 py-10 flex items-center justify-center">
      <ResetPasswordForm code={code ?? ""} />
    </main>
  );
}
