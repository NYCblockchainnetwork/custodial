
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
    currencyCode: product.currencyCode,
    apy: product.apy,
    description: product.description || "",
    name: product.name || product.currencyCode,
    minDeposit: product.minDeposit || 0,
    maxDeposit: product.maxDeposit || 0,
    riskLevel: product.riskLevel || "medium"
  };
};
