export interface RepairPricingTemplate {
  id: string
  name: string
  brand: string
  customBrand?: string
  model: string
  customModel?: string
  issue: string
  customIssue?: string
  price: number
  partsCost: number
  laborCost: number
  estimatedTime: string
  notes?: string
}

export const initialPricingTemplates: RepairPricingTemplate[] = [
  {
    id: "tpl-1",
    name: "iPhone 13 Pro Max Screen Repair",
    brand: "Apple",
    model: "iPhone 13 Pro Max",
    issue: "Cracked Screen",
    price: 280.0,
    partsCost: 200.0,
    laborCost: 80.0,
    estimatedTime: "1-2 hours",
    notes: "Includes OEM screen replacement.",
  },
  {
    id: "tpl-2",
    name: "Samsung S22 Battery Replacement",
    brand: "Samsung",
    model: "Galaxy S22",
    issue: "Battery Replacement",
    price: 110.0,
    partsCost: 50.0,
    laborCost: 60.0,
    estimatedTime: "45-60 minutes",
    notes: "Uses high-capacity aftermarket battery.",
  },
  {
    id: "tpl-3",
    name: "iPad Air Charging Port Fix",
    brand: "Apple",
    model: "iPad Air",
    issue: "Charging Port",
    price: 170.0,
    partsCost: 80.0,
    laborCost: 90.0,
    estimatedTime: "2-3 hours",
    notes: "Micro-soldering required.",
  },
  {
    id: "tpl-4",
    name: "Google Pixel 7 Water Damage Diagnostic",
    brand: "Google",
    model: "Pixel 7",
    issue: "Water Damage",
    price: 50.0,
    partsCost: 0.0,
    laborCost: 50.0,
    estimatedTime: "2-3 days (diagnostic)",
    notes: "Diagnostic fee only. Repair cost quoted after assessment.",
  },
  {
    id: "tpl-5",
    name: "iPhone 14 Pro Camera Repair",
    brand: "Apple",
    model: "iPhone 14 Pro",
    issue: "Camera Repair",
    price: 270.0,
    partsCost: 180.0,
    laborCost: 90.0,
    estimatedTime: "1-2 hours",
    notes: "Rear camera module replacement.",
  },
]
