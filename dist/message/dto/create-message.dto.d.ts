export declare class CreateMessageDto {
    room_id: string;
    user_id: string;
    local_id: string;
    message: string;
    type: number;
    constructor(room_id: string, user_id: string, local_id: string, message: string, type: number);
}
