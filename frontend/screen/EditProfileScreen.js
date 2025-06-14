import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker"; // Import DateTimePicker
import { useRoute, useNavigation } from "@react-navigation/native";
import { callApiWithAuth } from "../service/ApiServices";
import { useDispatch } from "react-redux";
import { updateProfile } from "../slice/userSlice";

const EditProfileScreen = () => {
  const route = useRoute();
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const profile = route.params?.profile || {};

  // Chuyển đổi timestamp birth thành ngày
  const initialBirthDate = profile.birth
    ? new Date(profile.birth).toISOString().split("T")[0]
    : "";

  const [name, setName] = useState(profile.name || "");
  const [birthDate, setBirthDate] = useState(initialBirthDate);
  const [date, setDate] = useState(new Date()); // Đặt giá trị ban đầu của birthDate
  const [status, setStatus] = useState(profile.status || "");
  const [isDatePickerVisible, setDatePickerVisible] = useState(false); // State to handle visibility of DateTimePicker

  // Handle date selection
  const handleConfirm = (date) => {
    setDate(date);
    setBirthDate(date.toISOString().split("T")[0]); // Set selected date to the input
    setDatePickerVisible(false); // Hide the date picker
  };

  // Handle cancellation of date picker
  const handleCancel = () => {
    setDatePickerVisible(false);
  };

  const handleSave = () => {
    callApiWithAuth("/user/update", "PUT", {
      name: name,
      birth: date.getTime(),
    });
    dispatch(updateProfile({ name, birth: date.getTime() }));
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>Chỉnh sửa trang cá nhân</Text>

        {/* Tên */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Tên:</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={(text) => setName(text)}
            placeholder="Nhập tên của bạn"
          />
        </View>

        {/* Ngày sinh */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Ngày sinh:</Text>
          <TouchableOpacity
            style={styles.input}
            onPress={() => setDatePickerVisible(true)}
          >
            <Text style={styles.inputText}>
              {birthDate ? birthDate : "Chọn ngày sinh"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Nút lưu */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Lưu</Text>
        </TouchableOpacity>

        {/* DateTimePicker */}
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  fieldContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  inputText: {
    fontSize: 16,
    color: "#555",
  },
  saveButton: {
    marginTop: 20,
    backgroundColor: "#1877f2",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default EditProfileScreen;
