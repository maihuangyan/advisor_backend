import { BalanceType } from "src/balance/entities/enum/balance_type.enum";

export const m_constants = {
  RESPONSE_RESULT: {
    resCodeSucceed: 0,
    resCodeError: 1,
  },

  RESPONSE_ERROR: {
    resCodeUnknownError: 1000001,
    resCodeNoToken: 1000002,
    resCodeInvalidToken: 1000003,
    resCodeTokenExpired: 1000004,
    resCodeDatabaseError: 1000006,
    resCodeNonSupportedType: 1000007,
    resCodeInvalidData: 1000008,
    resCodePendingUser: 1000009,
    resCodeInactiveUser: 1000010,
    resCodeInvalidPermisson: 1000011,
    resCodeNotFound: 1000012,
    resCodeMainBackendApiError: 1000013,
    resCodeZoomApiError: 1000014,
  },

  RESPONSE_API_ERROR: {
    resCodeInvalidID: 2000001,
    resCodeInvalidEmail: 2000002,
    resCodeInvalidAdvisor: 2000003,
    resCodeInactiveAdvisor: 2000004,
    resCodeNoValueToUpdate: 2000005,
    resCodeUserNotFound: 2000006,
    resCodeInvalidEmailSameAdvisor: 2000007,

    resCodeLoginNoUserID: 2001001,
    resCodeLoginNoPassword: 2001002,
    resCodeLoginInvalidPassword: 2001003,
    resCodeLoginInactive: 2001004,

    resCodeSignUpNoUserID: 2002001,
    resCodeSignUpNoPassword: 2002002,
    resCodeInvalidEmailAlreadyTaken: 2002003,
    resCodeInvalidUsernameAlreadyTaken: 2002004,
    resCodeInvalidPasswordLength: 2002005,
    resCodeInvalidEmailWithNexoroneAccount: 2002006,

    resCodeResetPasswordNoOldPassword: 2003001,
    resCodeResetPasswordNoNewPassword: 2003002,
    resCodeResetPasswordInvalidOldPassword: 2003003,
    resCodeResetPasswordUsedSamePassword: 2003004,
    resCodeResetPasswordInvalidCode: 2003005,
    resCodeResetPasswordInvalidPassword: 2003006,

    resCodeUserListNoRoomID: 2004001,
    resCodeUserListInvalidRoomID: 2004002,

    resCodeMessageListNoRoomID: 2005001,
    resCodeMessageListNoLastMessageID: 2005002,
    resCodeInvalidMessageID: 2005003,
    resCodeInvalidRoom: 2005004,

    resCodeAlreadyConnected: 2006001,

    resCodeInvalidScheduleTime: 2007001,
    resCodeAlreadyScheduled: 2007002,
    resCodeAdvisorNotReadyForSchedule: 2007003,
    resCodeInvalidEventID: 2007004,
    resCodeAlreadyScheduledWithOther: 2007005,

    resCodeEmailSyncError: 2008001,
    resCodeEmailSendError: 2008002,
    resCodeEmailInvalidAttachment: 2008003,
  },

  RESPONSE_SOCKET_ERROR: {
    resCodeInvalidSocket: 3000001,
    resCodeSocketNoAdvisor: 3000002,

    resCodeSocketLoginNoClientID: 3001001,
    resCodeSocketLoginNoClientName: 3001002,
    resCodeSocketLoginAPICallError: 3001003,
    resCodeSocketLoginNoRoomID: 3001004,
    resCodeSocketLoginCreateRoomFail: 3001005,
    resCodeSocketLoginFindRoomFail: 3001006,
    resCodeSocketLoginNoRoomsToJoin: 3001007,

    resCodeSocketSendMessageNoRoomID: 3002001,
    resCodeSocketSendMessageNoType: 3002002,
    resCodeSocketSendMessageNoMessage: 3002003,
    resCodeSocketSendMessageFail: 3002004,
    resCodeSocketSaveMessageFail: 3002005,
    resCodeSocketSendMessageInvalidUser: 3002006,
    resCodeSocketSendMessageInvalidRoom: 3002007,

    resCodeSocketOpenMessageNoMessageID: 3002001,

    resCodeSocketDeleteMessageNoMessageID: 3004001,
    resCodeSocketDeleteMessageNoRoomID: 3004002,

    resCodeSocketTypingNoRoomID: 3005001,
    resCodeSocketTypingNoType: 3005002,
  },

  SOCKET_EVENTS: {
    SOCKET_ERROR: "socketerror",
    SOCKET_WARNING: "socketWarning",
    SOCKET_LOGIN: "login",
    SOCKET_LOGOUT: "logout",
    SOCKET_NEW_USER: "newUser",
    SOCKET_SEND_MESSAGE: "sendMessage",
    SOCKET_NEW_MESSAGE: "newMessage",
    SOCKET_SEND_TYPING: "sendTyping",
    SOCKET_TYPING: "typing",
    SOCKET_OPEN_MESSAGE: "openMessage",
    SOCKET_UPDATE_MESSAGE: "updateMessage",
    SOCKET_DELETE_MESSAGE: "deleteMessage",
    SOCKET_DISCONNECT: "disconnect",
    SOCKET_USER_LEFT: "userLeft",
  },

  API_URLS: {
    URL_API_SEND_SS_NOTIFICATION: "chat/send_ss_notification",
  },

  MESSAGE_TYPE: {
    MESSAGE_TYPE_TEXT: 1,
    MESSAGE_TYPE_IMAGE: 2,
    MESSAGE_TYPE_FILE: 3,
  },

  ERROR_MESSAGES: {
    1000001: "Unknown error.",
    1000002: "Token is required.",
    1000003: "Invalid Token.",
    1000004: "Token expired.",
    1000006: "Database error.",
    1000007: "Invalid Type.",
    1000008: "Invalid Data.",
    1000009: "The user is in review.",
    1000010: "The user is inactive.",
    1000011: "You don't have the permission.",
    1000012: "Not found.",
    1000013: "There is exception with backend processing.",
    1000014: "There is exception with zoom api",

    2000001: "Invalid ID.",
    2000002: "Invalid Email.",
    2000003: "Invalid Advisor.",
    2000004: "The advisor is not available now.",
    2000005: "No data provided.",
    2000006: "User not found",
    2000007: "It is not allowed to connect an advisor with same email",

    2001001: "Email is not provided.",
    2001002: "Password is not provided.",
    2001003: "Invalid Password.",
    2001004: "The account is under pending approval.",

    2002001: "Email is required.",
    2002002: "Password is required.",
    2002003: "The email has been already taken.",
    2002004: "The username has been already taken.",
    2002005: "Password length must be 8 at least",
    2002006: "The email is not connected with nexorone profile",

    2003001: "Old password is required.",
    2003002: "New password is required.",
    2003003: "Old password is invalid.",
    2003004: "New password is same with the old one",
    2003005: "The recovery code is invalid.",
    2003006: "The password is invalid",

    2004001: "Room id is required.",
    2004002: "Invalid room id.",

    2005001: "Room id is required.",
    2005002: "Message id is required.",
    2005003: "Invalid message id.",
    2005004: "Invalid room",

    2006001: "The client is already connected.",

    2007001: "The schedule time is invalid.",
    2007002: "You have already scheduled a meeting with the advisor.",
    2007005:
      "Someone just created a meeting with the advisor at the time, please choose another time.",
    2007003: "The advisor is not ready for schedule",
    2007004: "The event id is invalid",

    2008001: "Email synchronize failed",
    2008002: "Failed to send email",
    2008003: "Invalid attachment",

    3000002: "Advisor is not ready",
  },

  MAILBOX: {
    inbox: "INBOX",
    junk: "Junk",
    sent: "Sent",
    draft: "Drafts",
    trash: "Trash",
  },
};
