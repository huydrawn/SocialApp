import {
  Platform,
  View,
  Text,
  TouchableOpacity,
  Image,
  Animated,
  FlatList,
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
import ReplyComment from "./ReplyComment";
import timeAgo from "../untity/TimeUtility";

function Comment({ comment, inputRef, setComentIdReply }) {
  const [viewReply, setViewReply] = useState(false);
  const handlePressOnReply = (name) => {
    setComentIdReply(comment.commentId);
    inputRef.current.focus();
  };
  return (
    <SafeAreaView className="flex-row gap-x-3 mt-5">
      <View>
        <Image
          className="rounded-full w-9 h-9"
          source={{ uri: `data:image/png;base64,${comment.avatar}` }}
        ></Image>
      </View>
      <View className="flex-col ">
        <View className="flex-col  bg-gray-200 rounded-3xl px-3 py-2">
          <Text className="text-sm font-bold">{comment.name}</Text>
          <Text className="text-xs font-medium">{comment.content}</Text>
        </View>
        <View className="flex-row mt-1">
          <Text className="ml-2 text-gray-400 text-xs">
            {timeAgo(comment.createAt)}
          </Text>
          <TouchableOpacity onPress={handlePressOnReply}>
            <Text className="ml-7 text-gray-400 text-xs">Phản hồi</Text>
          </TouchableOpacity>
        </View>
        <View>
          {viewReply ? (
            <View className="ml-4">
              {comment.replys.map((reply) => (
                <ReplyComment key={reply.commentId} reply={reply} />
              ))}
            <TouchableOpacity onPress={() => setViewReply(false)} className="flex items-end">
              <Text className="text-blue-700 ">Ẩn</Text>
            </TouchableOpacity>
            </View>
          ) : (
            comment.replys.length > 0 && (
              <TouchableOpacity className="flex items-start" onPress={() => setViewReply(true)}>
                <View>
                  <Text className="text-blue-700">Xem thêm...</Text>
                </View>
              </TouchableOpacity>
            )
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

export default Comment;
