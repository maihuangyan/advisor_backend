"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertMetalCurrency = exports.MetalCurrency = void 0;
var MetalCurrency;
(function (MetalCurrency) {
    MetalCurrency["XAU"] = "XAU";
    MetalCurrency["XAG"] = "XAG";
    MetalCurrency["GEA"] = "GEA";
    MetalCurrency["SEA"] = "SEA";
    MetalCurrency["GPA"] = "GPA";
    MetalCurrency["SPA"] = "SPA";
    MetalCurrency["GKS"] = "GKS";
    MetalCurrency["SKS"] = "SKS";
    MetalCurrency["GBB"] = "GBB";
    MetalCurrency["SBB"] = "SBB";
    MetalCurrency["GSV"] = "GSV";
})(MetalCurrency = exports.MetalCurrency || (exports.MetalCurrency = {}));
const convertMetalCurrency = (currency) => {
    switch (currency) {
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
};
exports.convertMetalCurrency = convertMetalCurrency;
//# sourceMappingURL=metal_currency.enum.js.map