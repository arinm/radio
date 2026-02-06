import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col items-center justify-center px-4 py-32 text-center">
      <h1 className="text-6xl font-bold text-foreground">404</h1>
      <p className="mt-4 text-xl text-muted-foreground">
        Pagina cautata nu a fost gasita.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        Inapoi la pagina principala
      </Link>
    </div>
  );
}
