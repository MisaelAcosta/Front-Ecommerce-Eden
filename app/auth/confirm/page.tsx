// app/auth/confirm/page.tsx
import Link from "next/link";

export default function ConfirmPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-2xl font-bold">Cuenta confirmada</h1>
      <p>Tu cuenta fue confirmada correctamente.</p>

      <Link
        href="/"
        className="text-blue-600 underline font-semibold"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
