import { SafeAreaView } from "react-native-safe-area-context";
import Navigation from "../component/Navigation.js";
import { FlatList, Image, Text, View } from "react-native";
import { useEffect, useState } from "react";
import { callApiWithAuth } from "../service/ApiServices.js";

function Notification({ item }) {
  return (
    <View className="flex-row mt-5 py-3 border-b border-gray-300">
      <Image
        className="ml-5  rounded-full w-16 h-16"
        source={{ uri: `data:image/png;base64,${item.avatar}` }}
      ></Image>
      <View className="ml-3">
        <Text>
          <Text className="font-bold">{item.name}</Text> {item.content}
        </Text>
      </View>
    </View>
  );
}

export default function NotificationScreen() {
  const [notifications, setNotifications] = useState([]);
  const getNotifications = async () => {
    const response = await callApiWithAuth("/noti");
    setNotifications(response);
  };
  useEffect(() => {
    getNotifications();
  }, []);
  return (
    <SafeAreaView className="bg-white flex-1">
      <View>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={notifications}
          key={(item) => item.id}
          renderItem={({item}) => <Notification item={item}></Notification>}
        ></FlatList>
      </View>
    </SafeAreaView>
  );
}
