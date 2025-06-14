import {
  Platform,
  View,
  Text,
  TouchableOpacity,
  Image,
  Animated,
  FlatList,
  Pressable,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useEffect, useRef, useState } from "react";
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
import Comment from "./Comment";
import { ScrollView } from "react-native";
import { callApiWithAuth } from "../service/ApiServices";

function Comments({ post, inputRef, setCommentText, comments, setComments , setComentIdReply}) {
  useEffect(() => {
    fetchComments();
  }, []);
  const [refreshing, setRefreshing] = useState(false);
  const fetchComments = async () => {
    setRefreshing(true)
    const response = await callApiWithAuth(`/post/comment/${post.postId}`);
    setComments(response);
    setRefreshing(false)
  };
  return (
    <Pressable className="ml-4 h-full pb-36">
      <FlatList
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchComments} />
        }
        data={comments}
        renderItem={({ item }) => (
          <Pressable>
            <Comment  setComentIdReply={setComentIdReply} inputRef={inputRef} comment={item} />
          </Pressable>
        )}
        key={(item) => item.commentId}
        showsVerticalScrollIndicator={false}
      />
    </Pressable>
  );
}

export default Comments;
