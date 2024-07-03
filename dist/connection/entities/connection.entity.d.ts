import { CreateConnectionDto } from "../dto/create-connection.dto";
export declare class Connection {
    id: number;
    advisor_id: number;
    client_id: number;
    client_email: string;
    constructor(dto: CreateConnectionDto);
}
