"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCurrencyRateDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_currency_rate_dto_1 = require("./create-currency-rate.dto");
class UpdateCurrencyRateDto extends mapped_types_1.PartialType(create_currency_rate_dto_1.CreateCurrencyRateDto) {
}
exports.UpdateCurrencyRateDto = UpdateCurrencyRateDto;
//# sourceMappingURL=update-currency-rate.dto.js.map