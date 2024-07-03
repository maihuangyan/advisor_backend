"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertBalanceType = exports.BalanceType = void 0;
var BalanceType;
(function (BalanceType) {
    BalanceType["Gold"] = "Gold";
    BalanceType["Silver"] = "Silver";
    BalanceType["Goldbar"] = "Goldbar";
    BalanceType["Silverbar"] = "Silverbar";
    BalanceType["Card"] = "Card";
})(BalanceType = exports.BalanceType || (exports.BalanceType = {}));
const convertBalanceType = (type) => {
    if (type == "Gold") {
        return BalanceType.Gold;
    }
    else if (type == "Silver") {
        return BalanceType.Silver;
    }
    else if (type == "Goldbar") {
        return BalanceType.Goldbar;
    }
    else if (type == "Silverbar") {
        return BalanceType.Silverbar;
    }
    else {
        return BalanceType.Card;
    }
};
exports.convertBalanceType = convertBalanceType;
//# sourceMappingURL=balance_type.enum.js.map