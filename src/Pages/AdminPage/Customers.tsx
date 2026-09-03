
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo, useEffect } from "react";
import {
  FiSearch,
  FiEye,
  FiTrash2,
  FiChevronLeft,
  FiChevronRight,
  FiUsers,
  FiDollarSign,
  FiTrendingUp,
  FiUserX,
  FiArrowUpRight,
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
      title: "Delete account",
      text: `Delete ${user.name || "this user"}'s account? This can't be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#C4503D",
      cancelButtonColor: "#2A2E38",
      background: "#15181F",
      color: "#EDEEF0",
      customClass: {
        popup: "rounded-2xl shadow-2xl border border-white/10",
        title: "text-lg font-semibold",
        htmlContainer: "text-sm text-[#9CA0AC]",
        confirmButton: "px-5 py-2.5 text-sm font-semibold rounded-xl",
        cancelButton: "px-5 py-2.5 text-sm font-semibold rounded-xl",
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteUser(user._id).unwrap();
          Swal.fire({
            title: "Account deleted",
            text: `${user.name || "User"}'s account has been removed.`,
            icon: "success",
            confirmButtonColor: "#E9A23B",
            background: "#15181F",
            color: "#EDEEF0",
            customClass: {
              popup: "rounded-2xl border border-white/10",
              title: "text-lg font-semibold",
              confirmButton: "px-5 py-2.5 text-sm font-semibold rounded-xl",
            },
          });
        } catch (error: any) {
          const errorMessage =
            error?.data?.message || "Something went wrong while deleting.";
          Swal.fire({
            title: "Couldn't delete this account",
            text: errorMessage,
            icon: "error",
            confirmButtonColor: "#C4503D",
            background: "#15181F",
            color: "#EDEEF0",
            customClass: { popup: "rounded-2xl border border-white/10" },
          });
        }
      }
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.07, delayChildren: 0.05 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
    },
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

  const statusStyles: Record<string, string> = {
    active: "bg-[#3FB8AF]/12 text-[#3FB8AF] border-[#3FB8AF]/25",
    "in-progress": "bg-[#3FB8AF]/12 text-[#3FB8AF] border-[#3FB8AF]/25",
    inactive: "bg-white/[0.06] text-[#9CA0AC] border-white/10",
    blocked: "bg-[#C4503D]/12 text-[#C4503D] border-[#C4503D]/25",
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-[#020618] p-4 sm:p-6 md:p-8 text-[#EDEEF0] font-[Manrope,sans-serif]"
    >
      <div className="max-w-[1400px] mx-auto space-y-5">
        {/* Header */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 pb-5 border-b border-white/[0.08]"
        >
          <div className="flex gap-4">
            <div className="w-1 rounded-full bg-[#E9A23B] shrink-0" />
            <div>
              <h1 className="text-[26px] sm:text-3xl font-bold text-white tracking-tight leading-tight">
                Customer directory
              </h1>
              <p className="mt-1.5 text-sm text-[#9CA0AC] max-w-lg leading-relaxed">
                Review activity, track lifetime value, and manage account access
                across every registered user.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm shrink-0">
            <span className="text-white font-semibold tabular-nums">
              {filteredCustomers.length}
            </span>
            <span className="text-[#9CA0AC]">
              of {totalUsersCount.toLocaleString()} records shown
            </span>
          </div>
        </motion.div>

        {/* Metrics strip */}
        <motion.div
          variants={itemVariants}
          className="rounded-2xl border border-white/[0.08] bg-[#111318] grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-white/[0.08]"
        >
          {[
            {
              label: "Total customers",
              value: totalUsersCount.toLocaleString(),
              icon: FiUsers,
            },
            {
              label: "Active accounts",
              value: activeUsersCount.toLocaleString(),
              icon: FiArrowUpRight,
              accent: true,
            },
            {
              label: "Lifetime spend",
              value: `$${totalRevenue.toLocaleString()}`,
              icon: FiDollarSign,
            },
            {
              label: "Avg. spend / user",
              value: `$${avgOrderValue.toFixed(2)}`,
              icon: FiTrendingUp,
            },
          ].map((stat, idx) => {
            const IconComponent = stat.icon;
            return (
              <div key={idx} className="p-5 flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-[#9CA0AC]">{stat.label}</p>
                  <IconComponent
                    className={`w-3.5 h-3.5 ${
                      stat.accent ? "text-[#3FB8AF]" : "text-[#565B68]"
                    }`}
                  />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white tabular-nums">
                  {stat.value}
                </h3>
              </div>
            );
          })}
        </motion.div>

        {/* Filter Controls Bar */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row sm:items-center gap-3"
        >
          <div className="relative flex-1">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#565B68] w-4 h-4" />
            <input
              type="text"
              placeholder="Search by name or email"
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-[#111318] border border-white/[0.08] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#E9A23B]/50 focus:border-[#E9A23B]/50 transition-colors placeholder:text-[#565B68] text-[#EDEEF0]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-3">
            <select
              className="flex-1 sm:flex-none appearance-none py-2.5 pl-4 pr-9 text-sm bg-[#111318] border border-white/[0.08] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#E9A23B]/50 text-[#EDEEF0] cursor-pointer bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2210%22%20height%3D%226%22%3E%3Cpath%20d%3D%22M0%200l5%206%205-6z%22%20fill%3D%22%23565B68%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_14px_center]"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="name" className="bg-[#15181F]">
                Name, A–Z
              </option>
              <option value="orders" className="bg-[#15181F]">
                Order volume
              </option>
              <option value="spent" className="bg-[#15181F]">
                Highest spend
              </option>
              <option value="recent" className="bg-[#15181F]">
                Last activity
              </option>
            </select>

            <select
              className="flex-1 sm:flex-none appearance-none py-2.5 pl-4 pr-9 text-sm bg-[#111318] border border-white/[0.08] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#E9A23B]/50 text-[#EDEEF0] cursor-pointer bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2210%22%20height%3D%226%22%3E%3Cpath%20d%3D%22M0%200l5%206%205-6z%22%20fill%3D%22%23565B68%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_14px_center]"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all" className="bg-[#15181F]">
                All statuses
              </option>
              <option value="in-progress" className="bg-[#15181F]">
                In progress
              </option>
              <option value="active" className="bg-[#15181F]">
                Active
              </option>
              <option value="inactive" className="bg-[#15181F]">
                Inactive
              </option>
              <option value="blocked" className="bg-[#15181F]">
                Blocked
              </option>
            </select>
          </div>
        </motion.div>

        {/* Data Table */}
        <motion.div
          variants={itemVariants}
          className="rounded-2xl border border-white/[0.08] bg-[#111318] overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/[0.08] text-xs font-medium text-[#9CA0AC]">
                  <th className="px-6 py-3.5 font-medium">Customer</th>
                  <th className="px-6 py-3.5 font-medium hidden md:table-cell">
                    Contact &amp; activity
                  </th>
                  <th className="px-6 py-3.5 font-medium">Role</th>
                  <th className="px-6 py-3.5 font-medium">Status</th>
                  <th className="px-6 py-3.5 font-medium text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06] text-sm text-[#C7C9D1]">
                <AnimatePresence mode="popLayout">
                  {currentCustomers.length > 0 ? (
                    currentCustomers.map((customer: any, index: number) => {
                      const isActive =
                        customer?.status === "in-progress" ||
                        customer?.status === "active";
                      const badgeClass =
                        statusStyles[customer?.status] ||
                        "bg-white/[0.06] text-[#9CA0AC] border-white/10";

                      return (
                        <motion.tr
                          key={customer?._id || index}
                          layout
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.15 }}
                          className="hover:bg-white/[0.025] transition-colors group"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <div className="h-9 w-9 rounded-lg bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-[#E9A23B] font-semibold text-sm">
                                {customer?.name?.charAt(0)?.toUpperCase() ||
                                  "U"}
                              </div>
                              <div>
                                <div className="font-medium text-white">
                                  {customer?.name || "Unnamed user"}
                                </div>
                                <div className="text-xs text-[#565B68] font-mono">
                                  {customer?.userId ||
                                    customer?._id?.slice(-6) ||
                                    "N/A"}
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                            <div className="text-[#C7C9D1]">
                              {customer?.email || "No email available"}
                            </div>
                            <div className="text-xs text-[#565B68]">
                              Last active: {customer?.lastOrder || "N/A"}
                            </div>
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-white/[0.05] text-[#C7C9D1] border border-white/[0.08] capitalize">
                              {customer?.role || "user"}
                            </span>
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${badgeClass}`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  isActive
                                    ? "bg-[#3FB8AF]"
                                    : "bg-current opacity-60"
                                }`}
                              />
                              {customer?.status || "unknown"}
                            </span>
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <div className="flex items-center justify-end gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                              <Link
                                to={`/dashboard/customers/change-status/${customer?._id}`}
                              >
                                <button
                                  title="Change status"
                                  className="p-2 text-[#9CA0AC] hover:text-[#E9A23B] hover:bg-white/[0.06] rounded-lg transition-colors cursor-pointer"
                                >
                                  <FiChevronRight className="w-4 h-4" />
                                </button>
                              </Link>

                              <Link
                                to={`/dashboard/customers/${customer?._id}`}
                              >
                                <button
                                  title="View details"
                                  className="p-2 text-[#9CA0AC] hover:text-[#E9A23B] hover:bg-white/[0.06] rounded-lg transition-colors cursor-pointer"
                                >
                                  <FiEye className="w-4 h-4" />
                                </button>
                              </Link>

                              <button
                                onClick={() => handleDelete(customer)}
                                title="Delete customer"
                                className="p-2 text-[#9CA0AC] hover:text-[#C4503D] hover:bg-white/[0.06] rounded-lg transition-colors cursor-pointer"
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
                      <td colSpan={5} className="px-6 py-16 text-center">
                        <div className="max-w-xs mx-auto space-y-3">
                          <div className="w-11 h-11 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-[#565B68] mx-auto">
                            <FiUserX className="w-5 h-5" />
                          </div>
                          <p className="text-white font-medium text-sm">
                            No customers found
                          </p>
                          <p className="text-xs text-[#9CA0AC] leading-relaxed">
                            Try a different search term, or set the status
                            filter back to all statuses.
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
            <div className="px-6 py-3.5 border-t border-white/[0.08] flex items-center justify-between">
              <div className="text-xs text-[#9CA0AC]">
                <span className="text-white font-medium tabular-nums">
                  {indexOfFirstCustomer + 1}
                </span>
                {"–"}
                <span className="text-white font-medium tabular-nums">
                  {Math.min(indexOfLastCustomer, filteredCustomers.length)}
                </span>{" "}
                of{" "}
                <span className="text-white font-medium tabular-nums">
                  {filteredCustomers.length}
                </span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-lg transition-colors ${
                    currentPage === 1
                      ? "text-[#3A3E48] cursor-not-allowed"
                      : "text-[#9CA0AC] hover:text-white hover:bg-white/[0.06]"
                  }`}
                >
                  <FiChevronLeft className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-1 px-1">
                  {[...Array(totalPages)].map((_, idx) => {
                    const pageNum = idx + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => paginate(pageNum)}
                        className={`min-w-[28px] h-7 px-1.5 rounded-md text-xs font-medium transition-colors tabular-nums ${
                          currentPage === pageNum
                            ? "bg-[#E9A23B] text-[#0B0C10]"
                            : "text-[#9CA0AC] hover:bg-white/[0.06]"
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
                  className={`p-2 rounded-lg transition-colors ${
                    currentPage === totalPages
                      ? "text-[#3A3E48] cursor-not-allowed"
                      : "text-[#9CA0AC] hover:text-white hover:bg-white/[0.06]"
                  }`}
                >
                  <FiChevronRight className="w-4 h-4" />
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
