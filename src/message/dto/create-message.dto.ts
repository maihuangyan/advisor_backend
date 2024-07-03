export class CreateMessageDto {
  room_id: string;

  user_id: string; // email for clients

  local_id: string;

  message: string;

  type: number; // 1: text, 2: image, 3: file

  constructor(
    room_id: string,
    user_id: string,
    local_id: string,
    message: string,
    type: number
  ) {
    this.room_id = room_id;
    this.user_id = user_id;
    this.local_id = local_id;
    this.message = message;
    this.type = type;
  }
}
