import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 hidden md:block fixed inset-y-0 z-50">
        <AdminSidebar />
      </aside>
      <main className="flex-1 md:pl-64">
        <div className="container py-6 px-4 md:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}
