import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { validate } from "class-validator";
import { ConnectionService } from "src/connection/connection.service";
import { Role } from "src/guards/enum/role.enum";
import { UserService } from "src/user/user.service";
import { m_constants } from "src/utils/const";
import { getTimeZone } from "src/utils/utils";
import { WorkTimeService } from "src/work-time/work-time.service";
import { Brackets, Repository } from "typeorm";
import { Calendar } from "./calendar.enum";
import { CreateEventDto } from "./dto/create-event.dto";
import { UpdateEventDto } from "./dto/update-event.dto";
import { Event } from "./entities/event.entity";
import { ZoomService } from "src/zoom/zoom.service";
import { BaseService } from "src/_base/base.service";

@Injectable()
export class EventService extends BaseService {
  constructor(
    @InjectRepository(Event)
    private mRepository: Repository<Event>,
    private readonly connectionService: ConnectionService,
    private readonly worktimeService: WorkTimeService,
    private readonly userService: UserService,
    private readonly zoomService: ZoomService
  ) {
    super();
  }

  async create(dto: CreateEventDto) {
    const errors = await validate(dto);
    //this.consoleLog(dto);
    if (errors.length > 0) {
      return { error: m_constants.RESPONSE_ERROR.resCodeInvalidData };
    }

    // if client scheduled already in the duration of event, then return warning or cancel clients' events and send push notification
    const scheduledMeetings = await this.scheduledMeetingsInDuration(
      +dto.advisor_id,
      +dto.start,
      +dto.end
    );
    //this.consoleLog('scheduledMeetings', scheduledMeetings)
    if (scheduledMeetings.length > 0) {
      return { error: m_constants.RESPONSE_API_ERROR.resCodeAlreadyScheduled };

      // or cancel clients' events and send push notification
    }

    // if (dto.all_day == 1) {
    //   dto.start = '' + this.getDateStartSeconds(dto.start)
    //   dto.end = '' + this.getDateEndSeconds(dto.end)
    // }

    const event = new Event(dto);
    return this.mRepository.save(event);
  }

  getDateStartSeconds(seconds: string | number) {
    const todaySeconds = +seconds % 86400;
    return +seconds - todaySeconds;
  }

  getDateEndSeconds(seconds: string | number) {
    const todaySeconds = +seconds % 86400;
    return +seconds - todaySeconds + 86400;
  }

  async scheduledMeetingsInDuration(
    advisor_id: number,
    start: number,
    end: number
  ) {
    const qb = this.mRepository
      .createQueryBuilder("event")
      .where("event.advisor_id = :advisor_id", { advisor_id })
      .andWhere("event.created_by = 1")
      .andWhere(
        new Brackets((qb) => {
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
        })
      );
    return await qb.getMany();
  }

