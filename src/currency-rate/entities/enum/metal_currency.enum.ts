export enum MetalCurrency {
  XAU = "XAU",
  XAG = "XAG",
  GEA = "GEA",
  SEA = "SEA",
  GPA = "GPA",
  SPA = "SPA",
  GKS = "GKS",
  SKS = "SKS",
  GBB = "GBB",
  SBB = "SBB",
  GSV = "GSV"
}

export const convertMetalCurrency = (currency: string): MetalCurrency => {
  switch(currency) {
    case "XAU": {
      return MetalCurrency.XAU;
    }
    case "XAG": {
      return MetalCurrency.XAG;
    }
    case "GEA": {
      return MetalCurrency.GEA;
    }
    case "SEA": {
      return MetalCurrency.SEA;
    }
    case "GPA": {
      return MetalCurrency.GPA;
    }
    case "SPA": {
      return MetalCurrency.SPA;
    }
    case "GKS": {
      return MetalCurrency.GKS;
    }
    case "SKS": {
      return MetalCurrency.SKS;
    }
    case "GBB": {
      return MetalCurrency.GBB;
    }
    case "SBB": {
      return MetalCurrency.SBB;
    }
    case "GSV": {
      return MetalCurrency.GSV;
    }
    default: {
      return MetalCurrency.GEA;
    }
  }
}
