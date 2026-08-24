import React from "react";
import { Link, useParams } from "react-router-dom";
import {
  User,
  Phone,
  Calendar,
  Mail,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
} from "lucide-react";
import Loader from "../../utils/Loader";
import { useGetSingleUserQuery } from "../../Redux/features/auth/authApi";

interface UserData {
 
  name: string;
  email: string;
  image?: string;
  status: string;
  phone?: string;
  address?: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

const ViewUserInfo: React.FC = () => {
  const { id } = useParams();
  const { data: user, isLoading } = useGetSingleUserQuery(id ?? "") as {
    data: UserData | undefined;
    isLoading: boolean;
  };

  if (isLoading) {
    return <Loader />;
  }

  const isAdminOrSuperAdmin =
    user?.role === "admin" || user?.role === "superAdmin";

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not available";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-[#020618] text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Navigation Action Bar */}
        <div className="flex items-center justify-between">
          <Link
            to={
              isAdminOrSuperAdmin
                ? "/dashboard/all-admin"
                : "/dashboard/customers"
            }
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900/90 border border-slate-800/80 text-xs font-medium text-slate-400 hover:text-white hover:border-slate-700 transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>
              {isAdminOrSuperAdmin ? "Back to Admins" : "Back to Users"}
            </span>
          </Link>
         
        </div>

        {/* Profile Card Container */}
        <div className="bg-[#090D16] border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl">
          {/* Header Cover Banner */}
          <div className="h-36 sm:h-44 bg-gradient-to-r from-slate-900 via-slate-800/60 to-slate-900 relative border-b border-slate-800/80">
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 capitalize">
                <ShieldCheck className="w-3.5 h-3.5" />
                {user?.role || "User"}
              </span>
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold border capitalize ${
                  user?.status === "in-progress" || user?.status === "active"
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                {user?.status || "N/A"}
              </span>
            </div>
          </div>

          {/* User Details Area */}
          <div className="px-6 sm:px-8 pb-8 relative">
            {/* Profile Avatar & Primary Info */}
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 -mt-14 sm:-mt-16 mb-8 pb-6 border-b border-slate-800/80">
              <div className="relative">
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-[#020618] p-1 border border-slate-700/80 shadow-2xl overflow-hidden">
                  {user?.image ? (
                    <img
                      src={user.image}
                      alt={user.name}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  ) : (
                    <div className="w-full h-full rounded-xl bg-slate-900 flex items-center justify-center text-slate-500">
                      <User className="w-12 h-12 text-slate-600" />
                    </div>
                  )}
                </div>
              </div>

              <div className="text-center sm:text-left space-y-1">
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {user?.name || "User Profile"}
                </h1>
                <div className="flex items-center justify-center sm:justify-start gap-2 text-xs sm:text-sm text-slate-400">
                  <Mail className="w-4 h-4 text-slate-500" />
                  <span>{user?.email}</span>
                </div>
              </div>
            </div>

            {/* Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Contact Information */}
              <div className="bg-[#020618]/60 border border-slate-800/80 rounded-xl p-5 space-y-4 hover:border-slate-700 transition-colors duration-200">
                <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800/80 text-slate-300">
                  <Phone className="w-4 h-4 text-amber-500" />
                  <h2 className="text-sm font-semibold">Contact Information</h2>
                </div>

                <div className="space-y-3.5">
                  <div>
                    <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">
                      Phone Number
                    </span>
                    <span className="text-xs sm:text-sm font-medium text-slate-200 mt-0.5 block">
                      {user?.phone || "Not provided"}
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">
                      Shipping Address
                    </span>
                    <span className="text-xs sm:text-sm font-medium text-slate-200 mt-0.5 block leading-relaxed">
                      {user?.address || "Not provided"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Account Timeline */}
              <div className="bg-[#020618]/60 border border-slate-800/80 rounded-xl p-5 space-y-4 hover:border-slate-700 transition-colors duration-200">
                <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800/80 text-slate-300">
                  <Calendar className="w-4 h-4 text-amber-500" />
                  <h2 className="text-sm font-semibold">Account History</h2>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">
                      Joined Date
                    </span>
                    <div className="flex items-center gap-1.5 mt-1">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      <span className="text-xs font-medium text-slate-200">
                        {formatDate(user?.createdAt)}
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">
                      Last Updated
                    </span>
                    <div className="flex items-center gap-1.5 mt-1">
                      <Sparkles className="w-3.5 h-3.5 text-slate-500" />
                      <span className="text-xs font-medium text-slate-200">
                        {formatDate(user?.updatedAt)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewUserInfo;
