import React, { useRef, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Pressable,
} from "react-native";
import Modal from "react-native-modal";

function FriendModal({ isVisible, onClose, friends }) {
  const [allowSwipe, setAllowSwipe] = useState(true);

  const renderFriendItem = ({ item }) => (
    <View className="flex-row items-center p-3 border-b border-gray-200">
      <Image
        source={{ uri: `data:image/png;base64,${item.avatar}` }}
        className="w-12 h-12 rounded-full"
        style={{ marginRight: 10 }}
      />
      <View className="flex-1">
        <Text className="text-lg font-semibold">{item.name}</Text>
        <Text className="text-sm text-gray-500">User ID: {item.userId}</Text>
      </View>
      <TouchableOpacity
        className="bg-blue-500 px-3 py-1 rounded"
        onPress={() => alert(`Send message to ${item.name}`)}
      >
        <Text className="text-white">Message</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <Modal
      className="h-screen w-screen m-0"
      customBackdrop={<View style={{ flex: 1 }} />}
      onSwipeComplete={onClose}
      swipeDirection={allowSwipe ? "down" : []} // Tắt swipe khi cuộn
      propagateSwipe
      isVisible={isVisible}
    >
      <View className="bg-white flex-1">
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200">
          <Text className="text-xl font-bold">Friends</Text>
        </View>
        {/* Friend List */}
        <Pressable>
          <FlatList
            data={friends}
            keyExtractor={(item) => item.userId}
            renderItem={renderFriendItem}
            showsVerticalScrollIndicator={false}
            onScrollBeginDrag={() => setAllowSwipe(false)}
            onScrollEndDrag={() => setAllowSwipe(true)}
          />
        </Pressable>
      </View>
    </Modal>
  );
}

export default FriendModal;
