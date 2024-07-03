import { CreateMessageDto } from "./create-message.dto";
declare const UpdateMessageDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateMessageDto>>;
export declare class UpdateMessageDto extends UpdateMessageDto_base {
    status: boolean;
    seen_status: number;
    deleted_at: string;
    advisor_deleted: number;
    client_deleted: number;
}
export {};
