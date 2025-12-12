export default function ConfirmPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-black mb-4">¡Cuenta verificada! ✅</h1>
      <p className="text-sm text-neutral-600 text-center max-w-md">
        Tu correo ha sido confirmado exitosamente. Ahora ya puedes iniciar sesión en Eden.
      </p>

      <a
        href="/"
        className="mt-6 rounded-xl bg-black px-5 py-2 text-xs font-semibold text-white hover:bg-black/90"
      >
        Volver al inicio
      </a>
    </main>
  );
}
