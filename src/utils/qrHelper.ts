/**
 * Extract ticket ID from QR code data
 */
export const extractTicketId = (data: string): string | null => {
  // Clean data: remove invalid control characters
  const cleanedData = data.replace(/[\u0000-\u0008\u000B-\u001F]/g, "");

  // Check if it's URL
  if (cleanedData.startsWith("http") || cleanedData.startsWith("www")) {
    return null;
  }

  // Try to parse as JSON
  try {
    const parsedData = JSON.parse(cleanedData);
    const ticketObj = Array.isArray(parsedData) ? parsedData[0] : parsedData;
    return ticketObj?.ticketId || ticketObj?.id || null;
  } catch {
    // If not JSON, treat the whole data as ticketId
    return cleanedData.trim() || null;
  }
};

/**
 * Validate QR code data
 */
export const isValidTicketQR = (data: string): boolean => {
  const ticketId = extractTicketId(data);
  return ticketId !== null;
};

