"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCommissionDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_commission_dto_1 = require("./create-commission.dto");
class UpdateCommissionDto extends mapped_types_1.PartialType(create_commission_dto_1.CreateCommissionDto) {
}
exports.UpdateCommissionDto = UpdateCommissionDto;
//# sourceMappingURL=update-commission.dto.js.map