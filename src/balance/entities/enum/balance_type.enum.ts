export enum BalanceType {
  Gold = "Gold",
  Silver = "Silver",
  Goldbar = "Goldbar",
  Silverbar = "Silverbar",
  Card = "Card",
}

export const convertBalanceType = (type: string): BalanceType => {
  if (type == "Gold") {
    return BalanceType.Gold
  }
  else if (type == "Silver") {
    return BalanceType.Silver
  }
  else if (type == "Goldbar") {
    return BalanceType.Goldbar
  }
  else if (type == "Silverbar") {
    return BalanceType.Silverbar
  }
  else {
    return BalanceType.Card
  }
}
