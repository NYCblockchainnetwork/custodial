export const formLayouts = {
  default: "bg-white border rounded-lg p-6 space-y-4",
  dark: "bg-gray-900 text-white border-gray-700 rounded-lg p-6 space-y-4",
  bright: "bg-orange-50 border-orange-200 rounded-lg p-6 space-y-4",
  pastel: "bg-green-50 border-green-200 rounded-lg p-6 space-y-4",
  monochrome: "bg-gray-100 border-gray-300 rounded-lg p-6 space-y-4",
  minimal: "bg-white border-none shadow-sm rounded-lg p-6 space-y-4",
  glass: "bg-white/80 backdrop-blur-sm border border-white/20 rounded-lg p-6 space-y-4",
  gradient: "bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-100 rounded-lg p-6 space-y-4"
} as const;

export const offerLayouts = {
  default: "bg-[#F1F0FB] text-[#222222] hover:bg-[#E7E6F7]",
  dark: "bg-[#221F26] text-[#F1F1F1] hover:bg-[#2A2631] border-gray-700",
  bright: "bg-gradient-to-r from-orange-100 to-rose-100 text-[#333333] hover:from-orange-200 hover:to-rose-200",
  pastel: "bg-[#F2FCE2] text-[#555555] hover:bg-[#E8F8D8] border-green-200",
  monochrome: "bg-[#8E9196] text-white hover:bg-[#7A7D82]",
  minimal: "bg-white shadow-sm hover:shadow-md transition-shadow",
  glass: "bg-white/80 backdrop-blur-sm border border-white/20 hover:bg-white/90",
  gradient: "bg-gradient-to-br from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100"
} as const;

export type LayoutVariant = keyof typeof formLayouts;