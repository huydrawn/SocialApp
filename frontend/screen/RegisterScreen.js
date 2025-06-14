import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Snackbar, Text } from "react-native-paper";
import Background from "../component/Background";
import Logo from "../component/Logo";
import Header from "../component/Header";
import Button from "../component/Button";
import TextInput from "../component/TextInput";
import BackButton from "../component/BackButton";
import { theme } from "../core/theme";
import { emailValidator } from "../helpers/emailValidator";
import { passwordValidator } from "../helpers/passwordValidator";
import { nameValidator } from "../helpers/nameValidator";
import { useNavigation } from "@react-navigation/native";
import HeaderLogin from "../component/HeaderLogin";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "react-native-modal-datetime-picker";
import { callApiWithAuth, registerApi } from "../service/ApiServices";

export default function RegisterScreen() {
  const [name, setName] = useState({ value: "", error: "" });
  const [phoneNumber, setPhoneNumber] = useState({ value: "", error: "" });
  const [password, setPassword] = useState({ value: "", error: "" });
  const [repassword, setRepassword] = useState({ value: "", error: "" });
  const [gender, setGender] = useState("");
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [birth, setBirth] = useState(new Date());
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  const navigation = useNavigation();
  const onSignUpPressed = async () => {
    const nameError = nameValidator(name.value);
    const passwordError = passwordValidator(password.value);
    if (passwordError || nameError) {
      setName({ ...name, error: nameError });
      setPassword({ ...password, error: passwordError });
      return;
    }
    try {
      await registerApi("/auth/register", "POST", {
        name: name.value,
        phone: phoneNumber.value,
        gender: gender.toUpperCase(),
        birth: birth.getTime(),
        password: password.value,
      });
      // Hiển thị thông báo đăng ký thành công
      setSnackbarVisible(true);

      // Chuyển tới trang login sau 2 giây
      setTimeout(() => {
        setSnackbarVisible(false);
        navigation.navigate("Login");
      }, 2000);
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };
  const handleConfirm = (date) => {
    setBirth(date);
    setDatePickerVisibility(false);
  };
  return (
    <Background>
      <HeaderLogin>Create Account</HeaderLogin>
      {/* YourName */}
      <TextInput
        label="Your Name"
        returnKeyType="next"
        value={name.value}
        onChangeText={(text) => setName({ value: text, error: "" })}
        error={!!name.error}
        errorText={name.error}
      />

      {/* Phone Number */}
      <TextInput
        label="Phone Number"
        returnKeyType="next"
        value={phoneNumber.value}
        onChangeText={(text) => setPhoneNumber({ value: text, error: "" })}
        error={!!phoneNumber.error}
        errorText={phoneNumber.error}
        keyboardType="phone-pad"
      />

      {/* Password */}
      <TextInput
        label="Password"
        returnKeyType="next"
        value={password.value}
        onChangeText={(text) => setPassword({ value: text, error: "" })}
        error={!!password.error}
        errorText={password.error}
        secureTextEntry
      />

      {/* Repassword */}
      <TextInput
        label="Repassword"
        returnKeyType="next"
        value={repassword.value}
        onChangeText={(text) => setRepassword({ value: text, error: "" })}
        error={!!repassword.error}
        errorText={repassword.error}
        secureTextEntry
      />

      {/* Gender */}
      <View className="flex-row items-center space-x-4">
        {/* Gender Selector */}
        <Text className="text-lg font-semibold">Gender</Text>
        <View className="flex-1">
          <Picker
            selectedValue={gender}
            onValueChange={(itemValue) => setGender(itemValue)}
            style={{ height: 50, width: "100%" }} // Add custom picker style if needed
          >
            <Picker.Item label="Male" value="MALE" />
            <Picker.Item label="Female" value="FEMALE" />
          </Picker>
        </View>

        {/* Display selected gender */}
        <Text className="text-lg font-medium">
          {gender ? `Selected: ${gender}` : "No gender selected"}
        </Text>
      </View>

      {/* Birth */}
      <View className="flex-row w-full justify-between mt-2 bg-white ">
        {/* Label */}
        <Text className="text-lg font-semibold text-gray-800 ">Birth Date</Text>

        {/* Date Display */}
        <TouchableOpacity
          onPress={() => setDatePickerVisibility(true)}
          className="bg-gray-100 px-4 py-2 rounded-lg border border-gray-300"
        >
          <Text className="text-gray-700">{birth.toDateString()}</Text>
        </TouchableOpacity>

        {/* Date Picker */}
        <DateTimePicker
          isVisible={isDatePickerVisible}
          mode="date"
          date={birth}
          onConfirm={handleConfirm}
          onCancel={() => setDatePickerVisibility(false)}
        />
      </View>

      {/* Sign Up Button */}
      <Button
        mode="contained"
        onPress={onSignUpPressed}
        style={{ marginTop: 24 }}
      >
        Sign Up
      </Button>
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={2000} // Thời gian hiển thị (2 giây)
      >
        Registration successful! Redirecting to Login...
      </Snackbar>
      {/* Footer */}
      <View className="flex-row">
        <Text>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.replace("Login")}>
          <Text style={styles.link}>login</Text>
        </TouchableOpacity>
      </View>
    </Background>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  backButton: {
    marginBottom: 16,
  },
  backText: {
    fontSize: 16,
    color: "#007BFF",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  logo: {
    fontSize: 32,
    fontWeight: "bold",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
  },
  input: {
    marginBottom: 16,
  },
  pickerContainer: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    fontSize: 16,
    fontWeight: "500",
  },
  picker: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  datePickerContainer: {
    marginBottom: 16,
  },
  dateText: {
    fontSize: 16,
    color: "#007BFF",
  },
  button: {
    marginTop: 24,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  link: {
    color: "#007BFF",
    fontWeight: "bold",
  },
});
