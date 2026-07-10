import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "../supabase-server-auth";
import { cerrarSesion } from "../actions";
import "../admin.css";

export default async function ProtectedAdminLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");

  return (
    <div className="lr-admin">
      <header className="lr-admin-top">
        <div className="lr-admin-brand">
          Panel · Luz Roja <span className="lr-admin-user">{user.email}</span>
        </div>
        <nav className="lr-admin-nav">
          <Link href="/admin">Productos</Link>
          <Link href="/admin/nuevo">Nuevo</Link>
          <form action={cerrarSesion}>
            <button type="submit" className="lr-admin-link">
              Salir
            </button>
          </form>
        </nav>
      </header>
      <main className="lr-admin-main">{children}</main>
    </div>
  );
}
