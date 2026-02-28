import { Outlet } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { LanguageModal } from "@/components/LanguageModal";
import { ScrollToTop } from "@/components/ScrollToTop";
import { AdminFloatingButton } from "@/components/AdminFloatingButton";

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <LanguageModal />
      <ScrollToTop />
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <AdminFloatingButton />
    </div>
  );
};

export default Layout;