export declare enum BalanceType {
    Gold = "Gold",
    Silver = "Silver",
    Goldbar = "Goldbar",
    Silverbar = "Silverbar",
    Card = "Card"
}
export declare const convertBalanceType: (type: string) => BalanceType;
