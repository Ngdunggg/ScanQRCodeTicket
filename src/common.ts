export const TICKET_STATUS = {
    EXPIRED: "expired",
    UNUSED: "unused",
    USED: "used",
  };
  export type TicketStatus =
    | typeof TICKET_STATUS.USED
    | typeof TICKET_STATUS.EXPIRED
    | typeof TICKET_STATUS.UNUSED;