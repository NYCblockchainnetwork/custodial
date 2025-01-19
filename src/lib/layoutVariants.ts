export const formLayouts = {
  default: "bg-white border rounded-lg p-6 space-y-4",
  dark: "bg-gray-900 text-white border-gray-700 rounded-lg p-6 space-y-4",
  bright: "bg-orange-50 border-orange-200 rounded-lg p-6 space-y-4",
  pastel: "bg-green-50 border-green-200 rounded-lg p-6 space-y-4",
  monochrome: "bg-gray-100 border-gray-300 rounded-lg p-6 space-y-4",
  minimal: "bg-white border-none shadow-sm rounded-lg p-6 space-y-4",
  glass: "bg-white/80 backdrop-blur-sm border border-white/20 rounded-lg p-6 space-y-4",
  gradient: "bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-100 rounded-lg p-6 space-y-4",
  modern: "bg-white rounded-xl p-6 space-y-4 shadow-[0_0_15px_rgba(0,0,0,0.05)] border border-slate-100 hover:shadow-[0_0_20px_rgba(0,0,0,0.1)] transition-shadow duration-300",
  futuristic: "bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 text-white border border-purple-500/30 rounded-2xl p-6 space-y-4 shadow-[0_0_30px_rgba(168,85,247,0.15)] backdrop-blur-lg hover:shadow-[0_0_40px_rgba(168,85,247,0.25)] transition-all duration-500"
} as const;

export const offerLayouts = {
  default: "bg-[#F1F0FB] text-[#222222] hover:bg-[#E7E6F7]",
  dark: "bg-[#221F26] text-[#F1F1F1] hover:bg-[#2A2631] border-gray-700",
  bright: "bg-gradient-to-r from-orange-100 to-rose-100 text-[#333333] hover:from-orange-200 hover:to-rose-200",
  pastel: "bg-[#F2FCE2] text-[#555555] hover:bg-[#E8F8D8] border-green-200",
  monochrome: "bg-[#8E9196] text-white hover:bg-[#7A7D82]",
  minimal: "bg-white shadow-sm hover:shadow-md transition-shadow",
  glass: "bg-white/80 backdrop-blur-sm border border-white/20 hover:bg-white/90",
  gradient: "bg-gradient-to-br from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100",
  modern: "bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-slate-100 hover:border-slate-200",
  futuristic: "bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 text-white border border-purple-500/30 rounded-2xl shadow-[0_4px_20px_rgba(168,85,247,0.25)] hover:shadow-[0_8px_30px_rgba(168,85,247,0.35)] backdrop-blur-lg transition-all duration-500"
} as const;

export type LayoutVariant = keyof typeof formLayouts;