import { User } from "src/user/entities/user.entity";
import { BaseService } from "src/_base/base.service";
export declare class ZoomService extends BaseService {
    constructor();
    generateZoomAuthToken(): string;
    generateJWT(): string;
    createMeeting(advisor: User, time: Date): Promise<any>;
    deleteMeeting(meetingId: string): Promise<any>;
    loadAdvisorMeetings(advisor: User): Promise<any>;
    loadZoomUsers(): Promise<any>;
    registerZoomUser(advisor: User): Promise<any>;
}
