import { Platform, View, Text, TouchableOpacity, Animated } from "react-native";
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
import CommentModal from "./CommentModal";
import LikeButton from "./LikeButton";
import { Image } from "react-native";
import timeAgo from "../untity/TimeUtility";
// const [liked, setLiked] = useState(false);

const Post = React.memo(({ post }) => {
  const [liked, setLiked] = useState(post.liked);
  const [isModalVisible, setModalVisible] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current; // Khởi tạo giá trị scale là 1 (kích thước bình thường)
  const handleLike = (item) => {
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
    setLiked(!liked);
  };

  return (
    <SafeAreaView>
      <View className="flex-col py-2 bg-white border-t-4 border-t-gray-400">
        <View className="flex-col px-3">
          {/* Header với ảnh đại diện và tên người đăng */}
          <View className="flex-row gap-x-3 items-center">
            <Image
              className="w-10 h-10 rounded-full"
              source={{ uri: `data:image/png;base64,${post.avatarUser}` }}
            />
            <View className="grow flex-col">
              <Text className="text-xl font-extrabold">{post.name}</Text>
              <View className="flex-row items-center gap-x-2 text-sm font-thin">
                <Text>{timeAgo(post.createAt)}</Text>
                <Text>.</Text>
                <Globe color={"black"} width={15} height={15} />
              </View>
            </View>
            {/* Icon more ở góc trên */}
            <MoreHorizontal color={"black"} width={30} height={30} />
          </View>

          {/* Nội dung bài đăng */}
          <View className="my-3">
            <Text className="text-base font-normal">{post.content}</Text>
          </View>
        </View>

        {/* Hình ảnh bài đăng */}
        <Image
          source={{
            uri: `data:image/png;base64,${post.image}`,
          }}
          className="w-full h-80"
          resizeMode="cover"
        />
        {/* Phần tương tác (like, comment) */}
        <View className="flex-col">
          <View className="px-3 mt-1 flex-row">
            <View className="flex-1 flex-row gap-x-2 items-center">
              <ThumbsUp color={"blue"} fill={"blue"} width={15} height={15} />
              <Text>{post.numberLike}</Text>
            </View>
            <View className="flex-1 flex-row gap-x-2 justify-end items-center">
              <Text>{post.numberComment}</Text>
              <Text>bình luận</Text>
            </View>
          </View>

          {/* Hành động like, bình luận */}
          <View className="mt-2 px-3 flex-row justify-between">
            <LikeButton
              postId={post.postId}
              liked={liked}
              setLiked={setLiked}
            ></LikeButton>
            <TouchableOpacity
              onPress={() => setModalVisible(true)}
              className="flex-1 flex-row gap-x-3 justify-center items-center"
            >
              <MessageSquare color={"black"} width={25} height={25} />
              <Text>bình luận</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <CommentModal
        isVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
        post={post}
        liked={liked}
        setLiked={setLiked}
      />
    </SafeAreaView>
  );
});

export default Post;
