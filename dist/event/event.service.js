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
exports.EventService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const class_validator_1 = require("class-validator");
const connection_service_1 = require("../connection/connection.service");
const role_enum_1 = require("../guards/enum/role.enum");
const user_service_1 = require("../user/user.service");
const const_1 = require("../utils/const");
const utils_1 = require("../utils/utils");
const work_time_service_1 = require("../work-time/work-time.service");
const typeorm_2 = require("typeorm");
const calendar_enum_1 = require("./calendar.enum");
const create_event_dto_1 = require("./dto/create-event.dto");
const event_entity_1 = require("./entities/event.entity");
const zoom_service_1 = require("../zoom/zoom.service");
const base_service_1 = require("../_base/base.service");
let EventService = class EventService extends base_service_1.BaseService {
    constructor(mRepository, connectionService, worktimeService, userService, zoomService) {
        super();
        this.mRepository = mRepository;
        this.connectionService = connectionService;
        this.worktimeService = worktimeService;
        this.userService = userService;
        this.zoomService = zoomService;
    }
    async create(dto) {
        const errors = await class_validator_1.validate(dto);
        if (errors.length > 0) {
            return { error: const_1.m_constants.RESPONSE_ERROR.resCodeInvalidData };
        }
        const scheduledMeetings = await this.scheduledMeetingsInDuration(+dto.advisor_id, +dto.start, +dto.end);
        if (scheduledMeetings.length > 0) {
            return { error: const_1.m_constants.RESPONSE_API_ERROR.resCodeAlreadyScheduled };
        }
        const event = new event_entity_1.Event(dto);
        return this.mRepository.save(event);
    }
    getDateStartSeconds(seconds) {
        const todaySeconds = +seconds % 86400;
        return +seconds - todaySeconds;
    }
    getDateEndSeconds(seconds) {
        const todaySeconds = +seconds % 86400;
        return +seconds - todaySeconds + 86400;
    }
    async scheduledMeetingsInDuration(advisor_id, start, end) {
        const qb = this.mRepository
            .createQueryBuilder("event")
            .where("event.advisor_id = :advisor_id", { advisor_id })
            .andWhere("event.created_by = 1")
            .andWhere(new typeorm_2.Brackets((qb) => {
            qb.where("event.start < :end and event.start > :start", {
                end,
                start,
            })
                .orWhere("event.end > :start and event.start < :end", {
                start,
                end,
            })
                .orWhere("event.start < :start and event.end > :end", {
                start,
                end,
            });
        }));
        return await qb.getMany();
    }
    async scheduleMeeting(client, data) {
        if (!data.title || !data.time) {
            return { error: const_1.m_constants.RESPONSE_ERROR.resCodeInvalidData };
        }
        this.consoleLog(data.time);
        const curSecs = new Date().getTime() / 1000;
        this.consoleLog(curSecs);
        if (!data.time || data.time < curSecs) {
            return {
                error: const_1.m_constants.RESPONSE_API_ERROR.resCodeInvalidScheduleTime,
            };
        }
        if (!client.id || !client.email) {
            return { error: const_1.m_constants.RESPONSE_ERROR.resCodeUnknownError };
        }
        const connection = await this.connectionService.findByClientEmail(client.email);
        if (!connection) {
            return { error: const_1.m_constants.RESPONSE_ERROR.resCodeUnknownError };
        }
        const advisor = await this.userService.findOne(connection.advisor_id);
        if (!advisor) {
            return { error: const_1.m_constants.RESPONSE_API_ERROR.resCodeAdvisorNotReadyForSchedule };
        }
        if (advisor.status !== 1) {
            return { error: const_1.m_constants.RESPONSE_API_ERROR.resCodeInactiveAdvisor };
        }
        const sm = await this.findScheduledMeeting(connection.advisor_id, client.id);
        if (sm) {
            return { error: const_1.m_constants.RESPONSE_API_ERROR.resCodeAlreadyScheduled };
        }
        const asm = await this.findAdvisorScheduledMeetingWithTime(connection.advisor_id, data.time);
        if (asm) {
            return {
                error: const_1.m_constants.RESPONSE_API_ERROR.resCodeAlreadyScheduledWithOther,
            };
        }
        const zoomMeeting = await this.zoomService.createMeeting(advisor, new Date(data.time * 1000));
        if (zoomMeeting.error) {
            return zoomMeeting;
        }
        let dto = new create_event_dto_1.CreateEventDto();
        dto.title = data.title;
        dto.start = data.time;
        dto.end = (+data.time + 1800).toString();
        dto.all_day = 0;
        dto.calendar = calendar_enum_1.Calendar.Business;
        dto.advisor_id = connection.advisor_id;
        dto.client_id = client.id;
        dto.created_by = 1;
        dto.zoom_meeting_id = zoomMeeting.id;
        dto.zoom_meeting_password = zoomMeeting.encrypted_password;
        dto.zoom_meeting_join_url = zoomMeeting.join_url;
        const newEvent = new event_entity_1.Event(dto);
        return await this.mRepository.save(newEvent);
    }
    async cancelMeeting(client, data) {
        this.consoleLog("client", client);
        if (!client.id || !client.email) {
            this.consoleLog(const_1.m_constants.RESPONSE_ERROR.resCodeUnknownError);
            return { error: const_1.m_constants.RESPONSE_ERROR.resCodeUnknownError };
        }
        if (!data.meeting_id) {
            this.consoleLog(const_1.m_constants.RESPONSE_ERROR.resCodeInvalidData);
            return { error: const_1.m_constants.RESPONSE_ERROR.resCodeInvalidData };
        }
        const event = await this.findOne(data.meeting_id);
        if (!event) {
            this.consoleLog(const_1.m_constants.RESPONSE_ERROR.resCodeInvalidData);
            return { error: const_1.m_constants.RESPONSE_ERROR.resCodeNotFound };
        }
        if (event.client_id != client.id) {
            this.consoleLog(const_1.m_constants.RESPONSE_ERROR.resCodeInvalidData);
            return { error: const_1.m_constants.RESPONSE_ERROR.resCodeInvalidPermisson };
        }
        if (!event.zoom_meeting_id) {
            this.consoleLog(const_1.m_constants.RESPONSE_ERROR.resCodeInvalidData);
            await this.remove(event.id);
            return { error: const_1.m_constants.RESPONSE_ERROR.resCodeInvalidData };
        }
        const result = await this.zoomService.deleteMeeting(event.zoom_meeting_id);
        if (result.error) {
            return result;
        }
        return await this.remove(data.meeting_id);
    }
    async availableTimeSlots(client, data) {
        this.consoleLog("client", client);
        if (!client.id || !client.email) {
            this.consoleLog(const_1.m_constants.RESPONSE_ERROR.resCodeUnknownError);
            return { error: const_1.m_constants.RESPONSE_ERROR.resCodeUnknownError };
        }
        if (!data.date || !data.timezone) {
            this.consoleLog(const_1.m_constants.RESPONSE_ERROR.resCodeInvalidData);
            return { error: const_1.m_constants.RESPONSE_ERROR.resCodeInvalidData };
        }
        const connection = await this.connectionService.findByClientEmail(client.email);
        if (!connection) {
            this.consoleLog(const_1.m_constants.RESPONSE_API_ERROR.resCodeInvalidAdvisor);
            return { error: const_1.m_constants.RESPONSE_API_ERROR.resCodeInvalidAdvisor };
        }
        const advisor = await this.userService.findOne(connection.advisor_id);
        if (!advisor) {
            this.consoleLog(const_1.m_constants.RESPONSE_API_ERROR.resCodeInvalidAdvisor);
            return { error: const_1.m_constants.RESPONSE_API_ERROR.resCodeInvalidAdvisor };
        }
        if (advisor.status !== 1) {
            this.consoleLog(const_1.m_constants.RESPONSE_API_ERROR.resCodeInactiveAdvisor);
            return { error: const_1.m_constants.RESPONSE_API_ERROR.resCodeInactiveAdvisor };
        }
        const clientTimezoneOffset = data.timezone
            .replace("GMT", "")
            .replace("UTC", "")
            .replace(" ", "");
        if (isNaN(clientTimezoneOffset) ||
            +clientTimezoneOffset > 12 ||
            +clientTimezoneOffset < -12) {
            this.consoleLog(const_1.m_constants.RESPONSE_ERROR.resCodeInvalidData);
            return { error: const_1.m_constants.RESPONSE_ERROR.resCodeInvalidData };
        }
        this.consoleLog("clientTimezoneOffset", clientTimezoneOffset);
        const advisorTimeZone = utils_1.getTimeZone(advisor.timezone);
        if (!advisorTimeZone) {
            this.consoleLog(const_1.m_constants.RESPONSE_API_ERROR.resCodeInvalidAdvisor);
            return {
                error: const_1.m_constants.RESPONSE_API_ERROR.resCodeAdvisorNotReadyForSchedule,
            };
        }
        var workTimes = await this.worktimeService.find(advisor.id);
        if (workTimes.length == 0) {
            workTimes = await this.worktimeService.setWorkTimes({
                user_id: advisor.id,
                start1: 36000,
                end1: 43200,
                start2: 46800,
                end2: 68400,
            });
        }
        const slots = [];
        for (let workTime of workTimes) {
            const start = workTime.start;
            const end = workTime.end;
            const restStart = start % 1800;
            var startSlot = restStart + start;
            while (startSlot + 1800 <= end) {
                slots.push(startSlot);
                startSlot += 1800;
            }
        }
        const date = new Date(data.date);
        const diff = (new Date()).getTimezoneOffset() * 60;
        const currentSeconds = date.getTime() / 1000 - diff;
        const utcDateStartTime = currentSeconds - (currentSeconds % 86400);
        this.consoleLog("utcDateStartTime: ", utcDateStartTime);
        const clientDateStartTime = utcDateStartTime - clientTimezoneOffset * 3600;
        this.consoleLog("clientDateStartTime: ", clientDateStartTime);
        const clientDateEndTime = clientDateStartTime + 86400;
        this.consoleLog("clientDateEndTime: ", clientDateEndTime);
        const advisorDateStartTime = utcDateStartTime - advisorTimeZone.offset * 3600;
        this.consoleLog("advisorDateStartTime: ", advisorDateStartTime);
        const advisorDateEndTime = advisorDateStartTime + 86400;
        this.consoleLog("advisorDateEndTime: ", advisorDateEndTime);
        const advisorPrevDateStartTime = advisorDateStartTime - 86400;
        this.consoleLog("advisorPrevDateStartTime: ", advisorPrevDateStartTime);
        this.consoleLog("slots length: ", slots.length);
        const timeSlots = [];
        slots.forEach((slot) => {
            if (clientDateStartTime < advisorPrevDateStartTime + slot &&
                advisorPrevDateStartTime + slot < clientDateEndTime) {
                timeSlots.push(advisorPrevDateStartTime + slot);
            }
            if (clientDateStartTime < advisorDateStartTime + slot &&
                advisorDateStartTime + slot < clientDateEndTime) {
                timeSlots.push(advisorDateStartTime + slot);
            }
            if (clientDateStartTime < advisorDateEndTime + slot &&
                advisorDateEndTime + slot < clientDateEndTime) {
                timeSlots.push(advisorDateEndTime + slot);
            }
        });
        const eventsForDate = await this.eventsBetween(advisor.id, clientDateStartTime, advisorDateEndTime);
        if (eventsForDate.length == 0) {
            return timeSlots;
        }
        for (let event of eventsForDate) {
            let tempTimeSlots = [...timeSlots];
            for (let i = 0; i < tempTimeSlots.length; i++) {
                const timeSlot = tempTimeSlots[i];
                if (event.start <= timeSlot && event.end > timeSlot) {
                    timeSlots.splice(timeSlots.indexOf(timeSlot), 1);
                }
            }
        }
        return timeSlots;
    }
    async eventsBetween(advisor_id, start, end) {
        const qb = this.mRepository
            .createQueryBuilder("event")
            .where("event.advisor_id = :advisor_id", { advisor_id })
            .andWhere("event.status = 1")
            .andWhere(new typeorm_2.Brackets((qb) => {
            qb.where("event.end > :start and event.end <= :end", { start, end })
                .orWhere("event.start >= :start and event.start < :end", {
                start,
                end,
            })
                .orWhere("event.start <= :start and event.end >= :end", {
                start,
                end,
            })
                .orWhere(new typeorm_2.Brackets((qb) => {
                qb.where("event.all_day = 1").andWhere(new typeorm_2.Brackets((qb) => {
                    qb.where("event.end - (event.end % 86400) + 86400 > :start and event.end - (event.end % 86400) + 86400 <= :end", { start, end })
                        .orWhere("event.start - (event.start % 86400) >= :start and event.start - (event.start % 86400) < :end", { start, end })
                        .orWhere("event.start - (event.start % 86400) <= :start and event.end - (event.end % 86400) + 86400 >= :end", { start, end });
                }));
            }));
        }));
        return await qb.getMany();
    }
    async checkScheduledMeeting(client) {
        if (!client.id || !client.email) {
            this.consoleLog(const_1.m_constants.RESPONSE_ERROR.resCodeUnknownError);
            return { error: const_1.m_constants.RESPONSE_ERROR.resCodeUnknownError };
        }
        const connection = await this.connectionService.findByClientEmail(client.email);
        if (!connection) {
            this.consoleLog(const_1.m_constants.RESPONSE_ERROR.resCodeUnknownError);
            return { error: const_1.m_constants.RESPONSE_ERROR.resCodeUnknownError };
        }
        const meeting = await this.findScheduledMeeting(connection.advisor_id, client.id);
        if (!meeting) {
            return [];
        }
        const advisor = await this.userService.findOne(connection.advisor_id);
        if (!advisor) {
            return { error: const_1.m_constants.RESPONSE_API_ERROR.resCodeInvalidAdvisor };
        }
        if (advisor.status !== 1) {
            return { error: const_1.m_constants.RESPONSE_API_ERROR.resCodeInactiveAdvisor };
        }
        const meetingsData = await this.zoomService.loadAdvisorMeetings(advisor);
        if (meetingsData.total_records > 0) {
            for (let meetingItem of meetingsData.meetings) {
                if (meetingItem.id == meeting.zoom_meeting_id) {
                    return [meeting];
                }
            }
        }
        else {
            await this.remove(meeting.id);
            return [];
        }
    }
    async findScheduledMeeting(advisor_id, client_id) {
        const curSecs = Math.round(new Date().getTime() / 1000);
        const qb = this.mRepository
            .createQueryBuilder("event")
            .where("event.advisor_id = :advisor_id", { advisor_id })
            .andWhere("event.client_id = :client_id", { client_id })
            .andWhere("event.end > :end", { end: "" + curSecs })
            .andWhere("event.status = 1");
        return await qb.getOne();
    }
    async findAdvisorScheduledMeetingWithTime(advisor_id, time) {
        const curSecs = new Date().getTime() / 1000;
        const qb = this.mRepository
            .createQueryBuilder("event")
            .where("event.advisor_id = :advisor_id", { advisor_id })
            .andWhere("event.start <= :time", { time })
            .andWhere("event.end > :time", { time })
            .andWhere("event.status = 1");
        return await qb.getOne();
    }
    async findAdvisorEvents(advisor_id, calendars) {
        this.consoleLog("calendars", calendars);
        if (calendars.length == 0) {
            return [];
        }
        const qb = this.mRepository
            .createQueryBuilder("event")
            .where("event.advisor_id = :advisor_id", { advisor_id })
            .andWhere("event.calendar IN (:...calendars)", { calendars });
        return await qb.getMany();
    }
    async findOne(id) {
        return await this.mRepository.findOne(id);
    }
    async update(user, id, dto) {
        const event = await this.findOne(id);
        if (!event) {
            return { error: const_1.m_constants.RESPONSE_API_ERROR.resCodeInvalidEventID };
        }
        if (user.role != role_enum_1.Role.Admin && user.id != event.advisor_id) {
            return { error: const_1.m_constants.RESPONSE_ERROR.resCodeInvalidPermisson };
        }
        if (user.role != role_enum_1.Role.Admin && event.created_by == 1) {
            return { error: const_1.m_constants.RESPONSE_ERROR.resCodeInvalidPermisson };
        }
        if (typeof dto.title !== "undefined") {
            event.title = dto.title;
        }
        if (typeof dto.all_day !== "undefined") {
            event.all_day = dto.all_day;
        }
        if (typeof dto.calendar !== "undefined") {
            event.calendar = dto.calendar;
        }
        if (typeof dto.start !== "undefined") {
            event.start = dto.start;
        }
        if (typeof dto.end !== "undefined") {
            event.end = dto.end;
        }
        if (typeof dto.status !== "undefined") {
            event.status = dto.status;
        }
        if (typeof dto.zoom_meeting_id !== "undefined") {
            event.zoom_meeting_id = dto.zoom_meeting_id;
        }
        if (typeof dto.zoom_meeting_password !== "undefined") {
            event.zoom_meeting_password = dto.zoom_meeting_password;
        }
        if (typeof dto.zoom_meeting_join_url !== "undefined") {
            event.zoom_meeting_join_url = dto.zoom_meeting_join_url;
        }
        if (typeof dto.description !== "undefined") {
            event.description = dto.description;
        }
        event.updated_at = new Date();
        return await this.mRepository.save(event);
    }
    async removeEvent(user, id) {
        const event = await this.findOne(id);
        if (!event) {
            return { error: const_1.m_constants.RESPONSE_API_ERROR.resCodeInvalidEventID };
        }
        if (user.role != role_enum_1.Role.Admin && user.id != event.advisor_id) {
            return { error: const_1.m_constants.RESPONSE_ERROR.resCodeInvalidPermisson };
        }
        return this.remove(id);
    }
    async remove(id) {
        return await this.mRepository.delete(id);
    }
};
EventService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(event_entity_1.Event)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        connection_service_1.ConnectionService,
        work_time_service_1.WorkTimeService,
        user_service_1.UserService,
        zoom_service_1.ZoomService])
], EventService);
exports.EventService = EventService;
//# sourceMappingURL=event.service.js.map