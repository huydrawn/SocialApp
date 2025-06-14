import React, { useEffect, useState } from "react";
import { TouchableOpacity, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import Background from "../component/Background";
import Logo from "../component/Logo";
import Header from "../component/Header";
import Button from "../component/Button";
import TextInput from "../component/TextInput";
import BackButton from "../component/BackButton";
import { theme } from "../core/theme";
import { passwordValidator } from "../helpers/passwordValidator";
import { useNavigation } from "@react-navigation/native";
import HeaderLogin from "../component/HeaderLogin";
import { useDispatch } from "react-redux";
import { setVisiable } from "../slice/navigationSlice";
import { getUserIF, loginApi } from "../service/ApiServices"; // Import API service
import { setCredentials } from "../slice/authSlice";
import { phoneValidator } from "../helpers/phoneValidator";
import { setUser } from "../slice/userSlice";

export default function LoginScreen() {
  const dispath = useDispatch();
  useEffect(() => {
    dispath(setVisiable(false));
  }, []);

  const navigation = useNavigation();
  const [phone, setPhone] = useState({ value: "", error: "" });
  const [password, setPassword] = useState({ value: "", error: "" });

  const [isButtonEnabled, setIsButtonEnabled] = useState(false);

  // Validate input fields whenever the phone or password changes
  useEffect(() => {
    const phoneError = phoneValidator(phone.value);
    const passwordError = passwordValidator(password.value);
    setIsButtonEnabled(!phoneError && !passwordError);
  }, [phone.value, password.value]);
  const phoneChange = (phone) => {
    const phoneError = phoneValidator(phone);
    setPhone({ value: phone, error: phoneError });
  };
  const passwordChange = (password) => {
    const passwordError = passwordValidator(password);
    setPassword({ value: password, error: passwordError });
  };

  const handleLogin = async () => {
    try {
      const result = await loginApi(phone.value, password.value);
      dispath(setCredentials({ accessToken: result.response }));
      const user = await getUserIF(result.response, "/user");
      dispath(setUser(user));
    } catch (error) {
      console.error(error);
    }
  };

  const onLoginPressed = () => {
    const phoneError = phoneValidator(phone.value);
    const passwordError = passwordValidator(password.value);
    setPhone({ ...phone, error: phoneError });
    setPassword({ ...password, error: passwordError });

    if (!phoneError && !passwordError) {
      handleLogin();
    }
  };

  return (
    <Background>
      <Logo />
      <HeaderLogin>Welcome back.</HeaderLogin>
      <TextInput
        label="Phone"
        returnKeyType="next"
        value={phone.value}
        onChangeText={(text) => phoneChange(text)}
        error={!!phone.error}
        errorText={phone.error}
        autoCapitalize="none"
        keyboardType="phone-pad"
      />
      <TextInput
        label="Password"
        returnKeyType="done"
        value={password.value}
        onChangeText={(text) => passwordChange(text)}
        error={!!password.error}
        errorText={password.error}
        secureTextEntry
      />
      <View style={styles.forgotPassword}>
        <TouchableOpacity
          onPress={() => navigation.navigate("ResetPasswordScreen")}
        >
          <Text style={styles.forgot}>Forgot your password?</Text>
        </TouchableOpacity>
      </View>
      <Button
        mode="contained"
        onPress={onLoginPressed}
        disabled={!isButtonEnabled} // Disable the button if validation fails
      >
        Login
      </Button>
      <View style={styles.row}>
        <Text>Don’t have an account? </Text>
        <TouchableOpacity onPress={() => navigation.replace("RegisterScreen")}>
          <Text style={styles.link}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </Background>
  );
}

const styles = StyleSheet.create({
  forgotPassword: {
    width: "100%",
    alignItems: "flex-end",
    marginBottom: 24,
  },
  row: {
    flexDirection: "row",
    marginTop: 4,
  },
  forgot: {
    fontSize: 13,
    color: theme.colors.secondary,
  },
  link: {
    fontWeight: "bold",
    color: theme.colors.primary,
  },
});
