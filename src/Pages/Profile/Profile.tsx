import { useGetSingleUserQuery } from "../../Redux/features/auth/authApi";
import { useAppSelector } from "../../Redux/hooks";
import { motion } from "framer-motion";
import {
  FiEdit2,
  FiKey,
  FiMail,
  FiPhone,
  FiMapPin,
  FiUser,
} from "react-icons/fi";

const Profile = () => {
  const user = useAppSelector((state) => state.auth.user);
  const { data: singleUser } = useGetSingleUserQuery(user?.id);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <motion.div
      className="relative min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8 overflow-hidden pt-28"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Background Glowing Orbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-10 -right-32 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none animate-pulse delay-1000" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Title */}
        <motion.h1
          className="text-3xl sm:text-4xl font-black mb-10 text-center tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500"
          variants={itemVariants}
          transition={{ delay: 0.2 }}
        >
          Welcome Back! {singleUser?.name || ""}
        </motion.h1>

        {/* Profile Glass Card */}
        <motion.div
          className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl transition-all duration-300 hover:border-slate-700/80"
          variants={itemVariants}
          transition={{ delay: 0.3 }}
        >
          {/* Top User Info Section */}
          <motion.div
            className="flex flex-col md:flex-row items-center mb-10 gap-8"
            variants={itemVariants}
            transition={{ delay: 0.4 }}
          >
            {/* Avatar Container */}
            <motion.div
              className="w-32 h-32 rounded-full overflow-hidden border-2 border-amber-500/40 bg-slate-800/80 p-1 relative group cursor-pointer shadow-lg shadow-amber-500/10"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center overflow-hidden">
                <FiUser className="w-16 h-16 text-amber-500 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <div className="absolute inset-0 bg-slate-950/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm">
                <FiEdit2 className="text-amber-400 text-2xl" />
              </div>
            </motion.div>

            {/* Name and Email */}
            <div className="text-center md:text-left flex-1">
              <motion.h2
                className="text-3xl sm:text-4xl font-extrabold text-slate-100 mb-2"
                variants={itemVariants}
                transition={{ delay: 0.5 }}
              >
                {singleUser?.name || "User Name"}
              </motion.h2>
              <motion.div
                className="flex items-center justify-center md:justify-start gap-2 text-base sm:text-lg text-slate-400"
                variants={itemVariants}
                transition={{ delay: 0.6 }}
              >
                <FiMail className="text-amber-500" />
                {user?.email}
              </motion.div>
            </div>
          </motion.div>

          {/* Personal Information Section */}
          <motion.div
            className="border-t border-slate-800/80 pt-8"
            variants={itemVariants}
            transition={{ delay: 0.7 }}
          >
            <h3 className="text-xl sm:text-2xl font-bold mb-6 text-slate-100 flex items-center gap-3">
              <span className="bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20">
                <FiMapPin className="text-amber-400" />
              </span>
              Personal Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Phone Card */}
              <motion.div
                className="bg-slate-950/60 border border-slate-800 p-6 rounded-2xl transition-all duration-300 hover:border-amber-500/30 group"
                whileHover={{ y: -4 }}
              >
                <div className="flex items-center gap-3 text-amber-400 font-semibold mb-2">
                  <FiPhone className="text-xl group-hover:scale-110 transition-transform duration-300" />
                  <label className="text-slate-400 text-sm">Phone</label>
                </div>
                <p className="text-slate-200 text-lg font-medium">
                  {user?.phone || "Not provided"}
                </p>
              </motion.div>

              {/* Address Card */}
              <motion.div
                className="bg-slate-950/60 border border-slate-800 p-6 rounded-2xl transition-all duration-300 hover:border-amber-500/30 group"
                whileHover={{ y: -4 }}
              >
                <div className="flex items-center gap-3 text-amber-400 font-semibold mb-2">
                  <FiMapPin className="text-xl group-hover:scale-110 transition-transform duration-300" />
                  <label className="text-slate-400 text-sm">Address</label>
                </div>
                <p className="text-slate-200 text-lg font-medium">
                  {user?.address || "Not provided"}
                </p>
              </motion.div>
            </div>
          </motion.div>

          {/* Account Settings Section */}
          <motion.div
            className="border-t border-slate-800/80 mt-8 pt-8"
            variants={itemVariants}
            transition={{ delay: 0.8 }}
          >
            <h3 className="text-xl sm:text-2xl font-bold mb-6 text-slate-100 flex items-center gap-3">
              <span className="bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20">
                <FiKey className="text-amber-400" />
              </span>
              Account Settings
            </h3>

            <div className="flex flex-wrap gap-4 sm:gap-6">
              {/* Edit Profile Button */}
              <motion.button
                className="group relative inline-flex items-center justify-center px-6 py-3.5 text-base font-bold text-slate-950 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 rounded-xl shadow-lg shadow-amber-500/10 hover:shadow-orange-500/30 transition-all duration-300 overflow-hidden cursor-pointer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="absolute inset-0 w-full h-full bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
                <span className="relative z-10 flex items-center gap-2">
                  <FiEdit2 className="text-lg group-hover:rotate-12 transition-transform duration-300" />
                  Edit Profile
                </span>
              </motion.button>

              {/* Change Password Button */}
              <motion.button
                className="group inline-flex items-center justify-center px-6 py-3.5 text-base font-bold text-slate-200 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 rounded-xl transition-all duration-300 cursor-pointer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="flex items-center gap-2">
                  <FiKey className="text-lg text-amber-400 group-hover:rotate-12 transition-transform duration-300" />
                  Change Password
                </span>
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Profile;
