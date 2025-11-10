import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import React, { useState, useEffect } from "react";
import { CameraView, Camera } from "expo-camera";

const { width } = Dimensions.get("window");

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

  const handleBarcodeScanned = ({ type, data }) => {
    if (isScanning && !isProcessing) {
      setIsProcessing(true);
      setIsScanning(false);

      try {
        // Làm sạch dữ liệu: loại bỏ các ký tự điều khiển không hợp lệ
        const cleanedData = data.replace(/[\u0000-\u0008\u000B-\u001F]/g, "");

        console.log("QR Data:", cleanedData);

        // Kiểm tra nếu là URL hoặc text thông thường (không phải JSON)
        if (
          cleanedData.startsWith("http") ||
          cleanedData.startsWith("www") ||
          (!cleanedData.trim().startsWith("[") &&
            !cleanedData.trim().startsWith("{"))
        ) {
          alert("QR code này không phải định dạng vé!\nData: " + cleanedData);
          setIsScanning(true);
          setIsProcessing(false);
          return;
        }

        // Parse JSON
        const parsedData = JSON.parse(cleanedData);
        const ticketData = Array.isArray(parsedData)
          ? parsedData[0]
          : parsedData;

        navigation.navigate("TicketInfo", { ticketData });
      } catch (error) {
        console.error("Invalid QR code data:", error);
        console.error("Data was:", data);
        alert("Mã QR không hợp lệ!\nVui lòng quét mã QR vé sự kiện");
        setIsScanning(true);
        setIsProcessing(false);
      }
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
});
