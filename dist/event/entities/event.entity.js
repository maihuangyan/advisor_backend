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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Event = void 0;
const typeorm_1 = require("typeorm");
const calendar_enum_1 = require("../calendar.enum");
const create_event_dto_1 = require("../dto/create-event.dto");
let Event = class Event {
    constructor(dto) {
        if (!dto)
            return;
        this.title = dto.title;
        this.description = dto.description;
        this.start = dto.start;
        this.end = dto.end;
        this.calendar = dto.calendar;
        this.all_day = dto.all_day;
        this.advisor_id = dto.advisor_id;
        this.client_id = dto.client_id;
        this.zoom_meeting_id = dto.zoom_meeting_id;
        this.zoom_meeting_join_url = dto.zoom_meeting_join_url;
        this.zoom_meeting_password = dto.zoom_meeting_password;
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Event.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Event.prototype, "title", void 0);
__decorate([
    typeorm_1.Column({ default: "" }),
    __metadata("design:type", String)
], Event.prototype, "description", void 0);
__decorate([
    typeorm_1.Column({ default: "" }),
    __metadata("design:type", String)
], Event.prototype, "zoom_meeting_id", void 0);
__decorate([
    typeorm_1.Column({ default: "" }),
    __metadata("design:type", String)
], Event.prototype, "zoom_meeting_password", void 0);
__decorate([
    typeorm_1.Column({ default: "" }),
    __metadata("design:type", String)
], Event.prototype, "zoom_meeting_join_url", void 0);
__decorate([
    typeorm_1.Column({ type: "varchar", length: 10, default: "0" }),
    __metadata("design:type", String)
], Event.prototype, "start", void 0);
__decorate([
    typeorm_1.Column({ type: "varchar", length: 10, default: "0" }),
    __metadata("design:type", String)
], Event.prototype, "end", void 0);
__decorate([
    typeorm_1.Column({
        type: "enum",
        enum: calendar_enum_1.Calendar,
        default: calendar_enum_1.Calendar.Personal,
    }),
    __metadata("design:type", String)
], Event.prototype, "calendar", void 0);
__decorate([
    typeorm_1.Column({ type: "tinyint", width: 4, default: 0 }),
    __metadata("design:type", Number)
], Event.prototype, "all_day", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], Event.prototype, "advisor_id", void 0);
__decorate([
    typeorm_1.Column({ default: 0 }),
    __metadata("design:type", Number)
], Event.prototype, "client_id", void 0);
__decorate([
    typeorm_1.Column({ type: "tinyint", width: 4, default: 0 }),
    __metadata("design:type", Number)
], Event.prototype, "created_by", void 0);
__decorate([
    typeorm_1.Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" }),
    __metadata("design:type", Date)
], Event.prototype, "created_at", void 0);
__decorate([
    typeorm_1.Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" }),
    __metadata("design:type", Date)
], Event.prototype, "updated_at", void 0);
__decorate([
    typeorm_1.Column({ type: "tinyint", width: 4, default: 1 }),
    __metadata("design:type", Number)
], Event.prototype, "status", void 0);
Event = __decorate([
    typeorm_1.Entity(),
    __metadata("design:paramtypes", [create_event_dto_1.CreateEventDto])
], Event);
exports.Event = Event;
//# sourceMappingURL=event.entity.js.map