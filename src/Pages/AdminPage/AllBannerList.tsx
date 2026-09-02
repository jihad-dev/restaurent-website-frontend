import React, { useState } from "react";
import {
  Plus,
  Search,
  SlidersHorizontal,
  Trash2,
  Edit3,
  Eye,
  Sparkles,
  Flame,
  Award,
  Clock,
  Layers,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  AlertTriangle,
  X,
  Tag,
} from "lucide-react";
import {
  useGetAllBannersQuery,
  useDeleteBannerMutation,
} from "../../Redux/features/banner/bannerApi";

interface Banner {
  _id?: string;
  id?: string;
  title: string;
  subtitle?: string;
  description: string;
  imageUrl: string;
  promoCode?: string;
  discountPercentage?: number;
  linkUrl?: string;
  accentColor?: string;
  badgeText?: string;
  badgeIcon?: "sparkles" | "flame" | "clock" | "award";
  isActive?: boolean;
}

const AllBannerList: React.FC = () => {
  const {
    data: responseData,
    isLoading,
    isError,
  } = useGetAllBannersQuery(undefined);
  const [deleteBanner] = useDeleteBannerMutation();

  // Extract array safely
 const banners: Banner[] = (
  Array.isArray(responseData) ? responseData : responseData?.data
) as Banner[] || [];

  // Filter & Search States
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Modals States
  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [bannerToDelete, setBannerToDelete] = useState<Banner | null>(null);

  // Stats Calculations
  const totalBanners = banners.length;
  const activeBanners = banners.filter((b) => b.isActive !== false).length;
  const inactiveBanners = totalBanners - activeBanners;

  // Filtered List
  const filteredBanners = banners.filter((banner) => {
    const matchesSearch =
      banner.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      banner.promoCode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      banner.subtitle?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      filterStatus === "all"
        ? true
        : filterStatus === "active"
          ? banner.isActive !== false
          : banner.isActive === false;

    return matchesSearch && matchesStatus;
  });

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleDeleteConfirm = async () => {
    if (!bannerToDelete) return;
    try {
      const id = bannerToDelete._id || bannerToDelete.id;
      if (id) {
        await deleteBanner(id).unwrap();
      }
      setIsDeleteModalOpen(false);
      setBannerToDelete(null);
    } catch (err) {
      console.error("Failed to delete banner:", err);
    }
  };

  const renderBadgeIcon = (icon?: string) => {
    switch (icon) {
      case "flame":
        return (
          <Flame className="w-3.5 h-3.5 text-orange-400 fill-orange-400" />
        );
      case "clock":
        return <Clock className="w-3.5 h-3.5 text-pink-400" />;
      case "award":
        return <Award className="w-3.5 h-3.5 text-purple-400" />;
      default:
        return <Sparkles className="w-3.5 h-3.5 text-amber-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 selection:bg-amber-500 selection:text-slate-950">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header & Primary Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                <Layers className="w-6 h-6" />
              </span>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                Banner Management
              </h1>
            </div>
            <p className="text-slate-400 text-sm mt-1">
              Create, monitor, and optimize promotional banners for your store.
            </p>
          </div>

          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold px-5 py-3 rounded-2xl shadow-lg shadow-amber-500/20 transition-all duration-300 hover:scale-[1.02] active:scale-95 text-sm"
          >
            <Plus className="w-5 h-5 stroke-[2.5]" />
            <span>Create New Banner</span>
          </button>
        </div>

        {/* Analytics Counter Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <div className="relative overflow-hidden rounded-3xl bg-slate-900/60 border border-slate-800/80 p-5 backdrop-blur-xl shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Total Campaigns
              </span>
              <span className="p-2 rounded-xl bg-slate-800/80 text-amber-400 border border-slate-700/50">
                <Layers className="w-4 h-4" />
              </span>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-black text-white">
                {totalBanners}
              </span>
              <span className="text-xs text-slate-500">banners live</span>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-3xl bg-slate-900/60 border border-slate-800/80 p-5 backdrop-blur-xl shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                Active Banners
              </span>
              <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <CheckCircle2 className="w-4 h-4" />
              </span>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-black text-white">
                {activeBanners}
              </span>
              <span className="text-xs text-emerald-500 font-medium">
                {totalBanners
                  ? Math.round((activeBanners / totalBanners) * 100)
                  : 0}
                % active
              </span>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-3xl bg-slate-900/60 border border-slate-800/80 p-5 backdrop-blur-xl shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-rose-400">
                Inactive / Draft
              </span>
              <span className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                <XCircle className="w-4 h-4" />
              </span>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-black text-white">
                {inactiveBanners}
              </span>
              <span className="text-xs text-slate-500">paused</span>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/40 p-3 rounded-2xl border border-slate-800/60 backdrop-blur-md">
          {/* Search Input */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by title, promo code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all"
            />
          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800/80 w-full sm:w-auto">
            {(["all", "active", "inactive"] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all duration-200 ${
                  filterStatus === status
                    ? "bg-amber-500 text-slate-950 shadow-md font-bold"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Banner Cards Grid */}
        {isLoading ? (
          /* Loading Skeleton */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <div
                key={idx}
                className="rounded-3xl bg-slate-900/60 border border-slate-800/80 overflow-hidden animate-pulse h-[380px] flex flex-col justify-between p-5"
              >
                <div className="w-full h-44 bg-slate-800/60 rounded-2xl" />
                <div className="space-y-3 mt-4">
                  <div className="h-4 bg-slate-800/80 rounded w-1/3" />
                  <div className="h-6 bg-slate-800 rounded w-3/4" />
                  <div className="h-3 bg-slate-800/50 rounded w-full" />
                </div>
                <div className="h-10 bg-slate-800/80 rounded-xl mt-4" />
              </div>
            ))}
          </div>
        ) : isError ? (
          /* Error State */
          <div className="rounded-3xl bg-slate-900/40 border border-rose-500/20 p-12 text-center space-y-3">
            <AlertTriangle className="w-10 h-10 text-rose-400 mx-auto" />
            <h3 className="text-lg font-bold text-white">
              Failed to load banners
            </h3>
            <p className="text-slate-400 text-sm">
              Please check your server connection and try again.
            </p>
          </div>
        ) : filteredBanners.length === 0 ? (
          /* Empty State */
          <div className="rounded-3xl bg-slate-900/40 border border-slate-800/80 p-12 text-center space-y-4">
            <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto text-slate-500">
              <SlidersHorizontal className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">No banners found</h3>
              <p className="text-slate-400 text-sm mt-1">
                {searchQuery
                  ? "No results matched your search criteria."
                  : "Start by creating your first promotional banner."}
              </p>
            </div>
          </div>
        ) : (
          /* Real Data Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBanners.map((banner) => {
              const bannerId = banner._id || banner.id;
              const isBannerActive = banner.isActive !== false;

              return (
                <div
                  key={bannerId}
                  className="group relative rounded-3xl bg-slate-900/70 border border-slate-800/80 hover:border-slate-700 overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.8)]"
                >
                  {/* Card Media Header */}
                  <div className="relative h-48 w-full overflow-hidden bg-slate-950">
                    <img
                      src={banner.imageUrl}
                      alt={banner.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                    {/* Status Badge */}
                    <div className="absolute top-3.5 left-3.5 flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider backdrop-blur-md border shadow-md ${
                          isBannerActive
                            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                            : "bg-slate-800/80 border-slate-700 text-slate-400"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isBannerActive
                              ? "bg-emerald-400 animate-pulse"
                              : "bg-slate-500"
                          }`}
                        />
                        {isBannerActive ? "Active" : "Inactive"}
                      </span>
                    </div>

                    {/* Discount Badge */}
                    {banner.discountPercentage && (
                      <div className="absolute top-3.5 right-3.5">
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-[11px] uppercase tracking-wider shadow-lg">
                          <Sparkles className="w-3 h-3 fill-slate-950" />
                          {banner.discountPercentage}% OFF
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Card Content Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      {/* Subtitle / Badge */}
                      <div className="flex items-center gap-2">
                        {banner.badgeText && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                            {renderBadgeIcon(banner.badgeIcon)}
                            {banner.badgeText}
                          </span>
                        )}
                        {banner.subtitle && (
                          <span className="text-xs text-slate-400 font-medium truncate">
                            • {banner.subtitle}
                          </span>
                        )}
                      </div>

                      {/* Main Title */}
                      <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-1">
                        {banner.title}
                      </h3>

                      {/* Description */}
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {banner.description}
                      </p>
                    </div>

                    {/* Promo Code Strip */}
                    {banner.promoCode && (
                      <div className="flex items-center justify-between bg-slate-950/80 border border-slate-800/80 rounded-xl px-3 py-2 text-xs font-mono">
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <Tag className="w-3.5 h-3.5 text-amber-400" />
                          <span>Code:</span>
                          <span className="text-amber-400 font-bold">
                            {banner.promoCode}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopyCode(banner.promoCode!)}
                          className="text-slate-400 hover:text-white transition-colors"
                          title="Copy Promo Code"
                        >
                          {copiedCode === banner.promoCode ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Card Action Footer */}
                  <div className="px-5 py-3.5 bg-slate-950/60 border-t border-slate-800/60 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedBanner(banner);
                        setIsViewModalOpen(true);
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-slate-800/50"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Preview</span>
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          /* Navigate to Edit Page or trigger Edit Modal */
                        }}
                        className="p-2 rounded-xl text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 transition-all"
                        title="Edit Banner"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setBannerToDelete(banner);
                          setIsDeleteModalOpen(true);
                        }}
                        className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                        title="Delete Banner"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {isViewModalOpen && selectedBanner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-white">
                Banner Live Preview
              </h3>
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative h-64 rounded-2xl overflow-hidden border border-slate-800">
              <img
                src={selectedBanner.imageUrl}
                alt={selectedBanner.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/70 to-transparent p-6 flex flex-col justify-end space-y-2">
                {selectedBanner.subtitle && (
                  <p className="text-amber-400 text-xs uppercase font-bold tracking-widest">
                    {selectedBanner.subtitle}
                  </p>
                )}
                <h2 className="text-2xl font-black text-white">
                  {selectedBanner.title}
                </h2>
                <p className="text-slate-300 text-xs line-clamp-2">
                  {selectedBanner.description}
                </p>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-200 text-sm font-semibold hover:bg-slate-700"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && bannerToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Delete Banner</h3>
                <p className="text-xs text-slate-400">
                  This action cannot be undone.
                </p>
              </div>
            </div>

            <p className="text-sm text-slate-300">
              Are you sure you want to permanently delete{" "}
              <span className="font-bold text-white">
                "{bannerToDelete.title}"
              </span>
              ?
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setBannerToDelete(null);
                }}
                className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-sm font-semibold hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-sm font-bold transition-all shadow-lg shadow-rose-600/25"
              >
                Delete Banner
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllBannerList;
