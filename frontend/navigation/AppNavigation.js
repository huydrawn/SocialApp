import { NavigationContainer, useNavigation } from "@react-navigation/native";
import HomeSceen from "../screen/HomeScreen";
import { Provider, useDispatch } from "react-redux";
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
import { Button, View } from "react-native";
import { ArrowLeft } from "react-native-feather";
import Animated, {
  Easing,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { setVisiable } from "../slice/navigationSlice";
import Messages from "../component/Messages";
import RootNavigator from "./RootNavigator";
import { ScrollYProvider } from "../context/ScrollContext";

export default function AppNavigation() {
  return (
    <Provider store={store}>
        <RootNavigator></RootNavigator>
    </Provider>
  );
}
