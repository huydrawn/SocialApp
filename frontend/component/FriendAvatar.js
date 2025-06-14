import { Image, Text, View } from "react-native";

export default function FriendAvatar({ friend }) {
  return (
    <View className="w-full flex-col ">
      <Image
        className="w-28 h-28"
        source={{ uri: `data:image/png;base64,${friend.avatar}` }}
      ></Image>
      <Text
        className="text-base font-medium mt-2 text-center"
        style={{ flex: 1, textAlign: "center", width: 112 }}
      >
        {friend.name}
      </Text>
    </View>
  );
}
