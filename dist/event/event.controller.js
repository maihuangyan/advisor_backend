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
exports.EventController = void 0;
const common_1 = require("@nestjs/common");
const event_service_1 = require("./event.service");
const create_event_dto_1 = require("./dto/create-event.dto");
const update_event_dto_1 = require("./dto/update-event.dto");
const base_controller_1 = require("../_base/base.controller");
const const_1 = require("../utils/const");
const roles_decorator_1 = require("../guards/roles.decorator");
const nexerone_service_1 = require("../nexerone/nexerone.service");
let EventController = class EventController extends base_controller_1.BaseController {
    constructor(eventService, nexeronService) {
        super();
        this.eventService = eventService;
        this.nexeronService = nexeronService;
    }
    async create(req, dto) {
        const advisor_id = req.user.id;
        dto.advisor_id = advisor_id;
        return this.response(await this.eventService.create(dto));
    }
    async checkScheduledMeeting(req) {
        const clientToken = req.headers.accesstoken;
        if (clientToken) {
            const result = await this.nexeronService.verifyClientToken(clientToken);
            if (result.error) {
            }
        }
        return this.response(await this.eventService.checkScheduledMeeting(req.user));
    }
    async timeSlots(req, data) {
        const clientToken = req.headers.accesstoken;
        if (clientToken) {
            const result = await this.nexeronService.verifyClientToken(clientToken);
            if (result.error) {
                return this.response(result);
            }
        }
        return this.response(await this.eventService.availableTimeSlots(req.user, data));
    }
    async scheduleMeeting(req, data) {
        const clientToken = req.headers.accesstoken;
        if (clientToken) {
            const result = await this.nexeronService.verifyClientToken(clientToken);
            if (result.error) {
                return this.response(result);
            }
        }
        return this.response(await this.eventService.scheduleMeeting(req.user, data));
    }
    async cancelMeeting(req, data) {
        const clientToken = req.headers.accesstoken;
        if (clientToken) {
            const result = await this.nexeronService.verifyClientToken(clientToken);
            if (result.error) {
                return this.response(result);
            }
        }
        const result = await this.eventService.cancelMeeting(req.user, data);
        if (result.affected) {
            return this.response("Success");
        }
        return this.response(result);
    }
    async findAdvisorEvents(req, query) {
        return this.response(await this.eventService.findAdvisorEvents(+req.user.id, Object.values(query)));
    }
    async test(req) {
        return await this.eventService.eventsBetween(2, 1638417600, 1638885600);
    }
    async findOne(id) {
        return await this.eventService.findOne(+id);
    }
    async update(req, id, updateEventDto) {
        return this.response(await this.eventService.update(req.user, +id, updateEventDto));
    }
    async remove(req, id) {
        const result = await this.eventService.removeEvent(req.user, +id);
        if (result.error) {
            return this.response(result);
        }
        if (result.affected) {
            return this.response("Success");
        }
        else {
            return this.response({
                error: const_1.m_constants.RESPONSE_ERROR.resCodeUnknownError,
            });
        }
    }
};
__decorate([
    common_1.Post(),
    __param(0, common_1.Request()),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_event_dto_1.CreateEventDto]),
    __metadata("design:returntype", Promise)
], EventController.prototype, "create", null);
__decorate([
    common_1.Get("check_scheduled_meeting"),
    __param(0, common_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EventController.prototype, "checkScheduledMeeting", null);
__decorate([
    common_1.Get("available_time_slots"),
    __param(0, common_1.Request()),
    __param(1, common_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], EventController.prototype, "timeSlots", null);
__decorate([
    common_1.Post("schedule_meeting"),
    __param(0, common_1.Request()),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], EventController.prototype, "scheduleMeeting", null);
__decorate([
    common_1.Post("cancel_meeting"),
    __param(0, common_1.Request()),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], EventController.prototype, "cancelMeeting", null);
__decorate([
    common_1.Get(),
    __param(0, common_1.Request()),
    __param(1, common_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], EventController.prototype, "findAdvisorEvents", null);
__decorate([
    roles_decorator_1.Public(),
    common_1.Get("test"),
    __param(0, common_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EventController.prototype, "test", null);
__decorate([
    common_1.Get(":id"),
    __param(0, common_1.Param("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EventController.prototype, "findOne", null);
__decorate([
    common_1.Patch(":id"),
    __param(0, common_1.Request()),
    __param(1, common_1.Param("id")),
    __param(2, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_event_dto_1.UpdateEventDto]),
    __metadata("design:returntype", Promise)
], EventController.prototype, "update", null);
__decorate([
    common_1.Delete(":id"),
    __param(0, common_1.Request()),
    __param(1, common_1.Param("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], EventController.prototype, "remove", null);
EventController = __decorate([
    common_1.Controller("event"),
    __metadata("design:paramtypes", [event_service_1.EventService,
        nexerone_service_1.NexeroneService])
], EventController);
exports.EventController = EventController;
//# sourceMappingURL=event.controller.js.map