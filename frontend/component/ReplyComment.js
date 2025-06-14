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
import timeAgo from "../untity/TimeUtility";
  
  const ReplyComment = React.memo(({reply}) => {
    return (
      <SafeAreaView className="flex-row gap-x-3 mt-5">
        <View>
          <Image
            className="rounded-full w-9 h-9"
            source={{ uri: `data:image/png;base64,${reply.avatar}` }}
          ></Image>
        </View>
        <View className="flex-col ">
          <View className="flex-col  bg-gray-200 rounded-3xl px-3 py-2">
            <Text className="text-sm font-bold">{reply.name}</Text>
            <Text className="text-xs font-medium">
              {reply.content}
            </Text>
          </View>
          <View className="flex-row mt-1">
            <Text className="ml-2 text-gray-400 text-xs">{timeAgo(reply.createAt)}</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  });
  
  export default ReplyComment;
  