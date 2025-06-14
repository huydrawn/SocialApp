import { Platform, View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState } from "react";
import {
  AlignJustify,
  ArrowDownCircle,
  Bell,
  Calendar,
  Camera,
  Home,
  MessageCircle,
  Plus,
  PlusSquare,
  Search,
  User,
  Users,
} from "react-native-feather";
import { PlusCircle } from "react-feather";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentNav, setCurrent } from "../slice/navigationSlice";
import { useNavigation } from "@react-navigation/native";

export default function Navigation() {
  const currentNav = useSelector(selectCurrentNav);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const getIconColor = (page) => {
    return currentNav === page ? "blue" : "black"; // Màu xanh nếu được chọn, màu đen nếu không
  };
  return (
    <View className="flex-row justify-between mx-2 mt-4 border-b-black border-1">
      {/* Icon Home */}
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("Home");
          dispatch(setCurrent("Home"));
        }}
      >
        <View
          className={`pb-1 items-center ${
            currentNav === "Home" ? "border-b-2 border-blue-500 w-12" : "w-12"
          }`}
        >
          <Home width={26} height={26} stroke={getIconColor("Home")} />
        </View>
      </TouchableOpacity>

      {/* Icon Users */}
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("FriendRequest");
          dispatch(setCurrent("FriendRequest"));
        }}
      >
        <View
          className={`pb-1 items-center ${
            currentNav === "FriendRequest"
              ? "border-b-2 border-blue-500 w-12"
              : "w-12"
          }`}
        >
          <Users
            width={26}
            height={26}
            stroke={getIconColor("FriendRequest")}
          />
        </View>
      </TouchableOpacity>

      {/* Icon User (Middle Icon) */}
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("Profile");
          dispatch(setCurrent("Profile"));
        }}
      >
        <View
          className={`pb-1 items-center ${
            currentNav === "Profile"
              ? "border-b-2 border-blue-500 w-12"
              : "w-12"
          }`}
        >
          <User width={26} height={26} stroke={getIconColor("Profile")} />
        </View>
      </TouchableOpacity>

      {/* Icon Bell */}
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("Notifications");
          dispatch(setCurrent("Notifications"));
        }}
      >
        <View
          className={`pb-1 items-center ${
            currentNav === "Notifications"
              ? "border-b-2 border-blue-500 w-12"
              : "w-12"
          }`}
        >
          <Bell width={26} height={26} stroke={getIconColor("Notifications")} />
        </View>
      </TouchableOpacity>

      {/* Icon AlignJustify */}
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("Setting");
          dispatch(setCurrent("Setting"));
        }}
      >
        <View
          className={`pb-1 items-center ${
            currentNav === "Menu" ? "border-b-2 border-blue-500 w-12" : "w-12"
          }`}
        >
          <AlignJustify width={26} height={26} stroke={getIconColor("Menu")} />
        </View>
      </TouchableOpacity>
    </View>
  );
}
