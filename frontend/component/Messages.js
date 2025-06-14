import React, { useCallback, useEffect, useState } from "react";
import { Image, TouchableOpacity } from "react-native";
import { KeyboardAvoidingView, Platform, Text, View } from "react-native";
import { Camera } from "react-native-feather";
import { db } from "../service/firebase";
import {
  collection,
  addDoc,
  query,
  orderBy,
  serverTimestamp,
  onSnapshot,
  doc,
  updateDoc,
  setDoc,
  getDoc,
} from "firebase/firestore";
import {
  Composer,
  GiftedChat,
  InputToolbar,
  Send,
} from "react-native-gifted-chat";
import Modal from "react-native-modal";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useSelector } from "react-redux";
import { chatFriend, userIf } from "../slice/userSlice";
export default function Messages({ isVisible, onClose, user, friend }) {
  const [messages, setMessages] = useState([]);
  const createChatId = (userId1, userId2) => {
    const sortedIds = [userId1, userId2].sort();
    return `${sortedIds[0]}-${sortedIds[1]}`; // Tạo chatId từ userId1 và userId2
  };
  const markChatAsRead = async (chatId, userId) => {
    try {
      const chatRef = doc(db, "chats", chatId);

      // Fetch the chat document to verify the receiver
      const chatDoc = await getDoc(chatRef);

      if (chatDoc.exists()) {
        const chatData = chatDoc.data();

        // Check if the receiver matches the userId
        if (chatData.receiver == userId) {
          // Update the 'read' field to true
          await updateDoc(chatRef, {
            read: true,
          });

          console.log(`Chat ${chatId} marked as read for receiver ${userId}.`);
        } else {
          console.log(`User ${userId} is not the receiver for chat ${chatId}.`);
        }
      } else {
        console.log(`Chat document ${chatId} does not exist.`);
      }
    } catch (error) {
      console.error("Error updating read status: ", error);
    }
  };
  useEffect(() => {
    markChatAsRead(createChatId(user.userId, friend.userId), user.userId);

    const messagesRef = collection(
      db,
      "messages",
      createChatId(user.userId, friend.userId),
      "messages"
    );
    const messagesQuery = query(messagesRef, orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const updatedMessages = snapshot.docs.map((doc) => ({
        _id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(), // Chuyển timestamp Firestore thành Date
      }));
      setMessages(updatedMessages);
    });
    return () => unsubscribe(); // Hủy lắng nghe khi component bị hủy
  }, [isVisible]);
  const sendMessage = async (message) => {
    try {
      // Tạo chatId duy nhất cho cuộc trò chuyện giữa sender và receiver
      const chatId = createChatId(user.userId, friend.userId);
      // Tạo tin nhắn
      const newMessage = {
        ...message, // Sao chép tất cả các thuộc tính của đối tượng hiện tại
        read: false, // Thêm trường `read` và giá trị ban đầu là false
      };

      // Lưu tin nhắn vào collection "messages"
      await addDoc(collection(db, "messages", chatId, "messages"), newMessage);

      // Cập nhật hoặc tạo cuộc trò chuyện trong collection "chats"
      const chatRef = doc(db, "chats", chatId);
      await setDoc(
        chatRef,
        {
          lastMessage: message.text,
          lastMessageTime: serverTimestamp(),
          read: false, // Đánh dấu trạng thái tin nhắn chưa đọc
          participants: [user.userId, friend.userId], // Danh sách userId của hai người tham gia
          sender: user.userId, // ID của người gửi tin nhắn cuối cùng
          receiver: friend.userId, // ID của người nhận tin nhắn
        },
        { merge: true } // Merge để không ghi đè dữ liệu đã có
      );
      console.log("Message sent!");
    } catch (error) {
      console.error("Error sending message: ", error);
    }
  };
  const onSend = useCallback((messages = []) => {
    sendMessage(messages[0]);
  }, []);
  return (
    isVisible &&
    friend.userId && (
      <SafeAreaView className="flex-1 bg-white">
        <View className="border-b border-gray-300 h-20 gap-x-5 ml-1  flex-row items-center">
          <TouchableOpacity onPress={onClose}>
            <Ionicons
              name="arrow-back-outline"
              color={"violet"}
              size={24}
            ></Ionicons>
          </TouchableOpacity>
          <Image
            className="w-10 h-10 rounded-full"
            source={{ uri: `data:image/png;base64,${friend.avatar}` }}
          ></Image>
          <Text className="text-lg" numberOfLines={1} ellipsizeMode="tail">
            {friend.name}
          </Text>
        </View>

        <GiftedChat
          messages={messages}
          listViewProps={{ keyboardDismissMode: "on-drag" }}
          onSend={(messages) => onSend(messages)}
          user={{ _id: user.userId }}
          infiniteScroll
          style={{ flex: 1 }} // Ensures GiftedChat takes up full height
          bottomOffset={0} // Adjust if there's unwanted space at the bottom
          keyboardShouldPersistTaps="handled"
          alwaysShowSend={true}
          renderSend={(props) => (
            <Send
              {...props}
              containerStyle={{
                justifyContent: "center",
                alignItems: "center",
                padding: 5,
              }}
            >
              <Ionicons name="send" color="blue" size={28} />
            </Send>
          )}
          renderInputToolbar={(props) => (
            <InputToolbar
              {...props}
              containerStyle={{
                borderTopWidth: 0, // Loại bỏ border-top
                padding: 5,
              }}
              renderComposer={(props) => (
                <Composer
                  {...props}
                  textInputStyle={{
                    borderRadius: 20,
                    paddingHorizontal: 12,
                    marginRight: 8,
                    backgroundColor: "#f0f0f0",
                  }}
                  placeholder="Nhắn tin"
                />
              )}
            />
          )}
          messagesContainerStyle={{ backgroundColor: "#ffffff" }} // Màu nền của khu vực hiển thị tin nhắn
          wrapperStyle={{}}
        />
      </SafeAreaView>
    )
  );
}
