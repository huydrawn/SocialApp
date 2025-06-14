import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import { Camera, CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { useDispatch, useSelector } from "react-redux";
import { setVisiable } from "../slice/navigationSlice";
import QRCode from "react-native-qrcode-svg";
import { AntDesign, Feather } from "@expo/vector-icons"; // Import Feather icons
import { userIf } from "../slice/userSlice";

const SearchFriendScreen = ({navigation}) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const user = useSelector(userIf);
  const [qrData, setQrData] = useState(user.userId+"");
  const [isQRCodeVisible, setIsQRCodeVisible] = useState(true); // State to toggle between QR and Scan view
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setVisiable(false));
     // Yêu cầu quyền camera
     const requestCameraPermission = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };

    requestCameraPermission();
  }, []);

  const handleQRCodeRead = ({ type, data }) => {
    setScanned(true);
    navigation.navigate("OtherProfile", { profileId: data });
    setScanned(false);
  };

  const handleScanQRCode = () => {
    setIsQRCodeVisible(false); // Hide QR Code and show scanning view
  };

  const handleShowQRCode = () => {
    setIsQRCodeVisible(true); // Show QR Code and hide scanning view
  };
  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }
  if (!permission.granted) {
    return (
      <View style={styles.centeredContainer}>
        <Text>Ứng dụng cần quyền truy cập camera để quét mã QR</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Phần hiển thị mã QR của tôi */}
      {isQRCodeVisible ? (
        <View style={styles.qrContainer}>
          <Text style={styles.headerText}>Mã QR của tôi</Text>
          <View style={styles.qrCodeWrapper}>
            <QRCode value={qrData} size={150} />
          </View>
          <Text style={styles.qrText}>
            Quét mã này để xem thông tin của tôi
          </Text>
        </View>
      ) : (
        <View style={styles.cameraContainer}>
          <Text style={styles.headerText}>Quét mã QR</Text>
          <CameraView
            style={styles.cameraView}
            onBarcodeScanned={scanned ? undefined : handleQRCodeRead}
          />
        </View>
      )}

      {/* Phần biểu tượng chuyển đổi giữa QR và Scan */}
      <View className="pt-3" style={styles.bottomRow}>
        <TouchableOpacity style={styles.iconWrapper} onPress={handleShowQRCode}>
          <AntDesign
            name="qrcode"
            size={30}
            color={isQRCodeVisible ? "#3b82f6" : "#000"}
          />
          <Text
            style={[
              styles.iconText,
              { color: isQRCodeVisible ? "#3b82f6" : "#000" },
            ]}
          >
            QR của tôi
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconWrapper} onPress={handleScanQRCode}>
          <AntDesign
            name="scan1"
            size={30}
            color={!isQRCodeVisible ? "#3b82f6" : "#000"}
          />
          <Text
            style={[
              styles.iconText,
              { color: !isQRCodeVisible ? "#3b82f6" : "#000" },
            ]}
          >
            Scan
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cameraContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  qrContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  qrCodeWrapper: {
    padding: 20,
    backgroundColor: "#f3f4f6",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  qrText: {
    marginTop: 10,
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
  },
  cameraView: {
    flex: 1,
    width: "100%",
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  iconWrapper: {
    justifyContent: "center",
    alignItems: "center",
  },
  iconText: {
    fontSize: 14,
    marginTop: 5,
  },
});

export default SearchFriendScreen;
