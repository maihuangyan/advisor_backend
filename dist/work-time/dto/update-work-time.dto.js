"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateWorkTimeDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_work_time_dto_1 = require("./create-work-time.dto");
class UpdateWorkTimeDto extends mapped_types_1.PartialType(create_work_time_dto_1.CreateWorkTimeDto) {
}
exports.UpdateWorkTimeDto = UpdateWorkTimeDto;
//# sourceMappingURL=update-work-time.dto.js.map