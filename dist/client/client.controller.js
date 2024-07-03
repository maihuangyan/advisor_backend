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
exports.ClientController = void 0;
const common_1 = require("@nestjs/common");
const roles_decorator_1 = require("../guards/roles.decorator");
const const_1 = require("../utils/const");
const base_controller_1 = require("../_base/base.controller");
const client_service_1 = require("./client.service");
const create_client_dto_1 = require("./dto/create-client.dto");
const role_enum_1 = require("../guards/enum/role.enum");
const user_service_1 = require("../user/user.service");
let ClientController = class ClientController extends base_controller_1.BaseController {
    constructor(clientService, userService) {
        super();
        this.clientService = clientService;
        this.userService = userService;
    }
    create(createClientDto) {
        return this.clientService.create(createClientDto);
    }
    findAll() {
        return this.clientService.findAll();
    }
    async find(req, query) {
        const page = query.page;
        const limit = query.limit;
        const status = query.status;
        const search_key = query.q;
        const displayCurrency = await this.userService.getAdvisorDisplayCurrency(req.user.id);
        return this.response(await this.clientService.find([], +page, +limit, status, search_key, displayCurrency));
    }
    async findOneByEmail(email) {
        if (email) {
            const client = await this.clientService.findOneByEmail(email);
            if (client) {
                return this.response(this.clientService.addUserFields(client));
            }
            else {
                return this.response({
                    error: const_1.m_constants.RESPONSE_ERROR.resCodeInvalidData,
                });
            }
        }
        else {
            return this.response({
                error: const_1.m_constants.RESPONSE_ERROR.resCodeInvalidData,
            });
        }
    }
    async balances(req, id) {
        const displayCurrency = await this.userService.getAdvisorDisplayCurrency(req.user.id);
        if (isNaN(id) || id <= 0) {
            return this.response({
                error: const_1.m_constants.RESPONSE_ERROR.resCodeInvalidData,
            });
        }
        return this.response(await this.clientService.clientBalances(displayCurrency, id));
    }
    async transactions(params) {
        return this.response(await this.clientService.clientTransactions(params.account_number, params.start, params.end));
    }
    async cardTransactions(params) {
        return this.response(await this.clientService.clientCardTransactions(params.card_number, params.card_currency, params.year, params.month));
    }
    async getFees(email) {
        this.consoleLog(email);
        return this.response(await this.clientService.getFees(email));
    }
    async findOne(id) {
        return this.response(this.clientService.addUserFields(await this.clientService.findOne(+id)));
    }
    update(id, dto) {
        return this.clientService.update(+id, dto);
    }
    remove(id) {
        return this.clientService.remove(+id);
    }
    photo(filename, res) {
        return res.sendFile(filename, { root: "uploads/client" });
    }
};
__decorate([
    common_1.Post(),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_client_dto_1.CreateClientDto]),
    __metadata("design:returntype", void 0)
], ClientController.prototype, "create", null);
__decorate([
    common_1.Get(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ClientController.prototype, "findAll", null);
__decorate([
    common_1.Get("search"),
    __param(0, common_1.Request()),
    __param(1, common_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ClientController.prototype, "find", null);
__decorate([
    common_1.Get("find_by_email"),
    __param(0, common_1.Query("email")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ClientController.prototype, "findOneByEmail", null);
__decorate([
    common_1.Get("balances/:id"),
    __param(0, common_1.Request()),
    __param(1, common_1.Param("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], ClientController.prototype, "balances", null);
__decorate([
    common_1.Get("transactions"),
    __param(0, common_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ClientController.prototype, "transactions", null);
__decorate([
    common_1.Get("card_transactions"),
    __param(0, common_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ClientController.prototype, "cardTransactions", null);
__decorate([
    common_1.Get("fees"),
    __param(0, common_1.Query("email")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ClientController.prototype, "getFees", null);
__decorate([
    common_1.Get(":id"),
    __param(0, common_1.Param("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ClientController.prototype, "findOne", null);
__decorate([
    common_1.Patch(":id"),
    __param(0, common_1.Param("id")),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_client_dto_1.CreateClientDto]),
    __metadata("design:returntype", void 0)
], ClientController.prototype, "update", null);
__decorate([
    common_1.Delete(":id"),
    __param(0, common_1.Param("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ClientController.prototype, "remove", null);
__decorate([
    roles_decorator_1.Public(),
    common_1.Get("photo/:filename"),
    __param(0, common_1.Param("filename")),
    __param(1, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ClientController.prototype, "photo", null);
ClientController = __decorate([
    common_1.Controller("client"),
    __param(1, common_1.Inject(common_1.forwardRef(() => user_service_1.UserService))),
    __metadata("design:paramtypes", [client_service_1.ClientService,
        user_service_1.UserService])
], ClientController);
exports.ClientController = ClientController;
//# sourceMappingURL=client.controller.js.map