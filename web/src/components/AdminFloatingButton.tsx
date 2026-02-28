import { Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { useAdmin } from "@/hooks/useAdmin";
import { motion, AnimatePresence } from "framer-motion";

export const AdminFloatingButton = () => {
  const { isAdmin, loading } = useAdmin();

  if (loading || !isAdmin) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <Link
          to="/admin"
          className="flex items-center justify-center w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary/90 transition-all duration-300 hover:scale-110"
          title="Admin Panel"
        >
          <Settings className="w-6 h-6" />
        </Link>
      </motion.div>
    </AnimatePresence>
  );
};
