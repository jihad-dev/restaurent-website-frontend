/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo, useEffect } from "react";
import {
  FiSearch,
  FiEye,
  FiTrash2,
  FiChevronLeft,
  FiChevronRight,
  FiUserCheck,
  FiUsers,
  FiDollarSign,
  FiTrendingUp,
  FiFilter,
  FiUserX,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import Loader from "../../utils/Loader";
import { Link } from "react-router-dom";
import {
  useDeleteUserMutation,
  useGetAllUsersQuery,
} from "../../Redux/features/admin/adminApi";
import Swal from "sweetalert2";

const Customers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const { data: usersResponse, isLoading } = useGetAllUsersQuery<any>(
    undefined,
    {
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
      refetchOnReconnect: true,
    },
  );

  const [deleteUser] = useDeleteUserMutation();

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus, sortBy]);

  const rawUsersList = useMemo(() => {
    if (Array.isArray(usersResponse)) return usersResponse;
    if (Array.isArray(usersResponse?.data)) return usersResponse.data;
    return [];
  }, [usersResponse]);

  const filteredCustomers = useMemo(() => {
    return rawUsersList
      .filter((customer: any) => {
        const name = customer?.name?.toLowerCase() || "";
        const email = customer?.email?.toLowerCase() || "";
        const query = searchTerm.toLowerCase();

        const matchesSearch = name.includes(query) || email.includes(query);
        const matchesStatus =
          filterStatus === "all" || customer?.status === filterStatus;

        return matchesSearch && matchesStatus;
      })
      .sort((a: any, b: any) => {
        switch (sortBy) {
          case "orders":
            return (b?.orders || 0) - (a?.orders || 0);
          case "spent":
            return (b?.totalSpent || 0) - (a?.totalSpent || 0);
          case "recent":
            return (
              new Date(b?.lastOrder || 0).getTime() -
              new Date(a?.lastOrder || 0).getTime()
            );
          default:
            return (a?.name || "").localeCompare(b?.name || "");
        }
      });
  }, [rawUsersList, searchTerm, filterStatus, sortBy]);

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage) || 1;
  const indexOfLastCustomer = currentPage * itemsPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - itemsPerPage;
  const currentCustomers = filteredCustomers.slice(
    indexOfFirstCustomer,
    indexOfLastCustomer,
  );

  const paginate = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleDelete = async (user: any) => {
    Swal.fire({
      title: "Delete Account",
      text: `Are you sure you want to delete ${user.name || "this user"}'s account? This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#334155",
      background: "#1e293b",
      color: "#f8fafc",
      customClass: {
        popup: "rounded-2xl shadow-xl border border-slate-700",
        title: "text-xl font-bold text-white",
        htmlContainer: "text-slate-300 text-sm",
        confirmButton: "px-5 py-2.5 text-sm font-semibold rounded-xl shadow-sm",
        cancelButton: "px-5 py-2.5 text-sm font-semibold rounded-xl",
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteUser(user._id).unwrap();
          Swal.fire({
            title: "Deleted!",
            text: `${user.name || "User"}'s account has been successfully deleted.`,
            icon: "success",
            confirmButtonColor: "#6366f1",
            background: "#1e293b",
            color: "#f8fafc",
            customClass: {
              popup: "rounded-2xl border border-slate-700",
              title: "text-xl font-bold text-white",
              confirmButton: "px-5 py-2.5 text-sm font-semibold rounded-xl",
            },
          });
        } catch (error: any) {
          const errorMessage =
            error?.data?.message ||
            "An error occurred while deleting the user.";
          Swal.fire({
            title: "Error",
            text: errorMessage,
            icon: "error",
            confirmButtonColor: "#ef4444",
            background: "#1e293b",
            color: "#f8fafc",
            customClass: {
              popup: "rounded-2xl border border-slate-700",
            },
          });
        }
      }
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  if (isLoading) {
    return <Loader />;
  }

  const totalUsersCount = rawUsersList.length;
  const activeUsersCount = rawUsersList.filter(
    (u: any) => u.status === "in-progress" || u.status === "active",
  ).length;
  const totalRevenue = rawUsersList.reduce(
    (acc: number, u: any) => acc + (u.totalSpent || 0),
    0,
  );
  const avgOrderValue =
    totalUsersCount > 0 ? totalRevenue / totalUsersCount : 0;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-[#0b1329] p-4 sm:p-6 md:p-8 text-slate-100"
    >
      <div className="max-w-[1400px] mx-auto space-y-6">
        {/* Banner Section */}
        <motion.div
          variants={itemVariants}
          className="relative overflow-hidden bg-[#131e3a] rounded-3xl p-6 sm:p-8 shadow-md border border-slate-800"
        >
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-40 h-40 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-2xl opacity-70 pointer-events-none" />
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs tracking-wider uppercase mb-1">
                <FiUsers className="w-4 h-4" /> Administrative Dashboard
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Customer Directory
              </h1>
              <p className="mt-1 text-sm text-slate-400 max-w-xl">
                Manage account access levels, review activity status, and
                perform administrative overrides across your user base.
              </p>
            </div>
            <div className="flex items-center gap-2 bg-[#0b1329] p-1.5 rounded-2xl border border-slate-800 text-xs font-semibold text-slate-300">
              <span className="px-3 py-1 bg-[#1e293b] rounded-xl shadow-xs text-indigo-400 border border-slate-700">
                {filteredCustomers.length} Filtered
              </span>
              <span className="px-3 py-1">{totalUsersCount} Total Records</span>
            </div>
          </div>
        </motion.div>

        {/* Dynamic Metric Cards */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {[
            {
              title: "Total Customers",
              value: totalUsersCount.toLocaleString(),
              icon: FiUsers,
              color: "text-indigo-400",
              bgColor: "bg-indigo-500/10",
            },
            {
              title: "Active Accounts",
              value: activeUsersCount.toLocaleString(),
              icon: FiUserCheck,
              color: "text-emerald-400",
              bgColor: "bg-emerald-500/10",
            },
            {
              title: "Total Lifetime Spend",
              value: `$${totalRevenue.toLocaleString()}`,
              icon: FiDollarSign,
              color: "text-blue-400",
              bgColor: "bg-blue-500/10",
            },
            {
              title: "Avg. Spend / User",
              value: `$${avgOrderValue.toFixed(2)}`,
              icon: FiTrendingUp,
              color: "text-purple-400",
              bgColor: "bg-purple-500/10",
            },
          ].map((stat, idx) => {
            const IconComponent = stat.icon;
            return (
              <motion.div
                key={idx}
                whileHover={{ y: -3 }}
                transition={{ duration: 0.2 }}
                className="bg-[#131e3a] p-5 rounded-2xl shadow-md border border-slate-800 flex items-center justify-between"
              >
                <div>
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                    {stat.title}
                  </p>
                  <h3 className="text-2xl font-bold text-white mt-1">
                    {stat.value}
                  </h3>
                </div>
                <div
                  className={`p-3 rounded-2xl ${stat.bgColor} ${stat.color}`}
                >
                  <IconComponent className="w-6 h-6" />
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Filter Controls Bar */}
        <motion.div
          variants={itemVariants}
          className="bg-[#131e3a] rounded-2xl p-4 shadow-md border border-slate-800 space-y-3 sm:space-y-0 sm:flex sm:items-center sm:gap-4"
        >
          <div className="relative flex-1">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by name or email address..."
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-[#0b1329] border border-slate-700/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all placeholder:text-slate-500 text-slate-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <select
                className="w-full sm:w-auto appearance-none py-2.5 pl-4 pr-10 text-sm bg-[#0b1329] border border-slate-700/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 text-slate-200 font-medium cursor-pointer"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="name" className="bg-[#131e3a]">
                  Sort by Name (A-Z)
                </option>
                <option value="orders" className="bg-[#131e3a]">
                  Sort by Order Volume
                </option>
                <option value="spent" className="bg-[#131e3a]">
                  Sort by Highest Spent
                </option>
                <option value="recent" className="bg-[#131e3a]">
                  Sort by Last Activity
                </option>
              </select>
              <FiFilter className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none w-4 h-4" />
            </div>

            <div className="relative">
              <select
                className="w-full sm:w-auto appearance-none py-2.5 pl-4 pr-10 text-sm bg-[#0b1329] border border-slate-700/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 text-slate-200 font-medium cursor-pointer"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all" className="bg-[#131e3a]">
                  All Statuses
                </option>
                <option value="in-progress" className="bg-[#131e3a]">
                  In-Progress
                </option>
                <option value="active" className="bg-[#131e3a]">
                  Active
                </option>
                <option value="inactive" className="bg-[#131e3a]">
                  Inactive
                </option>
                <option value="blocked" className="bg-[#131e3a]">
                  Blocked
                </option>
              </select>
              <FiFilter className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none w-4 h-4" />
            </div>
          </div>
        </motion.div>

        {/* Data Table */}
        <motion.div
          variants={itemVariants}
          className="bg-[#131e3a] rounded-2xl shadow-md border border-slate-800 overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#0b1329]/60 border-b border-slate-800 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <th className="px-6 py-4">Customer Details</th>
                  <th className="px-6 py-4 hidden md:table-cell">
                    Contact & Activity
                  </th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-sm text-slate-300">
                <AnimatePresence mode="popLayout">
                  {currentCustomers.length > 0 ? (
                    currentCustomers.map((customer: any, index: number) => {
                      const isActive =
                        customer?.status === "in-progress" ||
                        customer?.status === "active";

                      return (
                        <motion.tr
                          key={customer?._id || index}
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.98 }}
                          transition={{ duration: 0.2 }}
                          className="hover:bg-slate-800/40 transition-colors group"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold shadow-xs">
                                {customer?.name?.charAt(0)?.toUpperCase() ||
                                  "U"}
                              </div>
                              <div>
                                <div className="font-semibold text-white group-hover:text-indigo-400 transition-colors">
                                  {customer?.name || "Unnamed User"}
                                </div>
                                <div className="text-xs text-slate-500 font-mono">
                                  ID:{" "}
                                  {customer?.userId ||
                                    customer?._id?.slice(-6) ||
                                    "N/A"}
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                            <div className="font-medium text-slate-200">
                              {customer?.email || "No email available"}
                            </div>
                            <div className="text-xs text-slate-500">
                              Last Activity: {customer?.lastOrder || "N/A"}
                            </div>
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700 capitalize">
                              {customer?.role || "user"}
                            </span>
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                                isActive
                                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                  : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  isActive ? "bg-emerald-400" : "bg-rose-400"
                                }`}
                              />
                              {customer?.status || "unknown"}
                            </span>
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap text-right font-medium">
                            <div className="flex items-center justify-end gap-1.5">
                              <Link
                                to={`/dashboard/customers/change-status/${customer?._id}`}
                              >
                                <button
                                  title="Change Status"
                                  className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded-lg transition-colors"
                                >
                                  <FiChevronRight className="w-4 h-4" />
                                </button>
                              </Link>

                              <Link
                                to={`/dashboard/customers/${customer?._id}`}
                              >
                                <button
                                  title="View Details"
                                  className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded-lg transition-colors"
                                >
                                  <FiEye className="w-4 h-4" />
                                </button>
                              </Link>

                              <button
                                onClick={() => handleDelete(customer)}
                                title="Delete Customer"
                                className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                              >
                                <FiTrash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center">
                        <div className="max-w-xs mx-auto space-y-3">
                          <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-500 mx-auto">
                            <FiUserX className="w-6 h-6" />
                          </div>
                          <p className="text-slate-200 font-semibold text-base">
                            No customers found
                          </p>
                          <p className="text-xs text-slate-400">
                            Try broadening your search term or setting your
                            status filter back to "All Statuses".
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {filteredCustomers.length > 0 && (
            <div className="px-6 py-4 bg-[#0b1329]/60 border-t border-slate-800 flex items-center justify-between">
              <div className="text-xs font-medium text-slate-400">
                Showing{" "}
                <span className="text-white font-bold">
                  {indexOfFirstCustomer + 1}
                </span>{" "}
                to{" "}
                <span className="text-white font-bold">
                  {Math.min(indexOfLastCustomer, filteredCustomers.length)}
                </span>{" "}
                of{" "}
                <span className="text-white font-bold">
                  {filteredCustomers.length}
                </span>{" "}
                entries
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1 ${
                    currentPage === 1
                      ? "text-slate-600 bg-slate-800/40 cursor-not-allowed border border-slate-800"
                      : "text-slate-300 bg-[#0b1329] hover:bg-slate-800 border border-slate-700 shadow-xs"
                  }`}
                >
                  <FiChevronLeft className="w-4 h-4" /> Previous
                </button>

                <div className="hidden sm:flex items-center gap-1 px-2">
                  {[...Array(totalPages)].map((_, idx) => {
                    const pageNum = idx + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => paginate(pageNum)}
                        className={`w-8 h-8 rounded-xl text-xs font-semibold transition-all ${
                          currentPage === pageNum
                            ? "bg-indigo-600 text-white shadow-xs"
                            : "text-slate-400 hover:bg-slate-800"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1 ${
                    currentPage === totalPages
                      ? "text-slate-600 bg-slate-800/40 cursor-not-allowed border border-slate-800"
                      : "text-slate-300 bg-[#0b1329] hover:bg-slate-800 border border-slate-700 shadow-xs"
                  }`}
                >
                  Next <FiChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Customers;
