import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import { CameraView, Camera } from "expo-camera";
import { ticketApi } from "./api/ticketService";
import { extractTicketId, isValidTicketQR } from "./utils/qrHelper";
import { getErrorMessage } from "./utils/errorHandler";

export default function QRScanner({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [isScanning, setIsScanning] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };
    getCameraPermissions();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      setIsScanning(true);
      setIsProcessing(false);
    });

    return unsubscribe;
  }, [navigation]);

  const resetScanner = () => {
    setIsScanning(true);
    setIsProcessing(false);
  };

  const handleBarcodeScanned = async ({ data }) => {
    if (!isScanning || isProcessing) return;

    setIsProcessing(true);
    setIsScanning(false);

    try {
      // Validate and extract ticket ID
      if (!isValidTicketQR(data)) {
        Alert.alert("Lỗi", "QR code này không phải định dạng vé!");
        resetScanner();
        return;
      }

      const ticketId = extractTicketId(data);
      if (!ticketId) {
        Alert.alert("Lỗi", "Không tìm thấy ID vé trong mã QR!");
        resetScanner();
        return;
      }

      // Fetch ticket data
      const ticketData = await ticketApi.getTicketInfo(ticketId);

      if (!ticketData.ticket_item) {
        Alert.alert("Lỗi", "Không tìm thấy thông tin vé.");
        resetScanner();
        return;
      }

      // Navigate to ticket info screen
      navigation.navigate("TicketInfo", { ticketData });
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      Alert.alert("Lỗi", errorMessage);
      resetScanner();
    }
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Đang yêu cầu quyền truy cập camera...</Text>
        <Text style={styles.subtitle}>
          Vui lòng cho phép truy cập camera để quét mã QR
        </Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Không có quyền truy cập camera</Text>
        <Text style={styles.subtitle}>
          Vui lòng cấp quyền camera trong cài đặt
        </Text>
        <TouchableOpacity
          style={styles.permissionButton}
          onPress={async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === "granted");
          }}
        >
          <Text style={styles.permissionButtonText}>Thử lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.scannerContainer}>
      <CameraView
        onBarcodeScanned={isScanning ? handleBarcodeScanned : undefined}
        barcodeScannerSettings={{
          barcodeTypes: ["qr", "pdf417"],
        }}
        style={StyleSheet.absoluteFillObject}
      />

      <View style={styles.scannerOverlay}>
        <View style={styles.scannerBox} />
        <Text style={styles.instructionText}>Hướng camera vào mã QR</Text>
        {isProcessing && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#667eea" />
            <Text style={styles.loadingText}>Đang xử lý...</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f2f5",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#2c3e50",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    color: "#7f8c8d",
    marginBottom: 30,
  },
  permissionButton: {
    backgroundColor: "#667eea",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 20,
    shadowColor: "#667eea",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  permissionButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  scannerContainer: {
    flex: 1,
    backgroundColor: "black",
  },
  scannerOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  scannerBox: {
    width: 250,
    height: 250,
    borderWidth: 3,
    borderColor: "#667eea",
    backgroundColor: "transparent",
    borderRadius: 15,
    shadowColor: "#667eea",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.8,
    shadowRadius: 15,
    elevation: 10,
  },
  instructionText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 30,
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  loadingContainer: {
    marginTop: 40,
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 20,
  },
  loadingText: {
    color: "white",
    fontSize: 16,
    marginTop: 10,
    fontWeight: "600",
  },
});
