import { Video } from "expo-av";
import { db } from "../service/firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
  query,
  doc,
  updateDoc,
  setDoc,
  where,
  getDocs,
  orderBy,
} from "firebase/firestore";
import React, { useState, useCallback, useEffect, useRef } from "react";
import { GiftedChat, InputToolbar } from "react-native-gifted-chat";
import { useDispatch, useSelector } from "react-redux";
import { setVisiable } from "../slice/navigationSlice";
import { SafeAreaView } from "react-native-safe-area-context";
import { callApiWithAuth } from "../service/ApiServices"; // Import API service
import { tailwind } from "nativewind";
import {
  FlatList,
  Image,
  Modal,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import { TouchableOpacity } from "react-native";
import { SearchBar } from "@rneui/base";
import MessagesModal from "../component/Messages";
import { useNavigation } from "@react-navigation/native";
import { chatFriend, setChatFriend, userIf } from "../slice/userSlice";

function IsOnline({ friend }) {
  const [isOnline, setIsOnline] = useState(false);
  const listenForUserStatus = (userId) => {
    const userRef = doc(db, "users", userId + "");
    const unsubscribe = onSnapshot(userRef, (docSnapshot) => {
      if (docSnapshot.exists() && docSnapshot.data().status == "online") {
        setIsOnline(true);
      } else {
        setIsOnline(false);
      }
    });
    return unsubscribe; // Gọi để dừng lắng nghe khi không cần thiết
  };
  useEffect(() => {
    listenForUserStatus(friend.userId);
  }, []);
  return (
    <View>
      {isOnline && (
        <View className="absolute right-0 bottom-0 w-3 h-3 rounded-full mt-1 bg-green-500" />
      )}
    </View>
  );
}

function UserAvatar({ handleUserChat, friend }) {
  return (
    <TouchableOpacity onPress={handleUserChat}>
      <View className="items-center mr-8 my-3">
        <View className="flex">
          <Image
            source={{ uri: `data:image/png;base64,${friend.avatar}` }}
            className="w-16 h-16 rounded-full border-2 border-gray-300"
          />
          <IsOnline friend={friend}></IsOnline>
        </View>
        <Text className="mt-1 text-sm font-bold">
          {friend.name.split(" ").pop()}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
function UserMessage({ handleUserChat, item, userId }) {
  function formatMessageTime(lastMessageTime) {
    // Chuyển đổi từ Firestore Timestamp (seconds và nanoseconds) thành đối tượng Date
    const timestamp = new Date(
      lastMessageTime.seconds * 1000 + lastMessageTime.nanoseconds / 1000000
    );

    // Lấy giờ và phút
    const hours = timestamp.getHours();
    const minutes = timestamp.getMinutes();

    // Định dạng lại thời gian theo dạng HH:mm
    const formattedTime = `${hours}:${minutes < 10 ? "0" + minutes : minutes}`;

    return formattedTime;
  }
  return (
    <TouchableOpacity onPress={handleUserChat}>
      <View className="flex-row mt-5">
        <View className="flex">
          <Image
            source={{
              uri: `data:image/png;base64,${item.inf.response.avatar}`,
            }}
            className="w-16 h-16 rounded-full border-2 border-gray-300"
          />
          <IsOnline friend={item.inf.response}></IsOnline>
        </View>
        <View className="flex-col ml-3">
          <Text className="text-xl" numberOfLines={1} ellipsizeMode="tail">
            {item.inf.response.name}
          </Text>
          <Text
            className={`text-lg ${
              item.read
                ? "text-gray-500"
                : item.sender == userId
                ? "text-gray-500"
                : "text-black font-bold"
            }`}
          >
            {item.lastMessage.length > 20
              ? item.lastMessage.slice(0, 20) + "..."
              : item.lastMessage}{" "}
            <Text className="text-center">{"\u2022"}</Text>{" "}
            {formatMessageTime(item.lastMessageTime)}{" "}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export function ChatScreen() {
  const dispath = useDispatch();
  const user = useSelector(userIf);
  const friend = useSelector(chatFriend);
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [messagesModalVisible, setMessagesModalVisible] = useState(false);
  const [chats, setChats] = useState([]);
  const [friends, setFriends] = useState([]);
  const updateUserStatus = async (userId, status) => {
    try {
      // Tạo tham chiếu tới tài liệu của người dùng với userId làm key
      const userRef = doc(db, "users", userId + "");

      // Cập nhật hoặc tạo tài liệu
      await setDoc(
        userRef,
        {
          userId: userId, // Lưu ID người dùng
          status: status, // Trạng thái "online" hoặc "offline"
          lastSeen: serverTimestamp(), // Lưu thời gian cuối cùng người dùng online
        },
        { merge: true } // merge để không ghi đè các trường khác nếu đã tồn tại
      );
    } catch (error) {
      console.error("Error updating user status:", error);
    }
  };
  const getFriends = async () => {
    const response = await callApiWithAuth(`/friend`);
    setFriends(response);
  };
  const getUserChats = (userId) => {
    try {
      const chatsRef = collection(db, "chats");
      const chatsQuery = query(
        chatsRef,
        where("participants", "array-contains", userId), // Tìm cuộc trò chuyện mà user tham gia
        orderBy("lastMessageTime", "desc") // Sắp xếp theo thời gian tin nhắn cuối
      );

      // Lắng nghe sự thay đổi dữ liệu trong thời gian thực
      const unsubscribe = onSnapshot(chatsQuery, async (querySnapshot) => {
        const chats = [];
        // Duyệt qua các document và push dữ liệu vào mảng
        querySnapshot.forEach((doc) => {
          chats.push(doc.data());
        });

        // Cập nhật thông tin người bạn trong mỗi chat
        const newChats = await Promise.all(
          chats.map(async (chat) => {
            const chatFriendId = chat.participants.filter(
              (item) => item !== userId
            )[0];
            const response = await callApiWithAuth(
              `/user/get-inf/${chatFriendId}`
            );
            // Thêm thông tin vào trường 'inf' cho mỗi chat
            return {
              ...chat,
              inf: { response },
            };
          })
        );

        // Cập nhật state với các cuộc trò chuyện mới
        setChats(newChats);
      });

      // Nếu không cần theo dõi nữa, gọi unsubscribe để hủy lắng nghe
      // return unsubscribe;
    } catch (error) {
      console.error("Error fetching user chats:", error);
    }
  };
  useEffect(() => {
    getUserChats(user.userId);
    updateUserStatus(user.userId, "online");
    getFriends();
    return () => {
      updateUserStatus(user.userId, "offline");
    };
  }, []);
  const searchBarRef = useRef(null); // Tạo ref
  const navigation = useNavigation();
  const os = Platform.OS;
  const updateSearch = (text) => {
    setSearch(text);
    if (text) {
      const results = DATA.filter((item) =>
        item.name.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredData(results);
    }
  };

  const handleSelectItem = (item) => {
    setSearch(item.name);
    setFilteredData([]);

    // Kiểm tra nếu ref tồn tại trước khi gọi `blur`
    if (searchBarRef.current) {
      searchBarRef.current.blur();
    }
  };
  const handleCancel = () => {
    setSearch("");
    if (searchBarRef.current) {
      searchBarRef.current.blur();
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {!messagesModalVisible && (
        <View>
          {filteredData.length > 0 && search != "" && (
            <View
              className="absolute top-20 w-full bg-white shadow-lg rounded-lg z-10"
              style={{ maxHeight: 200 }}
            >
              {filteredData.map((item, index) => (
                <TouchableOpacity onPress={() => handleSelectItem(item)}>
                  <Text className="text-lg p-4 border-b border-gray-300">
                    {item.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
          <View className="flex px-4">
            <SearchBar
              placeholder="Tìm kiếm..."
              onChangeText={updateSearch}
              value={search}
              platform={os}
              containerStyle={{ padding: 0, margin: 0 }}
              inputContainerStyle={{
                backgroundColor: "#E5E7EB",
                borderRadius: 20,
              }}
            />
            {/* Nội dung khác trong màn hình */}
            <FlatList
              nestedScrollEnabled={true}
              showsHorizontalScrollIndicator={false}
              horizontal={true}
              data={friends}
              keyExtractor={(item) => item.userId}
              renderItem={({ item }) => (
                <UserAvatar
                  friend={item}
                  handleUserChat={() => {
                    dispath(setChatFriend(item));
                    setMessagesModalVisible(true);
                  }}
                ></UserAvatar>
              )}
            ></FlatList>
            <FlatList
              nestedScrollEnabled={true}
              showsHorizontalScrollIndicator={false}
              data={chats}
              key={(item) => item.id}
              renderItem={({ item }) => (
                <UserMessage
                  userId={user.userId}
                  item={item}
                  handleUserChat={() => {
                    dispath(setChatFriend(item.inf.response));
                    setMessagesModalVisible(true);
                  }}
                ></UserMessage>
              )}
              scrollEnabled={false}
            ></FlatList>
          </View>
        </View>
      )}
      {friend.userId && (
        <MessagesModal
          user={user}
          friend={friend}
          isVisible={messagesModalVisible}
          onClose={() => setMessagesModalVisible(false)}
        ></MessagesModal>
      )}
    </SafeAreaView>
  );
}
