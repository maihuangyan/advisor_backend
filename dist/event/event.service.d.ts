import { ConnectionService } from "src/connection/connection.service";
import { UserService } from "src/user/user.service";
import { WorkTimeService } from "src/work-time/work-time.service";
import { Repository } from "typeorm";
import { CreateEventDto } from "./dto/create-event.dto";
import { UpdateEventDto } from "./dto/update-event.dto";
import { Event } from "./entities/event.entity";
import { ZoomService } from "src/zoom/zoom.service";
import { BaseService } from "src/_base/base.service";
export declare class EventService extends BaseService {
    private mRepository;
    private readonly connectionService;
    private readonly worktimeService;
    private readonly userService;
    private readonly zoomService;
    constructor(mRepository: Repository<Event>, connectionService: ConnectionService, worktimeService: WorkTimeService, userService: UserService, zoomService: ZoomService);
    create(dto: CreateEventDto): Promise<Event | {
        error: number;
    }>;
    getDateStartSeconds(seconds: string | number): number;
    getDateEndSeconds(seconds: string | number): number;
    scheduledMeetingsInDuration(advisor_id: number, start: number, end: number): Promise<Event[]>;
    scheduleMeeting(client: any, data: any): Promise<any>;
    cancelMeeting(client: any, data: any): Promise<any>;
    availableTimeSlots(client: any, data: any): Promise<any[] | {
        error: number;
    }>;
    eventsBetween(advisor_id: number, start: number, end: number): Promise<Event[]>;
    checkScheduledMeeting(client: any): Promise<any>;
    findScheduledMeeting(advisor_id: number, client_id: number): Promise<Event>;
    findAdvisorScheduledMeetingWithTime(advisor_id: number, time: number): Promise<Event>;
    findAdvisorEvents(advisor_id: number, calendars: string[]): Promise<Event[]>;
    findOne(id: number): Promise<Event>;
    update(user: any, id: number, dto: UpdateEventDto): Promise<Event | {
        error: number;
    }>;
    removeEvent(user: any, id: number): Promise<any>;
    remove(id: number): Promise<import("typeorm").DeleteResult>;
}
