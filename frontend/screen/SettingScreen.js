import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { clearCredentials, logout } from "../slice/authSlice"; // Thay đổi theo slice Redux của bạn
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeft } from "react-native-feather";
import { setCurrent } from "../slice/navigationSlice";

export default function SettingScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const handleLogout = () => {
    Alert.alert(
      "Đăng xuất",
      "Bạn có chắc chắn muốn đăng xuất không?",
      [
        {
          text: "Hủy",
          style: "cancel",
        },
        {
          text: "Đăng xuất",
          style: "destructive",
          onPress: () => {
            // Xóa thông tin đăng nhập
            dispatch(logout());
            // Điều hướng người dùng về màn hình đăng nhập
            navigation.replace("Login"); // Thay "Login" bằng tên route của màn hình đăng nhập của bạn
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ChevronLeft width={30} height={30} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cài đặt</Text>
        <View style={{ width: 30 }} /> {/* Placeholder để căn giữa title */}
      </View>

      {/* Content */}
      <View style={styles.content}>
        <TouchableOpacity style={styles.option} onPress={handleLogout}>
          <Text style={styles.optionText}>Đăng xuất</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    backgroundColor: "#fff",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
  content: {
    marginTop: 20,
    padding: 16,
  },
  option: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#fff",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  optionText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "600",
  },
});