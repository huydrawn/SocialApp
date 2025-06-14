import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef } from "react";
import React, { useState } from "react";
import {
  Platform,
  View,
  Text,
  TouchableOpacity,
  Image,
  Easing,
  Animated,
} from "react-native";
import {
  AlignJustify,
  ArrowDownCircle,
  Bell,
  Calendar,
  Camera,
  FilePlus,
  Home,
  MessageCircle,
  Plus,
  PlusSquare,
  Search,
  User,
  Users,
} from "react-native-feather";
import {
  isVisibale,
  selectCurrentNav,
  setVisiable,
} from "../slice/navigationSlice";
import Navigation from "./Navigation";
import { useNavigation } from "@react-navigation/native";
import { useScrollY } from "../context/ScrollContext";
import { SafeAreaView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { callApiWithAuth } from "../service/ApiServices";
import { userIf } from "../slice/userSlice";

export default function Header({ scrollY }) {
  const dispatch = useDispatch();
  const visibale = useSelector(isVisibale);
  const currentNav = useSelector(selectCurrentNav);
  const getUserIf = useSelector(userIf);
  const navigation = useNavigation();
  const createPost = () => {
    dispatch(setVisiable(false));
    navigation.navigate("CreatePost");
  };
  const message = () => {
    dispatch(setVisiable(false));
    navigation.navigate("Chat");
  };
  const searchFriend = () => {
    dispatch(setVisiable(false));
    navigation.navigate("SearchFriend");
  };
  const heightHeader = currentNav === "Home" ? 140 : 60;

  const height = scrollY.interpolate({
    useNativeDriver: false,
    inputRange: [0, 140], // Khoảng giá trị của scrollY
    outputRange: [heightHeader, 0], // Chuyển đổi giá trị từ heightHeader = 200 đến 0
    extrapolate: "clamp", // Không vượt ra ngoài khoảng outputRange
  });
  // TranslateY animation
  const translateY = scrollY.interpolate({
    useNativeDriver: false,
    inputRange: [0, 160], // Khoảng giá trị của scrollY
    outputRange: [0, -160], // Chuyển đổi giá trị từ 0 đến -160
    extrapolate: "clamp",
  });
  return (
    visibale && (
      <Animated.View style={[{ height: height, transform: [{ translateY }] }]}>
        <View className="flex-col py-1 bg-white shadow-md">
          {currentNav == "Home" && (
            <View className=" flex-row justify-between mx-4">
              <Text className="text-2xl font-extrabold text-blue-600">
                Linkify
              </Text>
              <View className="flex-row items-center gap-5">
                <View className="flex items-center rounded-full bg-black border-black border-2">
                  <TouchableOpacity onPress={createPost}>
                    <Plus width={20} height={20} stroke={"white"} />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={searchFriend}>
                  <Search width={26} height={26} stroke={"black"} />
                </TouchableOpacity>
                <TouchableOpacity onPress={message}>
                  <MessageCircle width={26} height={26} stroke={"black"} />
                </TouchableOpacity>
              </View>
            </View>
          )}
          <Navigation />
          {currentNav == "Home" && (
            <View className="flex gap-x-2 flex-row pt-2 px-4 border-t items-center border-t-gray-400">
              <Image
                className="w-10 h-10 rounded-full"
                source={{ uri: `data:image/png;base64,${getUserIf.avatar}` }}
              />
              <View className="flex grow justify-center border border-gray-500 rounded-2xl h-8">
                <Text className="ml-4">Bạn đang nghĩ gì ?</Text>
              </View>
              <TouchableOpacity onPress={createPost}>
                <FilePlus color={"black"} width={30} height={30} />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Animated.View>
    )
  );
}
