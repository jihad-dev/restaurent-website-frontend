/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo } from "react";
import {
  FiSearch,
  FiEye,
  FiTrash2,
  FiUserPlus,
  FiShield,
  FiUserCheck,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import Loader from "../../utils/Loader";
import Swal from "sweetalert2";
import {
  useDeleteAdminMutation,
  useGetAllAdminsQuery,
} from "../../Redux/features/admin/adminApi";

interface Admin {
  _id: string;
  avatar?: string;
  name: string;
  email: string;
  role?: string;
  status?: string;
}

// ---------------- ⚡ ANIMATION VARIANTS ----------------
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" },
  },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
};

const AllAdmin = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: adminsData, isLoading } = useGetAllAdminsQuery(undefined, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });
  const [deleteAdmin] = useDeleteAdminMutation();

  // RTK Query response safety & optimized filtering
  const filteredAdmins = useMemo(() => {
    const rawData = Array.isArray(adminsData)
      ? adminsData
      : (adminsData as any)?.data || (adminsData as any)?.result || [];

    const query = searchTerm.toLowerCase().trim();
    if (!query) return rawData;

    return rawData.filter(
      (admin: Admin) =>
        admin.name?.toLowerCase().includes(query) ||
        admin.email?.toLowerCase().includes(query),
    );
  }, [adminsData, searchTerm]);

  // SweetAlert Dark Theme Delete Modal
  const handleDelete = async (admin: Admin) => {
    const result = await Swal.fire({
      title: "Delete Admin Account?",
      text: `Are you sure you want to revoke access for ${admin.name}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
      background: "#0f172a", // slate-900
      color: "#f8fafc", // slate-50
      confirmButtonColor: "#f97316", // orange-500
      cancelButtonColor: "#334155", // slate-700
      customClass: {
        popup:
          "rounded-3xl border border-slate-800 shadow-2xl backdrop-blur-xl",
        title: "text-xl font-black text-white",
        htmlContainer: "text-slate-400 text-sm",
        confirmButton: "px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg",
        cancelButton: "px-5 py-2.5 rounded-xl font-bold text-sm",
      },
    });

    if (result.isConfirmed) {
      try {
        await deleteAdmin(admin._id).unwrap();
        Swal.fire({
          title: "Account Removed",
          text: `${admin.name}'s account has been successfully deleted.`,
          icon: "success",
          background: "#0f172a",
          color: "#f8fafc",
          confirmButtonColor: "#f59e0b",
          customClass: {
            popup: "rounded-3xl border border-slate-800 shadow-2xl",
            title: "text-xl font-black text-white",
            htmlContainer: "text-slate-400 text-sm",
            confirmButton: "px-5 py-2.5 rounded-xl font-bold text-sm",
          },
        });
      } catch (error: any) {
        const errorMessage =
          error?.data?.message || "An error occurred while deleting the admin.";
        Swal.fire({
          title: "Action Failed",
          text: errorMessage,
          icon: "error",
          background: "#0f172a",
          color: "#f8fafc",
          confirmButtonColor: "#ef4444",
          customClass: {
            popup: "rounded-3xl border border-slate-800 shadow-2xl",
            title: "text-xl font-black text-white",
            htmlContainer: "text-slate-400 text-sm",
          },
        });
      }
    }
  };

  if (isLoading) return <Loader />;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 selection:bg-amber-500 selection:text-slate-950">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-3xl border border-slate-800 backdrop-blur-xl shadow-2xl">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
              <FiShield className="w-3.5 h-3.5" />
              Staff Privileges
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              All Administrators
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-400">
              Manage permissions, roles, and administrative accounts
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search Bar */}
            <div className="relative min-w-[260px]">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <FiSearch className="w-4 h-4" />
              </div>
              <input
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search administrator..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950/60 border border-slate-800 rounded-2xl text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:border-amber-500/80 focus:ring-1 focus:ring-amber-500/80 transition-all"
              />
            </div>

            {/* Add New Button */}
            <Link to="/dashboard/admin/create-admin">
              <motion.button
                whileTap={{ scale: 0.96 }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-extrabold px-5 py-2.5 rounded-2xl shadow-lg shadow-amber-500/20 active:scale-95 transition-all text-sm cursor-pointer"
              >
                <FiUserPlus className="w-4 h-4" />
                <span>Add New Admin</span>
              </motion.button>
            </Link>
          </div>
        </div>

        {/* Content Section */}
        {filteredAdmins.length === 0 ? (
          <div className="bg-slate-900/40 rounded-3xl p-12 border border-slate-800/80 text-center">
            <FiShield className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-300">
              No Administrators Found
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              Try adjusting your search query or add a new admin account.
            </p>
          </div>
        ) : (
          <>
            {/* Desktop View (Tables) */}
            <div className="hidden md:block bg-slate-900/80 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden backdrop-blur-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-950/40 text-xs font-bold uppercase tracking-wider text-slate-400">
                      <th className="px-6 py-4">Administrator</th>
                      <th className="px-6 py-4">Role</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <motion.tbody
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="divide-y divide-slate-800/60 text-sm"
                  >
                    <AnimatePresence>
                      {filteredAdmins.map((admin: Admin) => (
                        <motion.tr
                          key={admin._id}
                          variants={itemVariants}
                          exit="exit"
                          layout
                          className="hover:bg-slate-800/30 transition-colors group"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3.5">
                              {admin.avatar ? (
                                <img
                                  src={admin.avatar}
                                  alt={admin.name}
                                  className="w-10 h-10 rounded-xl object-cover border border-slate-700"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-black text-base">
                                  {admin.name?.charAt(0).toUpperCase() || "A"}
                                </div>
                              )}
                              <div>
                                <div className="font-bold text-slate-100 group-hover:text-amber-400 transition-colors">
                                  {admin.name}
                                </div>
                                <div className="text-xs text-slate-400">
                                  {admin.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20">
                              <FiShield className="w-3 h-3" />
                              {admin.role || "Admin"}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              <FiUserCheck className="w-3 h-3" />
                              {admin.status || "Active"}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Link
                                to={`/dashboard/customers/${admin._id}`}
                                className="p-2 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-xl transition-all"
                                title="View Details"
                              >
                                <FiEye className="w-4 h-4" />
                              </Link>
                              <button
                                onClick={() => handleDelete(admin)}
                                className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-xl transition-all cursor-pointer"
                                title="Delete Admin"
                              >
                                <FiTrash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </motion.tbody>
                </table>
              </div>
            </div>

            {/* Mobile View (Cards) */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 gap-4 md:hidden"
            >
              <AnimatePresence>
                {filteredAdmins.map((admin: Admin) => (
                  <motion.div
                    key={admin._id}
                    variants={itemVariants}
                    exit="exit"
                    layout
                    className="bg-slate-900/80 rounded-3xl p-5 border border-slate-800 backdrop-blur-xl shadow-lg space-y-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        {admin.avatar ? (
                          <img
                            src={admin.avatar}
                            alt={admin.name}
                            className="w-12 h-12 rounded-2xl object-cover border border-slate-700"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-black text-lg">
                            {admin.name?.charAt(0).toUpperCase() || "A"}
                          </div>
                        )}
                        <div>
                          <h3 className="font-bold text-white text-base">
                            {admin.name}
                          </h3>
                          <p className="text-xs text-slate-400 truncate max-w-[180px]">
                            {admin.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        {admin.role || "Admin"}
                      </span>
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {admin.status || "Active"}
                      </span>
                    </div>

                    <div className="flex items-center justify-end gap-2 border-t border-slate-800/80 pt-3">
                      <Link
                        to={`/dashboard/admin/admin-info/${admin._id}`}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-bold text-slate-300 bg-slate-950/60 hover:bg-slate-800 border border-slate-800 rounded-xl transition-all"
                      >
                        <FiEye className="w-3.5 h-3.5 text-amber-400" />
                        View Info
                      </Link>
                      <button
                        onClick={() => handleDelete(admin)}
                        className="p-2 text-rose-400 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 rounded-xl transition-all cursor-pointer"
                        title="Delete Admin"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
};

export default AllAdmin;
