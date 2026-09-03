import React, { useState } from "react";
import {
  Plus,
  Search,
  SlidersHorizontal,
  Trash2,
  Edit3,
  Eye,
  Layers,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  AlertTriangle,
  X,
  Tag,
  Link as LinkIcon,
  Calendar,
  Sparkles,
  Percent,
} from "lucide-react";
import {
  useGetAllBannersQuery,
  useDeleteBannerMutation,
  useCreateBannerMutation,
} from "../../Redux/features/banner/bannerApi";

interface Banner {
  _id?: string;
  id?: string;
  title: string;
  description?: string;
  imageUrl: string;
  discountPercentage?: number;
  promoCode?: string;
  linkUrl?: string;
  isActive?: boolean;
  startDate?: string;
  endDate?: string;
}

const AllBannerList: React.FC = () => {
  const {
    data: responseData,
    isLoading,
    isError,
  } = useGetAllBannersQuery(undefined);
  const [deleteBanner] = useDeleteBannerMutation();
  const [createBanner, { isLoading: isCreating }] = useCreateBannerMutation();

  const banners: Banner[] =
    ((Array.isArray(responseData)
      ? responseData
      : responseData?.data) as Banner[]) || [];

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [bannerToDelete, setBannerToDelete] = useState<Banner | null>(null);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newBanner, setNewBanner] = useState({
    title: "",
    description: "",
    imageUrl: "",
    discountPercentage: "",
    promoCode: "",
    linkUrl: "",
    isActive: true,
    startDate: "",
    endDate: "",
  });

  const totalBanners = banners.length;
  const activeBanners = banners.filter((b) => b.isActive !== false).length;
  const inactiveBanners = totalBanners - activeBanners;

  const filteredBanners = banners.filter((banner) => {
    const matchesSearch =
      banner.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      banner.promoCode?.toLowerCase().includes(searchQuery.toLowerCase());

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

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formattedPayload = {
      title: newBanner.title.trim(),
      description: newBanner.description || undefined,
      imageUrl: newBanner.imageUrl,
      discountPercentage: newBanner.discountPercentage
        ? Number(newBanner.discountPercentage)
        : undefined,
      promoCode: newBanner.promoCode
        ? newBanner.promoCode.toUpperCase().trim()
        : undefined,
      linkUrl: newBanner.linkUrl || undefined,
      isActive: newBanner.isActive,
      startDate: newBanner.startDate
        ? new Date(newBanner.startDate).toISOString()
        : undefined,
      endDate: newBanner.endDate
        ? new Date(newBanner.endDate).toISOString()
        : undefined,
    };

    console.log("Form Submitted Banner Payload:", formattedPayload);

    try {
      await createBanner(formattedPayload).unwrap();
      setIsCreateModalOpen(false);
      setNewBanner({
        title: "",
        description: "",
        imageUrl: "",
        discountPercentage: "",
        promoCode: "",
        linkUrl: "",
        isActive: true,
        startDate: "",
        endDate: "",
      });
    } catch (err) {
      console.error("Failed to create banner:", err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 selection:bg-amber-500 selection:text-slate-950">
      <div className="max-w-7xl mx-auto space-y-8">
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
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold px-5 py-3 rounded-2xl shadow-lg shadow-amber-500/20 transition-all duration-300 hover:scale-[1.02] active:scale-95 text-sm cursor-pointer"
          >
            <Plus className="w-5 h-5 stroke-[2.5]" />
            <span>Create New Banner</span>
          </button>
        </div>

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

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/40 p-3 rounded-2xl border border-slate-800/60 backdrop-blur-md">
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

        {isLoading ? (
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBanners.map((banner) => {
              const bannerId = banner._id || banner.id;
              const isBannerActive = banner.isActive !== false;

              return (
                <div
                  key={bannerId}
                  className="group relative rounded-3xl bg-slate-900/70 border border-slate-800/80 hover:border-slate-700 overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.8)]"
                >
                  <div className="relative h-48 w-full overflow-hidden bg-slate-950">
                    <img
                      src={banner.imageUrl}
                      alt={banner.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

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

                    {banner.discountPercentage !== undefined &&
                      banner.discountPercentage > 0 && (
                        <div className="absolute top-3.5 right-3.5">
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-[11px] uppercase tracking-wider shadow-lg">
                            {banner.discountPercentage}% OFF
                          </span>
                        </div>
                      )}
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-1">
                        {banner.title}
                      </h3>

                      {banner.description && (
                        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                          {banner.description}
                        </p>
                      )}
                    </div>

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
                        onClick={() => {}}
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

      {/* Modern High-End Create Banner Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="relative w-full max-w-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800/80 rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800/80 bg-slate-900/50 backdrop-blur-md shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 shadow-inner">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black tracking-tight text-white">
                    Create New Banner
                  </h3>
                  <p className="text-xs text-slate-400">
                    Configure promotional details & schedule
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="p-2 rounded-xl bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white transition-all duration-200 border border-slate-700/50"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body with Custom Scrollbar */}
            <form
              onSubmit={handleCreateSubmit}
              className="flex flex-col flex-1 overflow-hidden"
            >
              <div className="p-6 space-y-5 overflow-y-auto flex-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-800 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-slate-700">
                {/* Title Input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold tracking-wide text-slate-300">
                    Banner Title <span className="text-amber-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Summer Savings Event"
                    value={newBanner.title}
                    onChange={(e) =>
                      setNewBanner({ ...newBanner, title: e.target.value })
                    }
                    className="w-full bg-slate-950/70 border border-slate-800 focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/20 rounded-2xl px-4 py-3 text-sm text-slate-100 placeholder-slate-600 transition-all outline-none"
                  />
                </div>

                {/* Description Input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold tracking-wide text-slate-300">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Provide details about this campaign..."
                    value={newBanner.description}
                    onChange={(e) =>
                      setNewBanner({
                        ...newBanner,
                        description: e.target.value,
                      })
                    }
                    className="w-full bg-slate-950/70 border border-slate-800 focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/20 rounded-2xl px-4 py-3 text-sm text-slate-100 placeholder-slate-600 transition-all outline-none resize-none"
                  />
                </div>

                {/* URLs Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold tracking-wide text-slate-300">
                      Image URL <span className="text-amber-500">*</span>
                    </label>
                    <input
                      type="url"
                      required
                      placeholder="https://images.com/banner.jpg"
                      value={newBanner.imageUrl}
                      onChange={(e) =>
                        setNewBanner({ ...newBanner, imageUrl: e.target.value })
                      }
                      className="w-full bg-slate-950/70 border border-slate-800 focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/20 rounded-2xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 transition-all outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold tracking-wide text-slate-300">
                      Target Link URL
                    </label>
                    <div className="relative">
                      <LinkIcon className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type="url"
                        placeholder="https://store.com/category"
                        value={newBanner.linkUrl}
                        onChange={(e) =>
                          setNewBanner({
                            ...newBanner,
                            linkUrl: e.target.value,
                          })
                        }
                        className="w-full bg-slate-950/70 border border-slate-800 focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/20 rounded-2xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 transition-all outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Promo Options Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold tracking-wide text-slate-300">
                      Discount (%)
                    </label>
                    <div className="relative">
                      <Percent className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type="number"
                        min="0"
                        max="100"
                        placeholder="e.g. 25"
                        value={newBanner.discountPercentage}
                        onChange={(e) =>
                          setNewBanner({
                            ...newBanner,
                            discountPercentage: e.target.value,
                          })
                        }
                        className="w-full bg-slate-950/70 border border-slate-800 focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/20 rounded-2xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 transition-all outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold tracking-wide text-slate-300">
                      Promo Code
                    </label>
                    <div className="relative">
                      <Tag className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type="text"
                        placeholder="PROMO2026"
                        value={newBanner.promoCode}
                        onChange={(e) =>
                          setNewBanner({
                            ...newBanner,
                            promoCode: e.target.value,
                          })
                        }
                        className="w-full bg-slate-950/70 border border-slate-800 focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/20 rounded-2xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 transition-all outline-none uppercase font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Scheduling Grid with Fixed Custom Pickers */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold tracking-wide text-slate-300">
                      Start Date
                    </label>
                    <div className="relative">
                      <Calendar className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-500/80 pointer-events-none" />
                      <input
                        type="datetime-local"
                        value={newBanner.startDate}
                        onChange={(e) =>
                          setNewBanner({
                            ...newBanner,
                            startDate: e.target.value,
                          })
                        }
                        className="w-full bg-slate-950/70 border border-slate-800 focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/20 rounded-2xl pl-10 pr-4 py-2.5 text-sm text-slate-100 transition-all outline-none color-scheme-dark [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert-[0.8] [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold tracking-wide text-slate-300">
                      End Date
                    </label>
                    <div className="relative">
                      <Calendar className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-500/80 pointer-events-none" />
                      <input
                        type="datetime-local"
                        value={newBanner.endDate}
                        onChange={(e) =>
                          setNewBanner({
                            ...newBanner,
                            endDate: e.target.value,
                          })
                        }
                        className="w-full bg-slate-950/70 border border-slate-800 focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/20 rounded-2xl pl-10 pr-4 py-2.5 text-sm text-slate-100 transition-all outline-none color-scheme-dark [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert-[0.8] [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                {/* Status Switcher Box */}
                <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-950/50 border border-slate-800/80 mt-2">
                  <div className="space-y-0.5">
                    <span className="text-sm font-bold text-slate-200 block">
                      Active Status
                    </span>
                    <span className="text-xs text-slate-400 block">
                      Enable banner immediately upon creation
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setNewBanner({
                        ...newBanner,
                        isActive: !newBanner.isActive,
                      })
                    }
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      newBanner.isActive ? "bg-amber-500" : "bg-slate-800"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-slate-950 shadow-lg ring-0 transition duration-200 ease-in-out ${
                        newBanner.isActive ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Modal Footer Actions */}
              <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-800/80 bg-slate-900/60 backdrop-blur-md shrink-0">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-slate-400 hover:text-slate-200 text-sm font-semibold hover:bg-slate-800/60 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-sm font-black transition-all shadow-lg shadow-amber-500/20 active:scale-95 disabled:opacity-50"
                >
                  {isCreating ? "Saving..." : "Save Banner"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
                <h2 className="text-2xl font-black text-white">
                  {selectedBanner.title}
                </h2>
                {selectedBanner.description && (
                  <p className="text-slate-300 text-xs line-clamp-2">
                    {selectedBanner.description}
                  </p>
                )}
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
