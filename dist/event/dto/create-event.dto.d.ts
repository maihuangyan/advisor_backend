import { Calendar } from "../calendar.enum";
export declare class CreateEventDto {
    title: string;
    description: string;
    start: string;
    end: string;
    calendar: Calendar;
    all_day: number;
    advisor_id: number;
    client_id: number;
    created_by: number;
    zoom_meeting_id: string;
    zoom_meeting_password: string;
    zoom_meeting_join_url: string;
}
