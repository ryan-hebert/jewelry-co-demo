export interface CustomizationRequest {
  productId: number;
  metal: string;
  stone: string;
  caratSize: string;
  ringSize?: string;
  necklaceSize?: string;
}

export interface CustomizationResponse {
  product: string;
  finalPrice: number;
  customizations: {
    metal: string;
    stone: string;
    caratSize: string;
    ringSize?: string;
    necklaceSize?: string;
  };
}

// Available options
export const METAL_OPTIONS = ['Silver', 'Gold', 'Rose Gold'] as const;
export const STONE_OPTIONS = ['Diamond'] as const;
export const CARAT_OPTIONS = ['1ct', '2ct', '3ct'] as const;
export const RING_SIZE_OPTIONS = ['5', '6', '7', '8', '9', '10'] as const;
export const NECKLACE_SIZE_OPTIONS = ['18"', '20"', '22"'] as const;

export type MetalType = typeof METAL_OPTIONS[number];
export type StoneType = typeof STONE_OPTIONS[number];
export type CaratType = typeof CARAT_OPTIONS[number];
export type RingSizeType = typeof RING_SIZE_OPTIONS[number];
export type NecklaceSizeType = typeof NECKLACE_SIZE_OPTIONS[number];
