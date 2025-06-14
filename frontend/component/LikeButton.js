import {
  Platform,
  View,
  Text,
  TouchableOpacity,
  Image,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useRef, useState } from "react";
import {
  AlignJustify,
  ArrowDownCircle,
  Bell,
  Calendar,
  Camera,
  FilePlus,
  Globe,
  Home,
  MessageCircle,
  MessageSquare,
  MoreHorizontal,
  Plus,
  PlusSquare,
  Search,
  ThumbsUp,
  User,
  Users,
} from "react-native-feather";
import { PlusCircle } from "react-feather";
import { useDispatch, useSelector } from "react-redux";
import {
  isVisibale,
  selectCurrentNav,
  setCurrent,
} from "../slice/navigationSlice";
import Navigation from "./Navigation";
import { callApiWithAuth } from "../service/ApiServices";

function LikeButton({ postId, liked, setLiked }) {
  const scaleAnim = useRef(new Animated.Value(1)).current; // Khởi tạo giá trị scale là 1 (kích thước bình thường)
  const handleLike = () => {
    // Bắt đầu hiệu ứng phóng to
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.5, // Phóng to lên 1.5 lần
        duration: 150, // Thời gian phóng to
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1, // Trở về kích thước bình thường
        duration: 150, // Thời gian thu nhỏ
        useNativeDriver: true,
      }),
    ]).start();
    // Thay đổi trạng thái liked
    const response = callApiWithAuth(`/post/like`, "POST", {
      postId: postId,
    });
    setLiked(!liked);
  };
  return (
    <TouchableOpacity
      onPress={() => handleLike()}
      className="flex-1 flex-row gap-x-3 justify-center items-center"
    >
      <Animated.View
        style={{
          transform: [{ scale: scaleAnim }], // Áp dụng hiệu ứng scale
        }}
      >
        <ThumbsUp
          color={liked ? "blue" : "black"} // Đổi màu nếu đã like
          fill={liked ? "blue" : "none"}
          width={25}
          height={25}
        />
      </Animated.View>
      <Text>thích</Text>
    </TouchableOpacity>
  );
}

export default LikeButton;
