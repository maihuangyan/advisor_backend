export class RoomUser {
  token: string;

  user_id: string; // for clients it will be email

  room_id: string;

  socket_id: string;

  constructor(
    token: string,
    user_id: string,
    room_id: string,
    socket_id: string
  ) {
    this.token = token;
    this.user_id = user_id;
    this.room_id = room_id;
    this.socket_id = socket_id;
  }
}
