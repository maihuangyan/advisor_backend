import { Injectable } from "@nestjs/common";
import { BaseService } from "src/_base/base.service";
import { RoomUser } from "./entities/room-user";
import { RoomUsers } from "./entities/room-users";

@Injectable()
export class OnlineService extends BaseService {

  rooms: RoomUsers[];

  constructor() {
    super();
    this.rooms = [] as RoomUsers[];
  }

  addUser(user: RoomUser) {
    const room = this.getRoom(user.room_id);
    if (room) {
      const index = this.checkExist(user.room_id, user.token);
      if (index > -1) {
        room.users[index] = user;
      } else {
        room.users.push(user);
      }
    } else {
      const newRoom = new RoomUsers();
      newRoom.room_id = user.room_id;
      newRoom.users = [user];
      this.rooms.push(newRoom);
    }
  }

  checkExist(room_id: string, token: string) {
    const room = this.getRoom(room_id);
    for (let i = 0; i < room.users.length; i++) {
      const user = room.users[i];
      if (user.token == token) {
        return i;
      }
    }
    return -1;
  }

  getRooms() {
    return this.rooms;
  }

  getRoom(room_id: string) {
    for (let i = 0; i < this.rooms.length; i++) {
      const item = this.rooms[i];
      if (item.room_id == room_id) {
        return item;
      }
    }
    return null;
  }

  checkExistBySocketID(room_id: string, socket_id: string) {
    const room = this.getRoom(room_id);
    for (let i = 0; i < room.users.length; i++) {
      const user = room.users[i];
      if (user.socket_id == socket_id) {
        return i;
      }
    }
    return -1;
  }

  removeRoom(room_id: string) {
    this.consoleLog('room_id', room_id)
    for (let i = 0; i < this.rooms.length; i++) {
      const item = this.rooms[i];
      if (item.room_id == room_id) {
        this.rooms.splice(i, 1);
      }
    }
  }

  removeUser(room_id: string, token: string) {
    this.consoleLog('room_id', room_id)
    this.consoleLog('token', token)
    const index = this.checkExist(room_id, token);
    if (index > -1) {
      const room = this.getRoom(room_id);
      room.users.splice(index, 1);
    }
  }

  removeUserBySocketID(room_id: string, socket_id: string) {
    this.consoleLog('room_id', room_id)
    this.consoleLog('socket_id', socket_id)
    const index = this.checkExistBySocketID(room_id, socket_id);
    if (index > -1) {
      const room = this.getRoom(room_id);
      room.users.splice(index, 1);
    }
  }

  getRoomIds() {
    const roomIds = [];
    this.rooms.forEach((room) => {
      roomIds.push(room.room_id);
    });
    return roomIds;
  }

  getRoomIdsWhichHasUsers() {
    const roomIds = [];
    this.rooms.forEach((room) => {
      if (room.users.length > 0) roomIds.push(room.room_id);
    });
    return roomIds;
  }

  pairSocketIDandToken(socket_id: string, token: string) {
    this.rooms.forEach((room) => {
      room.users.forEach((user) => {
        if (user.socket_id == socket_id) {
          user.token = token;
        } else if (user.token == token) {
          user.socket_id = socket_id;
        }
      });
    });
  }

  getUserByUserID(id: string): RoomUser {
    for (let i = 0; i < this.rooms.length; i++) {
      const room = this.rooms[i];
      for (let j = 0; j < room.users.length; j++) {
        const user = room.users[j];
        if (user.user_id == id) {
          return user;
        }
      }
    }
    return null;
  }

  getUserByToken(token: string): RoomUser {
    for (let i = 0; i < this.rooms.length; i++) {
      const room = this.rooms[i];
      for (let j = 0; j < room.users.length; j++) {
        const user = room.users[j];
        if (user.token == token) {
          return user;
        }
      }
    }
    return null;
  }

  getUserBySocketID(socket_id: string): RoomUser {
    for (let i = 0; i < this.rooms.length; i++) {
      const room = this.rooms[i];
      for (let j = 0; j < room.users.length; j++) {
        const user = room.users[j];
        if (user.socket_id == socket_id) {
          return user;
        }
      }
    }
    return null;
  }

  getRoomIDsBySocketID(socket_id: string): string[] {
    const result = [];
    this.rooms.forEach((room) => {
      room.users.forEach((user) => {
        if (user.socket_id == socket_id) {
          result.push(room.room_id);
        }
      });
    });
    return result;
  }

  getRoomsBySocketID(socket_id: string): RoomUsers[] {
    const result = [] as RoomUsers[];
    this.rooms.forEach((room) => {
      for (let i = 0; i < room.users.length; i++) {
        const user = room.users[i];
        if (user.socket_id == socket_id) {
          result.push(room);
          break;
        }
      }
    });
    return result;
  }

  getRoomIDsByUser(token: string): string[] {
    const result = [];
    this.rooms.forEach((room) => {
      room.users.forEach((user) => {
        if (user.token == token) result.push(room.room_id);
      });
    });
    return result;
  }

  getRoomsByUser(token: string): RoomUsers[] {
    const result = [];
    this.rooms.forEach((room) => {
      for (let i = 0; i < room.users.length; i++) {
        const user = room.users[i];
        if (user.token == token) {
          result.push(room);
          break;
        }
      }
    });
    return result;
  }

  getRoomsByUserID(user_id: string): RoomUsers[] {
    const result = [];
    this.rooms.forEach((room) => {
      for (let i = 0; i < room.users.length; i++) {
        const user = room.users[i];
        if (user.user_id == user_id) {
          result.push(room);
          break;
        }
      }
    });
    return result;
  }

  getRoomsOnlineStatus(token: string) {
    const result = {};
    this.rooms.forEach((room) => {
      for (let i = 0; i < room.users.length; i++) {
        const user = room.users[i];
        if (user.token == token) {
          result[room.room_id] = false;
          for (let j = 0; j < room.users.length; j++) {
            const jUser = room.users[j];
            if (user.user_id != jUser.user_id) {
              result[room.room_id] = true;
              break;
            }
          }
          break;
        }
      }
    });
    return result;
  }

  getAdvisorRoomsOnlineStatus(advisor_id: number) {
    const result = {};
    const advisorRooms = this.getRoomsByUserID("" + advisor_id)
    advisorRooms.forEach((room) => {
      for (let i = 0; i < room.users.length; i++) {
        const user = room.users[i];
        result[room.room_id] = false;
        if (user.user_id != "" + advisor_id) {
          result[room.room_id] = true;
          break;
        }
      }
    });
    return result;
  }
}
