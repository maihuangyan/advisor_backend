/// <reference types="multer" />
import { MessageService } from "./message.service";
import { CreateMessageDto } from "./dto/create-message.dto";
import { BaseController } from "src/_base/base.controller";
import { NexeroneService } from "src/nexerone/nexerone.service";
export declare class MessageController extends BaseController {
    private readonly messageService;
    private readonly nexeronService;
    constructor(messageService: MessageService, nexeronService: NexeroneService);
    create(createMessageDto: CreateMessageDto): Promise<any>;
    findAll(): string;
    findRoomMessages(req: any, room_id: string, query: any): Promise<{
        ResponseCode: any;
        ResponseMessage: any;
        ResponseResult: any;
    } | {
        ResponseCode: number;
        ResponseMessage: string;
        ResponseResult: any;
    }>;
    findRoomLastMessages(req: any, room_id: string, query: any): Promise<{
        ResponseCode: any;
        ResponseMessage: any;
        ResponseResult: any;
    } | {
        ResponseCode: number;
        ResponseMessage: string;
        ResponseResult: any;
    }>;
    findAdvisorMessages(req: any): Promise<{
        ResponseCode: any;
        ResponseMessage: any;
        ResponseResult: any;
    } | {
        ResponseCode: number;
        ResponseMessage: string;
        ResponseResult: any;
    }>;
    advisorUnreadMessages(req: any): Promise<{
        ResponseCode: any;
        ResponseMessage: any;
        ResponseResult: any;
    } | {
        ResponseCode: number;
        ResponseMessage: string;
        ResponseResult: any;
    }>;
    clearRoomMessages(req: any, room_id: string): Promise<{
        ResponseCode: any;
        ResponseMessage: any;
        ResponseResult: any;
    } | {
        ResponseCode: number;
        ResponseMessage: string;
        ResponseResult: any;
    }>;
    clearAdvisorMessages(req: any, client: any): Promise<{
        ResponseCode: any;
        ResponseMessage: any;
        ResponseResult: any;
    } | {
        ResponseCode: number;
        ResponseMessage: string;
        ResponseResult: any;
    }>;
    clearClientMessages(req: any): Promise<{
        ResponseCode: any;
        ResponseMessage: any;
        ResponseResult: any;
    } | {
        ResponseCode: number;
        ResponseMessage: string;
        ResponseResult: any;
    }>;
    uploadFile(file: Express.Multer.File): {
        ResponseCode: any;
        ResponseMessage: any;
        ResponseResult: any;
    } | {
        ResponseCode: number;
        ResponseMessage: string;
        ResponseResult: any;
    };
    getFile(filename: string, res: any): any;
    remove(id: string): Promise<void>;
    updateRoomsWithClientPhoto(): Promise<boolean>;
}
