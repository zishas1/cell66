export interface DefaultRepairPrice {
  id: string
  brand: string
  model: string
  issue: string
  partCost: number
  laborCost: number
  estimatedCost: number
}

export const defaultRepairPrices: DefaultRepairPrice[] = [
  {
    id: "DRP001",
    brand: "Apple",
    model: "iPhone 13",
    issue: "Screen Replacement",
    partCost: 150.0,
    laborCost: 75.0,
    estimatedCost: 225.0,
  },
  {
    id: "DRP002",
    brand: "Apple",
    model: "iPhone 13",
    issue: "Battery Replacement",
    partCost: 50.0,
    laborCost: 40.0,
    estimatedCost: 90.0,
  },
  {
    id: "DRP003",
    brand: "Samsung",
    model: "Galaxy S21",
    issue: "Screen Replacement",
    partCost: 180.0,
    laborCost: 80.0,
    estimatedCost: 260.0,
  },
  {
    id: "DRP004",
    brand: "Samsung",
    model: "Galaxy S21",
    issue: "Charging Port Repair",
    partCost: 30.0,
    laborCost: 50.0,
    estimatedCost: 80.0,
  },
  {
    id: "DRP005",
    brand: "Google",
    model: "Pixel 6",
    issue: "Camera Repair",
    partCost: 70.0,
    laborCost: 60.0,
    estimatedCost: 130.0,
  },
  {
    id: "DRP006",
    brand: "Apple",
    model: "iPhone 14",
    issue: "Screen Replacement",
    partCost: 180.0,
    laborCost: 80.0,
    estimatedCost: 260.0,
  },
  {
    id: "DRP007",
    brand: "Apple",
    model: "iPhone 14",
    issue: "Battery Replacement",
    partCost: 60.0,
    laborCost: 45.0,
    estimatedCost: 105.0,
  },
  {
    id: "DRP008",
    brand: "Samsung",
    model: "Galaxy S22",
    issue: "Screen Replacement",
    partCost: 200.0,
    laborCost: 85.0,
    estimatedCost: 285.0,
  },
  {
    id: "DRP009",
    brand: "Google",
    model: "Pixel 7",
    issue: "Charging Port Repair",
    partCost: 35.0,
    laborCost: 55.0,
    estimatedCost: 90.0,
  },
  {
    id: "DRP010",
    brand: "Apple",
    model: "iPhone 12",
    issue: "Screen Replacement",
    partCost: 120.0,
    laborCost: 70.0,
    estimatedCost: 190.0,
  },
  {
    id: "DRP011",
    brand: "Apple",
    model: "iPhone 12",
    issue: "Battery Replacement",
    partCost: 45.0,
    laborCost: 35.0,
    estimatedCost: 80.0,
  },
  {
    id: "DRP012",
    brand: "Samsung",
    model: "Galaxy S20",
    issue: "Screen Replacement",
    partCost: 160.0,
    laborCost: 75.0,
    estimatedCost: 235.0,
  },
  {
    id: "DRP013",
    brand: "Google",
    model: "Pixel 5",
    issue: "Camera Repair",
    partCost: 60.0,
    laborCost: 50.0,
    estimatedCost: 110.0,
  },
]

export function getBrands(): string[] {
  const brands = new Set(defaultRepairPrices.map((price) => price.brand))
  return Array.from(brands).sort()
}

export function getModelsByBrand(brand: string): string[] {
  const models = new Set(defaultRepairPrices.filter((price) => price.brand === brand).map((price) => price.model))
  return Array.from(models).sort()
}

export function getIssuesByBrandAndModel(brand: string, model: string): string[] {
  const issues = new Set(
    defaultRepairPrices.filter((price) => price.brand === brand && price.model === model).map((price) => price.issue),
  )
  return Array.from(issues).sort()
}

export function getIssuesWithPricingByBrandAndModel(
  brand: string,
  model: string,
): { issue: string; estimatedCost: number; laborCost: number }[] {
  return defaultRepairPrices
    .filter((price) => price.brand === brand && price.model === model)
    .map((price) => ({
      issue: price.issue,
      estimatedCost: price.estimatedCost,
      laborCost: price.laborCost,
    }))
    .sort((a, b) => a.issue.localeCompare(b.issue))
}

export function getPricingForIssue(brand: string, model: string, issue: string): DefaultRepairPrice | undefined {
  return defaultRepairPrices.find((price) => price.brand === brand && price.model === model && price.issue === issue)
}

export const mockBrands = getBrands
export const mockIssues = getIssuesByBrandAndModel
export const getPriceByDetails = getPricingForIssue
