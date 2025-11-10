import httpClient from "./httpClient";
import { API_ENDPOINTS } from "./config";
import { TICKET_STATUS } from "../common";

// API Response Interfaces
export interface PurchasedTicket {
  buyer_id: string;
  check_in_at: Date | null;
  created_at: Date;
  event_date_id: string | null;
  event_dates?: {
    end_at: Date;
    event_id: string;
    id: string;
    start_at: Date;
  };
  event_id: string;
  id: string;
  order_id: string;
  price: number;
  serial_number: string;
  status: string;
  ticket_type_id: string;
  ticket_types?: {
    description?: string | null;
    event_id: string;
    id: string;
    initial_quantity: number;
    name: string;
    price: number;
    remaining_quantity: number;
    status: string;
  };
}

export interface Event {
  categories: { id: string; name: string }[];
  created_at: Date;
  dates: { end_at: Date; id: string; start_at: Date }[];
  description: string;
  end_time: Date;
  event_views: {
    event_id: string;
    id: string;
    viewed_at: Date;
  }[];
  id: string;
  images: { image_type: string; image_url: string }[];
  is_online: boolean;
  location: string | null;
  organizer_id: string;
  start_time: Date;
  status: string;
  ticket_types: {
    id: string;
    initial_quantity: number;
    name: string;
    price: number;
    remaining_quantity: number;
    status: string;
  }[];
  title: string;
  total_views: number;
}

export interface ApiTicketResponse {
  ticket_item: PurchasedTicket | null;
  event_items: Event | Event[];
}

export interface ApiResponseWrapper {
  data: ApiTicketResponse;
  result: {
    code: string;
    error_msg_id: string;
    total_count: string;
  };
}

/**
 * Ticket API service
 */
export const ticketApi = {
  /**
   * Get ticket information by ticket ID from QR code
   * @param ticketId - Ticket ID extracted from QR code
   * @returns Promise with ticket information
   */
  getTicketInfo: async (ticketId: string): Promise<ApiTicketResponse> => {
    const endpoint = API_ENDPOINTS.PURCHASED_TICKETS.replace(
      ":ticketId",
      ticketId
    );

    const response = await httpClient.get<ApiResponseWrapper>(endpoint);

    return response.data.data;
  },

  /**
   * Confirm ticket by ticket ID
   * @param ticketId - Ticket ID extracted from QR code
   * @returns Promise with updated ticket information
   */
  confirmTicket: async (ticketId: string): Promise<ApiTicketResponse> => {
    const endpoint = API_ENDPOINTS.PURCHASED_TICKETS.replace(
      ":ticketId",
      ticketId
    );

    const response = await httpClient.patch<ApiResponseWrapper>(endpoint, {
      status: TICKET_STATUS.USED,
    });

    return response.data.data;
  },
};
