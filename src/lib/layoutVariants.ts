export const formLayouts = {
  default: "bg-white border rounded-lg p-6 space-y-4",
  dark: "bg-gray-900 text-white border-gray-700 rounded-lg p-6 space-y-4",
  bright: "bg-orange-50 border-orange-200 rounded-lg p-6 space-y-4",
  pastel: "bg-green-50 border-green-200 rounded-lg p-6 space-y-4",
  monochrome: "bg-gray-100 border-gray-300 rounded-lg p-6 space-y-4"
} as const;

export const offerLayouts = {
  default: "bg-[#F1F0FB] text-[#222222] hover:bg-[#E7E6F7]",
  dark: "bg-[#221F26] text-[#F1F1F1] hover:bg-[#2A2631]",
  bright: "bg-white text-[#333333] hover:bg-orange-50",
  pastel: "bg-[#F2FCE2] text-[#555555] hover:bg-[#E8F8D8]",
  monochrome: "bg-[#8E9196] text-white hover:bg-[#7A7D82]"
} as const;

export type LayoutVariant = keyof typeof formLayouts;