"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZoomController = void 0;
const common_1 = require("@nestjs/common");
const roles_decorator_1 = require("../guards/roles.decorator");
const base_controller_1 = require("../_base/base.controller");
const zoom_service_1 = require("./zoom.service");
const nexerone_service_1 = require("../nexerone/nexerone.service");
let ZoomController = class ZoomController extends base_controller_1.BaseController {
    constructor(zoomService, nexeronService) {
        super();
        this.zoomService = zoomService;
        this.nexeronService = nexeronService;
    }
    async generateZoomAuthToken(req) {
        const clientToken = req.headers.accesstoken;
        if (clientToken) {
            const result = await this.nexeronService.verifyClientToken(clientToken);
            if (result.error) {
                return this.response(result);
            }
        }
        return this.response(this.zoomService.generateJWT());
    }
};
__decorate([
    roles_decorator_1.Public(),
    common_1.Get("auth_token"),
    __param(0, common_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ZoomController.prototype, "generateZoomAuthToken", null);
ZoomController = __decorate([
    common_1.Controller("zoom"),
    __metadata("design:paramtypes", [zoom_service_1.ZoomService,
        nexerone_service_1.NexeroneService])
], ZoomController);
exports.ZoomController = ZoomController;
//# sourceMappingURL=zoom.controller.js.map