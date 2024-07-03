import { Calendar } from "../calendar.enum";
import { CreateEventDto } from "../dto/create-event.dto";
export declare class Event {
    id: number;
    title: string;
    description: string;
    zoom_meeting_id: string;
    zoom_meeting_password: string;
    zoom_meeting_join_url: string;
    start: string;
    end: string;
    calendar: Calendar;
    all_day: number;
    advisor_id: number;
    client_id: number;
    created_by: number;
    created_at: Date;
    updated_at: Date;
    status: number;
    constructor(dto: CreateEventDto);
}