  async scheduleMeeting(client: any, data: any) {
    //this.consoleLog('client, data: ', client, data);
    if (!data.title || !data.time) {
      return { error: m_constants.RESPONSE_ERROR.resCodeInvalidData };
    }

    this.consoleLog(data.time);
    const curSecs = new Date().getTime() / 1000;
    this.consoleLog(curSecs);
    if (!data.time || data.time < curSecs) {
      return {
        error: m_constants.RESPONSE_API_ERROR.resCodeInvalidScheduleTime,
      };
    }

    if (!client.id || !client.email) {
      return { error: m_constants.RESPONSE_ERROR.resCodeUnknownError };
    }

    const connection = await this.connectionService.findByClientEmail(
      client.email
    );
    if (!connection) {
      return { error: m_constants.RESPONSE_ERROR.resCodeUnknownError };
    }

    const advisor = await this.userService.findOne(connection.advisor_id);
    if (!advisor) {
      return { error: m_constants.RESPONSE_API_ERROR.resCodeAdvisorNotReadyForSchedule };
    }
    if (advisor.status !== 1) {
      return { error: m_constants.RESPONSE_API_ERROR.resCodeInactiveAdvisor }
    }

    // check if client created a meeting already with advisor
    const sm = await this.findScheduledMeeting(
      connection.advisor_id,
      client.id
    );
    if (sm) {
      return { error: m_constants.RESPONSE_API_ERROR.resCodeAlreadyScheduled };
    }

    // check if advisor already has been scheduled with another clients
    const asm = await this.findAdvisorScheduledMeetingWithTime(
      connection.advisor_id,
      data.time
    );
    if (asm) {
      return {
        error: m_constants.RESPONSE_API_ERROR.resCodeAlreadyScheduledWithOther,
      };
    }

    // create zoom meeting
    const zoomMeeting = await this.zoomService.createMeeting(
      advisor,
      new Date(data.time * 1000)
    );
    if (zoomMeeting.error) {
      return zoomMeeting;
    }

    // save meeting on local database
    let dto = new CreateEventDto();
    dto.title = data.title;
    dto.start = data.time;
    dto.end = (+data.time + 1800).toString();
    dto.all_day = 0;
    dto.calendar = Calendar.Business;
    dto.advisor_id = connection.advisor_id;
    dto.client_id = client.id;
    dto.created_by = 1;
    dto.zoom_meeting_id = zoomMeeting.id;
    dto.zoom_meeting_password = zoomMeeting.encrypted_password;
    dto.zoom_meeting_join_url = zoomMeeting.join_url;

    const newEvent = new Event(dto);
    return await this.mRepository.save(newEvent);
  }

  async cancelMeeting(client: any, data: any): Promise<any> {
    this.consoleLog("client", client);
    if (!client.id || !client.email) {
      this.consoleLog(m_constants.RESPONSE_ERROR.resCodeUnknownError);
      return { error: m_constants.RESPONSE_ERROR.resCodeUnknownError };
    }

    if (!data.meeting_id) {
      this.consoleLog(m_constants.RESPONSE_ERROR.resCodeInvalidData);
      return { error: m_constants.RESPONSE_ERROR.resCodeInvalidData };
    }

    const event = await this.findOne(data.meeting_id);
    if (!event) {
      this.consoleLog(m_constants.RESPONSE_ERROR.resCodeInvalidData);
      return { error: m_constants.RESPONSE_ERROR.resCodeNotFound };
    }

    if (event.client_id != client.id) {
      this.consoleLog(m_constants.RESPONSE_ERROR.resCodeInvalidData);
      return { error: m_constants.RESPONSE_ERROR.resCodeInvalidPermisson };
    }

    if (!event.zoom_meeting_id) {
      this.consoleLog(m_constants.RESPONSE_ERROR.resCodeInvalidData);
      await this.remove(event.id);
      return { error: m_constants.RESPONSE_ERROR.resCodeInvalidData };
    }

    // delete zoom meeting
    const result = await this.zoomService.deleteMeeting(event.zoom_meeting_id);
    if (result.error) {
      return result;
    }

    return await this.remove(data.meeting_id);
  }

