import { ReactNode } from 'react';
import AdminSidebar from './AdminSidebar';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;