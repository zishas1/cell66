export interface BaseProduct {
  id: string
  name: string
  sku: string
  price: number
  cost: number
  category: string
  carrier: string
  description: string
  image: string
}

export interface RegularProduct extends BaseProduct {
  type: "regular"
  stock: number
}

export interface SerializedProduct extends BaseProduct {
  type: "serialized"
  imeis: string[] // All IMEIs for this SKU, regardless of status
  availableImeis: string[] // IMEIs currently in stock
  soldImeis: string[] // IMEIs that have been sold
}

export type Product = RegularProduct | SerializedProduct

export const mockProducts: Product[] = [
  {
    id: "IPH15PM-256-BLU",
    name: "iPhone 15 Pro Max",
    sku: "IPH15PM-256-BLU",
    category: "Smartphones",
    carrier: "Unlocked",
    cost: 899.99,
    price: 1199.99,
    type: "serialized",
    imeis: ["IMEI001", "IMEI002", "IMEI003", "IMEI004", "IMEI005"],
    availableImeis: ["IMEI001", "IMEI002", "IMEI003", "IMEI004", "IMEI005"],
    soldImeis: [],
    description: "Latest iPhone model with A17 Bionic chip and ProMotion display.",
    image: "/placeholder.svg?height=100&width=100&text=iPhone 15 Pro Max",
  },
  {
    id: "SGS24U-512-BLK",
    name: "Samsung Galaxy S24 Ultra",
    sku: "SGS24U-512-BLK",
    category: "Smartphones",
    carrier: "Verizon",
    cost: 849.99,
    price: 1299.99,
    type: "serialized",
    imeis: ["IMEI006", "IMEI007", "IMEI008"],
    availableImeis: ["IMEI006", "IMEI007", "IMEI008"],
    soldImeis: [],
    description: "Flagship Android phone with S Pen and advanced camera system.",
    image: "/placeholder.svg?height=100&width=100&text=Galaxy S24 Ultra",
  },
  {
    id: "APP2-WHT",
    name: "AirPods Pro 2nd Gen",
    sku: "APP2-WHT",
    category: "Accessories",
    carrier: "N/A",
    cost: 179.99,
    price: 249.99,
    type: "regular",
    stock: 15,
    description: "Premium wireless earbuds with Active Noise Cancellation.",
    image: "/placeholder.svg?height=100&width=100&text=AirPods Pro 2",
  },
  {
    id: "CASE-IPH15PM",
    name: "iPhone 15 Pro Max Case",
    sku: "CASE-IPH15PM",
    category: "Accessories",
    carrier: "N/A",
    cost: 15.0,
    price: 30.0,
    type: "regular",
    stock: 50,
    description: "Durable protective case for iPhone 15 Pro Max.",
    image: "/placeholder.svg?height=100&width=100&text=iPhone Case",
  },
  {
    id: "SCRN-PROT-S24U",
    name: "Galaxy S24 Ultra Screen Protector",
    sku: "SCRN-PROT-S24U",
    category: "Accessories",
    carrier: "N/A",
    cost: 5.0,
    price: 15.0,
    type: "regular",
    stock: 100,
    description: "Tempered glass screen protector for Galaxy S24 Ultra.",
    image: "/placeholder.svg?height=100&width=100&text=Screen Protector",
  },
  {
    id: "USM-SIM",
    name: "US Mobile SIM Card",
    sku: "USM-SIM",
    category: "Activations",
    carrier: "US Mobile",
    cost: 0.5,
    price: 5.0,
    type: "regular",
    stock: 200,
    description: "Starter SIM card for US Mobile network.",
    image: "/placeholder.svg?height=100&width=100&text=US Mobile SIM",
  },
]