  async availableTimeSlots(client: any, data: any) {
    this.consoleLog("client", client);
    if (!client.id || !client.email) {
      this.consoleLog(m_constants.RESPONSE_ERROR.resCodeUnknownError);
      return { error: m_constants.RESPONSE_ERROR.resCodeUnknownError };
    }

    if (!data.date || !data.timezone) {
      this.consoleLog(m_constants.RESPONSE_ERROR.resCodeInvalidData);
      return { error: m_constants.RESPONSE_ERROR.resCodeInvalidData };
    }

    const connection = await this.connectionService.findByClientEmail(
      client.email
    );
    if (!connection) {
      this.consoleLog(m_constants.RESPONSE_API_ERROR.resCodeInvalidAdvisor);
      return { error: m_constants.RESPONSE_API_ERROR.resCodeInvalidAdvisor };
    }

    const advisor = await this.userService.findOne(connection.advisor_id);
    if (!advisor) {
      this.consoleLog(m_constants.RESPONSE_API_ERROR.resCodeInvalidAdvisor);
      return { error: m_constants.RESPONSE_API_ERROR.resCodeInvalidAdvisor };
    }

    if (advisor.status !== 1) {
      this.consoleLog(m_constants.RESPONSE_API_ERROR.resCodeInactiveAdvisor);
      return { error: m_constants.RESPONSE_API_ERROR.resCodeInactiveAdvisor }
    }

    const clientTimezoneOffset = data.timezone
      .replace("GMT", "")
      .replace("UTC", "")
      .replace(" ", "");
    if (
      isNaN(clientTimezoneOffset) ||
      +clientTimezoneOffset > 12 ||
      +clientTimezoneOffset < -12
    ) {
      this.consoleLog(m_constants.RESPONSE_ERROR.resCodeInvalidData);
      return { error: m_constants.RESPONSE_ERROR.resCodeInvalidData };
    }
    this.consoleLog("clientTimezoneOffset", clientTimezoneOffset);

    const advisorTimeZone = getTimeZone(advisor.timezone);
    if (!advisorTimeZone) {
      this.consoleLog(m_constants.RESPONSE_API_ERROR.resCodeInvalidAdvisor);
      return {
        error: m_constants.RESPONSE_API_ERROR.resCodeAdvisorNotReadyForSchedule,
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

    const advisorDateStartTime =
      utcDateStartTime - advisorTimeZone.offset * 3600;
    this.consoleLog("advisorDateStartTime: ", advisorDateStartTime);
    const advisorDateEndTime = advisorDateStartTime + 86400;
    this.consoleLog("advisorDateEndTime: ", advisorDateEndTime);
    const advisorPrevDateStartTime = advisorDateStartTime - 86400;
    this.consoleLog("advisorPrevDateStartTime: ", advisorPrevDateStartTime);

    this.consoleLog("slots length: ", slots.length);
    const timeSlots = [];
    slots.forEach((slot) => {
      if (
        clientDateStartTime < advisorPrevDateStartTime + slot &&
        advisorPrevDateStartTime + slot < clientDateEndTime
      ) {
        timeSlots.push(advisorPrevDateStartTime + slot);
      }
      if (
        clientDateStartTime < advisorDateStartTime + slot &&
        advisorDateStartTime + slot < clientDateEndTime
      ) {
        timeSlots.push(advisorDateStartTime + slot);
      }
      if (
        clientDateStartTime < advisorDateEndTime + slot &&
        advisorDateEndTime + slot < clientDateEndTime
      ) {
        timeSlots.push(advisorDateEndTime + slot);
      }
    });

    // const hours = [];
    // timeSlots.forEach(timeSlot => {
    //   hours.push(new Date(timeSlot * 1000))
    // });

    // return hours;

    const eventsForDate = await this.eventsBetween(
      advisor.id,
      clientDateStartTime,
      advisorDateEndTime
    );
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

  async eventsBetween(advisor_id: number, start: number, end: number) {
    //seconds
    const qb = this.mRepository
      .createQueryBuilder("event")
      .where("event.advisor_id = :advisor_id", { advisor_id })
      .andWhere("event.status = 1")
      .andWhere(
        new Brackets((qb) => {
          qb.where("event.end > :start and event.end <= :end", { start, end })
            .orWhere("event.start >= :start and event.start < :end", {
              start,
              end,
            })
            .orWhere("event.start <= :start and event.end >= :end", {
              start,
              end,
            })
            .orWhere(
              new Brackets((qb) => {
                qb.where("event.all_day = 1").andWhere(
                  new Brackets((qb) => {
                    qb.where(
                      "event.end - (event.end % 86400) + 86400 > :start and event.end - (event.end % 86400) + 86400 <= :end",
                      { start, end }
                    )
                      .orWhere(
                        "event.start - (event.start % 86400) >= :start and event.start - (event.start % 86400) < :end",
                        { start, end }
                      )
                      .orWhere(
                        "event.start - (event.start % 86400) <= :start and event.end - (event.end % 86400) + 86400 >= :end",
                        { start, end }
                      );
                  })
                );
              })
            );
        })
      );
    return await qb.getMany();
  }

  async checkScheduledMeeting(client: any): Promise<any> {
    //this.consoleLog("client", client);
    if (!client.id || !client.email) {
      this.consoleLog(m_constants.RESPONSE_ERROR.resCodeUnknownError);
      return { error: m_constants.RESPONSE_ERROR.resCodeUnknownError };
    }

    const connection = await this.connectionService.findByClientEmail(
      client.email
    );
    if (!connection) {
      this.consoleLog(m_constants.RESPONSE_ERROR.resCodeUnknownError);
      return { error: m_constants.RESPONSE_ERROR.resCodeUnknownError };
    }

    //this.consoleLog('connection', connection)
    const meeting = await this.findScheduledMeeting(
      connection.advisor_id,
      client.id
    );
    if (!meeting) {
      return [];
    }
    //this.consoleLog(meeting)

    const advisor = await this.userService.findOne(connection.advisor_id);
    if (!advisor) {
      return { error: m_constants.RESPONSE_API_ERROR.resCodeInvalidAdvisor }
    }
    if (advisor.status !== 1) {
      return { error: m_constants.RESPONSE_API_ERROR.resCodeInactiveAdvisor }
    }

    const meetingsData = await this.zoomService.loadAdvisorMeetings(advisor);
    //this.consoleLog(meetingsData)
    if (meetingsData.total_records > 0) {
      for (let meetingItem of meetingsData.meetings) {
        if (meetingItem.id == meeting.zoom_meeting_id) {
          return [meeting];
        }
      }
    } else {
      await this.remove(meeting.id);
      return [];
    }
  }

  async findScheduledMeeting(advisor_id: number, client_id: number) {
    const curSecs = Math.round(new Date().getTime() / 1000);
    //this.consoleLog(curSecs)
    const qb = this.mRepository
      .createQueryBuilder("event")
      .where("event.advisor_id = :advisor_id", { advisor_id })
      .andWhere("event.client_id = :client_id", { client_id })
      .andWhere("event.end > :end", { end: "" + curSecs })
      .andWhere("event.status = 1");
    return await qb.getOne();
  }

  async findAdvisorScheduledMeetingWithTime(advisor_id: number, time: number) {
    const curSecs = new Date().getTime() / 1000;
    const qb = this.mRepository
      .createQueryBuilder("event")
      .where("event.advisor_id = :advisor_id", { advisor_id })
      .andWhere("event.start <= :time", { time })
      .andWhere("event.end > :time", { time })
      .andWhere("event.status = 1");
    return await qb.getOne();
  }

  async findAdvisorEvents(advisor_id: number, calendars: string[]) {
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

  async findOne(id: number) {
    return await this.mRepository.findOne(id);
  }

  async update(user: any, id: number, dto: UpdateEventDto) {
    const event = await this.findOne(id);
    if (!event) {
      return { error: m_constants.RESPONSE_API_ERROR.resCodeInvalidEventID };
    }
    if (user.role != Role.Admin && user.id != event.advisor_id) {
      return { error: m_constants.RESPONSE_ERROR.resCodeInvalidPermisson };
    }
    if (user.role != Role.Admin && event.created_by == 1) {
      return { error: m_constants.RESPONSE_ERROR.resCodeInvalidPermisson };
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

  async removeEvent(user: any, id: number): Promise<any> {
    const event = await this.findOne(id);
    if (!event) {
      return { error: m_constants.RESPONSE_API_ERROR.resCodeInvalidEventID };
    }
    if (user.role != Role.Admin && user.id != event.advisor_id) {
      return { error: m_constants.RESPONSE_ERROR.resCodeInvalidPermisson };
    }

    return this.remove(id);
  }

  async remove(id: number) {
    return await this.mRepository.delete(id);
  }
}
