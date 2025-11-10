import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";

const { width } = Dimensions.get("window");

export const TICKET_STATUS = {
  EXPIRED: "expired",
  UNUSED: "unused",
  USED: "used",
};
export type TicketStatus =
  | typeof TICKET_STATUS.USED
  | typeof TICKET_STATUS.EXPIRED
  | typeof TICKET_STATUS.UNUSED;

export default function TicketInfo({
  route,
  navigation,
}: {
  route: any;
  navigation: any;
}) {
  const { ticketData } = route.params;

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  const handleConfirm = () => {
    console.log("Vé đã được xác nhận:", ticketData); // TODO: Implement API call to confirm ticket
    navigation.goBack();
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  // Safe access to ticket data with new QR structure // TODO: Implement API call to get ticket data
  const eventName = ticketData?.eventName || "Tech Conference 2025";
  const ticketTypeName =
    ticketData?.ticketType || ticketData?.ticketTypeName || "Không có loại vé";
  const serialNumber = ticketData?.serialNumber || "TK1762695358429A21LMH";
  const ticketId = ticketData?.ticketId || "N/A";
  const ticketStatus: TicketStatus =
    ticketData?.ticketStatus || TICKET_STATUS.UNUSED;
  const eventStartAt =
    ticketData?.eventStartAt || "2025-11-04T13:06:25.000000Z";
  const eventEndAt = ticketData?.eventEndAt || "2025-11-04T13:06:25.000000Z";
  const checkInAt = ticketData?.checkInAt || null;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Thông Tin Vé</Text>
        <Text style={styles.headerSubtitle}>Chi tiết vé sự kiện</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Ticket Card */}
        <View style={styles.ticketCard}>
          {/* Status Badge */}
          {ticketStatus !== "unknown" && (
            <View
              style={[
                styles.statusBadge,
                ticketStatus === TICKET_STATUS.UNUSED
                  ? styles.statusUnused
                  : ticketStatus === TICKET_STATUS.EXPIRED
                  ? styles.statusExpired
                  : styles.statusUsed,
              ]}
            >
              <Text style={styles.statusText}>
                {ticketStatus === TICKET_STATUS.UNUSED
                  ? "✓ Hợp lệ"
                  : ticketStatus === TICKET_STATUS.EXPIRED
                  ? "✗ Hết hạn"
                  : "✗ Đã sử dụng"}
              </Text>
            </View>
          )}

          {/* Event Name */}
          <Text style={styles.ticketName}>{eventName}</Text>

          {/* Ticket Type */}
          <View style={styles.ticketTypeContainer}>
            <Text style={styles.ticketTypeLabel}>Loại vé</Text>
            <Text style={styles.ticketTypeValue}>{ticketTypeName}</Text>
          </View>

          {/* Event Time */}
          {(eventStartAt || eventEndAt) && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Thời gian sự kiện</Text>

              {eventStartAt && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Bắt đầu:</Text>
                  <Text style={styles.detailValue}>
                    {formatDate(eventStartAt)}
                  </Text>
                </View>
              )}

              {eventEndAt && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Kết thúc:</Text>
                  <Text style={styles.detailValue}>
                    {formatDate(eventEndAt)}
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* Ticket Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Thông tin vé</Text>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>ID Vé:</Text>
              <Text style={styles.detailValue} numberOfLines={1}>
                {ticketId}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Số serial:</Text>
              <Text style={styles.detailValue}>{serialNumber}</Text>
            </View>

            {checkInAt && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Đã check-in lúc:</Text>
                <Text style={[styles.detailValue, styles.checkInTime]}>
                  {formatDate(checkInAt)}
                </Text>
              </View>
            )}

            {!checkInAt && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Trạng thái:</Text>
                <Text style={styles.detailValue}>Chưa check-in</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={handleCancel}
          activeOpacity={0.8}
        >
          <Text style={styles.cancelButtonText}>Hủy bỏ</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.confirmButton]}
          onPress={handleConfirm}
          activeOpacity={0.8}
          disabled={ticketStatus !== TICKET_STATUS.UNUSED}
        >
          <Text
            style={[
              styles.confirmButtonText,
              ticketStatus !== TICKET_STATUS.UNUSED &&
                styles.confirmButtonTextDisabled,
            ]}
          >
            Chấp nhận
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fa",
  },
  header: {
    backgroundColor: "#667eea",
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  ticketCard: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    marginTop: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  statusBadge: {
    alignSelf: "flex-start",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginBottom: 16,
  },
  statusUnused: {
    backgroundColor: "#d4edda",
  },
  statusExpired: {
    backgroundColor: "#cfe2ff",
  },
  statusUsed: {
    backgroundColor: "#f8d7da",
  },
  statusText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#155724",
  },
  ticketName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 20,
    lineHeight: 36,
  },
  ticketTypeContainer: {
    backgroundColor: "#f8f9fa",
    borderRadius: 15,
    padding: 16,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: "#667eea",
  },
  ticketTypeLabel: {
    fontSize: 14,
    color: "#7f8c8d",
    marginBottom: 8,
    fontWeight: "600",
  },
  ticketTypeValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#667eea",
  },
  checkInTime: {
    color: "#28a745",
    fontWeight: "600",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: "#5a6c7d",
    lineHeight: 24,
  },
  quantityRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  quantityLabel: {
    fontSize: 16,
    color: "#7f8c8d",
  },
  quantityValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  remainingQuantity: {
    color: "#667eea",
  },
  progressContainer: {
    marginTop: 16,
  },
  progressBar: {
    height: 12,
    backgroundColor: "#e9ecef",
    borderRadius: 6,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 6,
  },
  progressText: {
    fontSize: 12,
    color: "#7f8c8d",
    textAlign: "center",
    marginTop: 8,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f3f5",
  },
  detailLabel: {
    fontSize: 15,
    color: "#7f8c8d",
    fontWeight: "600",
    flex: 1,
  },
  detailValue: {
    fontSize: 15,
    color: "#2c3e50",
    flex: 2,
    textAlign: "right",
  },
  buttonContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#e9ecef",
    gap: 12,
  },
  button: {
    flex: 1,
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#f8f9fa",
    borderWidth: 2,
    borderColor: "#dee2e6",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#495057",
  },
  confirmButton: {
    backgroundColor: "#667eea",
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  confirmButtonTextDisabled: {
    color: "#999",
  },
});
