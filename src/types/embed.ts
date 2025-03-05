
import { EarnProduct as BaseEarnProduct } from "./earn";

// Extended product type for embedding
export interface EmbedEarnProduct {
  id: string;
  currencyCode: string;
  apy: number;
  description?: string;
  minDeposit?: number;  // Make optional to support both API versions
  maxDeposit?: number;  // Make optional to support both API versions
  riskLevel?: string;   // Make optional to support both API versions
  name?: string;        // Make optional to support both API versions
}

// Type adapter function to convert between product types
export const adaptProductToEarnType = (product: EmbedEarnProduct): BaseEarnProduct => {
  return {
    id: product.id,
    currency: product.currencyCode, // Map currencyCode to currency
    apy: product.apy,
    description: product.description || "",
    name: product.name || product.currencyCode,
    minDeposit: product.minDeposit || 0,
    maxDeposit: product.maxDeposit || 0,
    riskLevel: mapRiskLevel(product.riskLevel || "medium")
  };
};

// Helper function to map any risk level string to the allowed values
function mapRiskLevel(risk: string): "Low" | "Medium" | "High" {
  const riskLower = risk.toLowerCase();
  if (riskLower === "low") return "Low";
  if (riskLower === "high") return "High";
  return "Medium"; // Default to Medium for any other value
}
