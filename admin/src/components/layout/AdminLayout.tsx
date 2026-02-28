import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';

const AdminLayout = () => {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <Sidebar />
            <TopNavbar />
            <main className="ml-64 p-8 animate-in fade-in duration-300">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
