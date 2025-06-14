import { NavigationContainer, useNavigation } from "@react-navigation/native";
import HomeSceen from "../screen/HomeScreen";
import { Provider, useDispatch, useSelector } from "react-redux";
import store from "../store/store";
import FriendRequestScrren from "../screen/FriendRequestScreen";
import NotificationScreen from "../screen/NotificationScreen";
import Header from "../component/Header";
import {
  CardStyleInterpolators,
  createStackNavigator,
} from "@react-navigation/stack";
import Post from "../component/Post";
import SelfProfileScreen from "../screen/SelfProfileScreen";
import CreatePost from "../component/CreatePost";
import { ChatScreen } from "../screen/ChatScreen";
import { Animated, Button, Text, View } from "react-native";
import { ArrowLeft } from "react-native-feather";
import {
  Easing,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import Messages from "../component/Messages";
import { SafeAreaView } from "react-native-safe-area-context";
import { headerHeight, isVisibale, setScrollY, setVisiable } from "../slice/navigationSlice";
import LoginScreen from "../screen/LoginScreen";
import ResetPasswordScreen from "../screen/ResetPasswordScreen";
import RegisterScreen from "../screen/RegisterScreen";
import { useRef, useState } from "react";
import SearchFriendSceen from "../screen/SearchFriendSceen";
import OtherProfileScreen from "../screen/OtherProfileScreen";
import SettingScreen from "../screen/SettingScreen";
import EditProfileScreen from "../screen/EditProfileScreen";

const Stack = createStackNavigator();
const BackButton = ({ navigation }) => {
  const dispatch = useDispatch();

  const handleBackPress = () => {
    dispatch(setVisiable(true)); // Thay đổi trạng thái setVisible
    navigation.navigate("Home"); // Quay lại màn hình trước
  };

  return (
    <View className="ml-3">
      <ArrowLeft
        className="items-center justify-center"
        width={25}
        height={25}
        color={"gray"}
        onPress={handleBackPress}
        title="Quay lại"
      />
    </View>
  );
};

function RootNavigator() {
  const scrollY = useRef(new Animated.Value(0)).current;
  const isAuth = useSelector((state) => state.auth.isAuthenticated);
  return (
    <NavigationContainer>
      <SafeAreaView style={{ flex: 1 }} forceInset={{ top: "always" }}>
        <Header scrollY={scrollY} />
        <Stack.Navigator
          screenOptions={{
            headerTitleStyle: { fontSize: 24, fontWeight: 600 },
            headerStyle: {
              elevation: 0, // Loại bỏ bóng trên Android nếu có
              shadowOpacity: 0, // Loại bỏ bóng trên iOS nếu có
            },
            // Sử dụng các animation có sẵn
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS, // Hiệu ứng slide ngang như iOS
            transitionSpec: {
              open: { animation: "timing", config: { duration: 300 } }, // Thời gian mở trang
              close: { animation: "timing", config: { duration: 300 } }, // Thời gian đóng trang
            },
          }}
        >
          {!isAuth ? (
            <>
              <Stack.Screen
                name="Login"
                options={{ headerShown: false }}
                component={LoginScreen}
              ></Stack.Screen>
              <Stack.Screen
                name="RegisterScreen"
                options={{ headerShown: false }}
                component={RegisterScreen}
              ></Stack.Screen>
              <Stack.Screen
                name="ResetPasswordScreen"
                options={{ headerShown: false }}
                component={ResetPasswordScreen}
              ></Stack.Screen>
            </>
          ) : (
            <>
              <Stack.Screen name="Home" options={{ headerShown: false }}>
                {(props) => <HomeSceen scrollY={scrollY}></HomeSceen>}
              </Stack.Screen>
              <Stack.Screen
                name="SearchFriend"
                options={{ headerShown: false }}
                component={SearchFriendSceen}
              ></Stack.Screen>
              <Stack.Screen
                name="Setting"
                options={{ headerShown: false }}
                component={SettingScreen}
              ></Stack.Screen>
              <Stack.Screen
                name="OtherProfile"
                options={{ headerShown: false }}
                component={OtherProfileScreen}
              ></Stack.Screen>
              <Stack.Screen
                name="Messages"
                options={{ headerShown: false }}
                component={Messages}
              ></Stack.Screen>
              <Stack.Screen
                name="Chat"
                options={({ navigation }) => ({
                  title: "Đoạn Chat",
                  headerLeft: () => (
                    <BackButton navigation={navigation}></BackButton>
                  ),
                })}
                component={ChatScreen}
              ></Stack.Screen>
              <Stack.Screen
                name="Profile"
                options={{ headerShown: false }}
                component={SelfProfileScreen}
              ></Stack.Screen>
              <Stack.Screen
                name="CreatePost"
                options={{ headerShown: false }}
                component={CreatePost}
              ></Stack.Screen>
               <Stack.Screen
                name="EditProfile"
                options={{ headerShown: false }}
                component={EditProfileScreen}
              ></Stack.Screen>
              <Stack.Screen
                name="FriendRequest"
                options={{ headerShown: false }}
                component={FriendRequestScrren}
              ></Stack.Screen>
              <Stack.Screen
                name="Notifications"
                options={{ headerShown: false }}
                component={NotificationScreen}
              ></Stack.Screen>
            </>
          )}
        </Stack.Navigator>
      </SafeAreaView>
    </NavigationContainer>
  );
}

export default RootNavigator;
