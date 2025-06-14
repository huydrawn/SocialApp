import { Badge } from "@rneui/base";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  SafeAreaView,
  FlatList,
  RefreshControl,
} from "react-native";
import { callApiWithAuth } from "../service/ApiServices";
import { useNavigation } from "@react-navigation/native";

export default function FriendRequestScreen() {
  const navigation = useNavigation();
  const [response, setResponse] = useState({});
  const [data, setData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const refresh = () => {
    setRefreshing(true);
    loadData();
    setRefreshing(false);
  };
  const loadData = async () => {
    const invites = await callApiWithAuth(`/friend/addfriend`);
    const suggestions = await callApiWithAuth(`/friend/suggest`);
    setData([
      { type: "header", title: "Lời mời kết bạn", badge: invites.length },
      ...invites.map((invite) => ({ ...invite, type: "invite" })),
      { type: "header", title: "Gợi ý kết bạn", badge: suggestions.length },
      ...suggestions.map((suggestion) => ({
        ...suggestion,
        type: "suggestion",
      })),
    ]);
  };
  useEffect(() => {
    loadData();
  }, []);
  const goToOtherProfile = (id) => {
    navigation.navigate("OtherProfile", { profileId: id });
  };
  const handleButtonClick = (id, type) => {
    if (type === "invite")
      callApiWithAuth(`/friend/accept/addfriend`, "PUT", { userId: id });
    else callApiWithAuth(`/friend/addfriend`, "POST", { userId: id });
    setResponse((prevResponse) => ({
      ...prevResponse,
      [id]:
        type === "invite" ? "Bạn đã đồng ý lời mời" : "Đã gửi lời mời kết bạn",
    }));
  };

  const handleRejectClick = (id, type) => {
    if (type === "invite")
      callApiWithAuth(`/friend/reject/addfriend`, "POST", { userId: id });

    setResponse((prevResponse) => ({
      ...prevResponse,
      [id]:
        type === "invite" ? "Bạn đã từ chối lời mời" : "Đã xóa gợi ý kết bạn",
    }));
  };

  const renderInvite = ({ item }) => (
    <View className="flex-row justify-between items-center p-4 border-b border-gray-300">
      <TouchableOpacity onPress={() => goToOtherProfile(item.userId)}>
        <View className="basis-1/4 items-center mr-3">
          <Image
            className=" rounded-full w-16 h-16"
            source={{ uri: `data:image/png;base64,${item.avatar}` }}
          ></Image>
        </View>
      </TouchableOpacity>
      <View className=" basis-3/4 flex-col gap-y-3 ">
        <Text className="text-xl font-bold text-gray-500">{item.name}</Text>
        {response[item.userId] ? (
          <Text>{response[item.userId]}</Text>
        ) : (
          <View className="flex-row gap-x-3 ">
            <TouchableOpacity
              className="basis-2/5 p-2 bg-blue-500 rounded-xl items-center justify-center"
              onPress={() => handleButtonClick(item.userId, "invite")}
            >
              <Text className="text-white font-bold text-sm">Đồng ý</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="basis-2/5 p-2 bg-gray-300 rounded-xl items-center justify-center"
              onPress={() => handleRejectClick(item.userId, "invite")}
            >
              <Text className="text-black font-bold text-sm">Từ chối</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );

  const renderSuggestion = ({ item }) => (
    <View className="flex-row justify-between items-center p-4 border-b border-gray-300">
      <TouchableOpacity onPress={() => goToOtherProfile(item.userId)}>
        <View className="basis-1/4 items-center mr-3">
          <Image
            className=" rounded-full w-16 h-16"
            source={{ uri: `data:image/png;base64,${item.avatar}` }}
          ></Image>
        </View>
      </TouchableOpacity>
      <View className=" basis-3/4 flex-col gap-y-3 ">
        <Text className="text-xl font-bold text-gray-500">{item.name}</Text>
        {response[item.userId] ? (
          <Text>{response[item.userId]}</Text>
        ) : (
          <View className="flex-row gap-x-3 ">
            <TouchableOpacity
              className="basis-2/5 p-2 bg-blue-500 rounded-xl items-center justify-center"
              onPress={() => handleButtonClick(item.userId, "suggestion")}
            >
              <Text className="text-white font-bold text-sm">Gửi lời mời</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="basis-2/5 p-2 bg-gray-300 rounded-xl items-center justify-center"
              onPress={() => handleRejectClick(item.userId, "suggestion")}
            >
              <Text className="text-black font-bold text-sm">Xóa</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );

  const renderHeader = (title, badgeValue) => (
    <View className="flex-row items-center mx-2">
      <Text className="text-lg font-bold mr-3">{title}</Text>
      <Badge status="error" value={badgeValue} />
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <FlatList
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refresh}
          ></RefreshControl>
        }
        data={data}
        renderItem={({ item }) => {
          if (item.type === "header") {
            return renderHeader(item.title, item.badge);
          }
          if (item.type === "invite") {
            return renderInvite({ item });
          }
          return renderSuggestion({ item });
        }}
        keyExtractor={(item) => item.userId}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}
