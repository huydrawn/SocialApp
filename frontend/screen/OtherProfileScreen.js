import { SafeAreaView } from "react-native-safe-area-context";
import Navigation from "../component/Navigation.js";
import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Calendar,
  Edit3,
  Heart,
  MoreHorizontal,
  MoreVertical,
  Plus,
} from "react-native-feather";
import FriendAvatar from "../component/FriendAvatar.js";
import Post from "../component/Post.js";
import React, { useEffect, useState } from "react";
import { callApiWithAuth } from "../service/ApiServices.js";
import FriendModal from "../component/FriendModal.js";
import { setVisiable } from "../slice/navigationSlice.js";
import { formatDateFromLong } from "../untity/TimeUtility.js";
import Ionicons from "@expo/vector-icons/Ionicons";
import Entypo from "@expo/vector-icons/Entypo";
const OtherProfileScreen = React.memo(({ route, navigation }) => {
  const { profileId } = route.params;
  const [relationshipCode, setRelationshipCode] = useState(-1);
  const [pressRelationButton, setRelationshipButton] = useState(false);
  const [accept, setAccept] = useState(false);
  const [loading, setLoading] = useState(true);
  const [visibale, setVisiable] = useState(false);
  const [posts, setPosts] = useState([]);
  const [profile, setProfile] = useState({});
  const loadProfile = async () => {
    setLoading(true);
    const profile = await callApiWithAuth(`/profile/${profileId}`);
    setProfile(profile);
    setLoading(false);
  };
  const loadRelationShip = async () => {
    const status = await callApiWithAuth(`/friend/${profileId}`);
    setRelationshipCode(status.response);
  };
  const loadPosts = async () =>{
    const posts = await callApiWithAuth(`/post/get/${profileId}`);
    setPosts(posts);
  }
  const handleFriendAction = () => {
    setRelationshipButton(!pressRelationButton);
    callApiWithAuth(`/friend/cancel`, "DELETE", {
      userId: profile.userId,
    });
  };
  const handleAddFriend = () => {
    callApiWithAuth(`/friend/addfriend`, "POST", { userId: profile.userId });
    setRelationshipButton(!pressRelationButton);
  };
  const handleAcceptAction = () => {
    setAccept(true);
    callApiWithAuth(`/friend/accept/addfriend`, "PUT", {
      userId: profile.userId,
    });
    setRelationshipButton(!pressRelationButton);
  };
  const handleDenyAction = () => {
    callApiWithAuth(`/friend/reject/addfriend`, "PUT", {
      userId: profile.userId,
    });
    setRelationshipButton(!pressRelationButton);
  };

  useEffect(() => {
    loadProfile();
    loadRelationShip();
    loadPosts();
  }, []);
  if (loading)
    return <ActivityIndicator size="large" color="#0000ff"></ActivityIndicator>;
  else
    return (
      <SafeAreaView className="bg-white flex-1">
        <ScrollView showsVerticalScrollIndicator={false}>
          <View className="h-44 w-screen bg-gray-200 mb-24">
            <View className="ml-5 translate-y-20 w-32 items-center ">
              <Image
                className=" rounded-full w-32 h-32"
                source={{ uri: `data:image/png;base64,${profile.avatar}` }}
              ></Image>
              <Text className="text-2xl font-medium mt-2 justify-center">
                {profile.name}
              </Text>
            </View>
          </View>
          <View className="flex-col mx-5 gap-y-3 items-center">
            {relationshipCode == 0 &&
              (!pressRelationButton ? (
                <TouchableOpacity
                  onPress={handleFriendAction}
                  className="flex-row items-center justify-center gap-x-2 w-full bg-blue-700 py-2 rounded-md"
                >
                  <Ionicons name="person-add" size={18} color="white" />
                  <Text className="text-white">Bạn bè</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity className="flex-row items-center justify-center gap-x-2 w-full bg-gray-500 py-2 rounded-md">
                  <Ionicons name="person-remove" size={18} color="white" />
                  <Text className="text-white">Đã hủy kết bạn</Text>
                </TouchableOpacity>
              ))}
            {relationshipCode == 1 &&
              (!pressRelationButton ? (
                <View className="w-full gap-y-1">
                  <TouchableOpacity
                    onPress={handleAcceptAction}
                    className="flex-row items-center justify-center gap-x-2 w-full bg-blue-700 py-2 rounded-md"
                  >
                    <Plus name="person-add-outline" size={18} color="white" />
                    <Text className="text-white">Chấp nhận kết bạn</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleDenyAction}
                    className="flex-row items-center justify-center gap-x-2 w-full bg-gray-300 py-2 rounded-md"
                  >
                    <Entypo name="remove-user" size={18} color="black" />
                    <Text className="text-white">Từ chối kết bạn</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View className="flex-row items-center justify-center gap-x-2 w-full bg-gray-500 py-2 rounded-md">
                  <Plus
                    name="checkmark-circle-outline"
                    size={18}
                    color="white"
                  />
                  <Text className="text-white">
                    {accept ? "Đã chấp nhận kết bạn" : "Đã từ chối kết bạn"}
                  </Text>
                </View>
              ))}
            {relationshipCode == 2 && (
              <TouchableOpacity className="flex-row items-center justify-center gap-x-2 w-full bg-blue-700 py-2 rounded-md">
                <Ionicons name="person-add" size={18} color="white" />
                <Text className="text-white">Đã gửi lời mời kết bạn</Text>
              </TouchableOpacity>
            )}
            {relationshipCode == -1 &&
              (!pressRelationButton ? (
                <TouchableOpacity
                  onPress={handleAddFriend}
                  className="flex-row items-center justify-center gap-x-2 w-full bg-blue-700 py-2 rounded-md"
                >
                  <Plus name="person-add-outline" size={18} color="white" />
                  <Text className="text-white">Thêm bạn bè</Text>
                </TouchableOpacity>
              ) : (
                <View className="flex-row items-center justify-center gap-x-2 w-full bg-gray-500 py-2 rounded-md">
                  <Plus
                    name="checkmark-circle-outline"
                    size={18}
                    color="white"
                  />
                  <Text className="text-white">Đã thêm bạn bè</Text>
                </View>
              ))}
          </View>
          <View className="mt-4 flex-col border-t border-gray-200 pl-5 ">
            <Text className="text-xl  font-semibold my-3">Chi tiết</Text>
            <View className="flex-row items-center gap-x-3  mt-2">
              <Calendar
                width={20}
                height={20}
                fill={"gray"}
                color={"gray"}
              ></Calendar>
              <Text className="text-base font-medium">
                Ngày sinh: {formatDateFromLong(profile.birth)}
              </Text>
            </View>
            <View className="flex-row items-center gap-x-3  mt-2">
              <Heart
                width={20}
                height={20}
                color={"gray"}
                fill={"gray"}
              ></Heart>
              <Text className="text-base font-medium">Độc thân</Text>
            </View>
            <View className="flex-row items-center gap-x-3  mt-2">
              <MoreHorizontal
                width={20}
                height={20}
                color={"gray"}
                fill={"gray"}
              ></MoreHorizontal>
              <Text className="text-base font-medium">
                Xem thêm thông tin giới thiệu
              </Text>
            </View>
          </View>
          <Text className="ml-2 font-bold mt-5">
            {profile.friends.length} bạn bè
          </Text>
          <View className="py-4 pl-2">
            <View className="justify-start flex-wrap flex-row mb-3  ">
              {profile.friends
                .slice(0, Math.min(5, profile.friends.length))
                .map((item, index) => {
                  return (
                    <View className="w-1/3">
                      <FriendAvatar friend={item}></FriendAvatar>
                    </View>
                  );
                })}
            </View>
          </View>
          <TouchableOpacity
            onPress={() => setVisiable(true)}
            className="flex-row items-center justify-center bg-gray-200 mx-3 py-2 rounded-md"
          >
            <Text className="text-black">Xem tất cả bạn bè</Text>
          </TouchableOpacity>
          <View className="flex-row border-t-8 border-b border-gray-200 mt-6 pb-2">
            <Text className="text-blue-700 p-3 bg-blue-50 rounded-2xl ml-5 mt-2">
              Bài viết
            </Text>
          </View>
          <FlatList
            data={posts}
            showsVerticalScrollIndicator={false}
            keyExtractor={({ item }) => item.postId}
            renderItem={({ item }) => <Post post={item}></Post>}
            scrollEnabled={false}
          ></FlatList>
        </ScrollView>
        <FriendModal
          isVisible={visibale}
          onClose={() => setVisiable(false)}
          friends={profile.friends}
        ></FriendModal>
      </SafeAreaView>
    );
});
export default OtherProfileScreen;
