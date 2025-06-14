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
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { useDispatch, useSelector } from "react-redux";
import { getProfile, setProfile, updateAvatar } from "../slice/userSlice.js";

const SelfProfileScreen = React.memo(() => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const profile = useSelector(getProfile)
  const [loading, setLoading] = useState(true);
  const [visibale, setVisiable] = useState(false);
  const [posts, setPosts] = useState([]);
  // const [profile, setProfile] = useState({});
  const loadProfile = async () => {
    setLoading(true);
    const response = await callApiWithAuth(`/profile`);
    dispatch(setProfile(response))
    setLoading(false);
    const posts = await callApiWithAuth(`/post/get/${response.userId}`);
    setPosts(posts);
  };
  const goToOtherProfile = (id) => {
    navigation.navigate("OtherProfile", { profileId: id });
  };
  const handleAvatarPress = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1], // Định dạng hình vuông để dễ chuyển sang hình tròn
        quality: 1,
        base64: true,
      });

      if (!result.canceled) {
        const base64Image = result.assets[0].base64; // Lấy chuỗi Base64
        dispatch(updateAvatar(base64Image));
        setProfile((pre) => ({ ...pre, avatar: base64Image }));
        callApiWithAuth("/profile/updateAvatar", "PUT", {
          avatar: base64Image,
        });
      } else {
        console.log("User cancelled image picker");
      }
    } catch (error) {
      console.error("Error picking image:", error);
    }
  };
  useEffect(() => {
    loadProfile();
  }, []);
  if (loading)
    return <ActivityIndicator size="large" color="#0000ff"></ActivityIndicator>;
  else
    return (
      <SafeAreaView className="bg-white flex-1">
        <ScrollView showsVerticalScrollIndicator={false}>
          <View className="h-44 w-screen bg-gray-200 mb-24">
            <View className="ml-5 translate-y-20 w-32 items-center ">
              <TouchableOpacity onPress={() => handleAvatarPress()}>
                <Image
                  className=" rounded-full w-32 h-32"
                  source={{ uri: `data:image/png;base64,${profile.avatar}` }}
                ></Image>
              </TouchableOpacity>
              <Text className="text-2xl font-medium mt-2 justify-center">
                {profile.name}
              </Text>
            </View>
          </View>
          <View className="flex-col mx-5 gap-y-3 items-center">
            <TouchableOpacity
              onPress={() => navigation.navigate("CreatePost")}
              className="flex-row items-center justify-center gap-x-2 w-full bg-blue-700 py-2 rounded-md"
            >
              <Plus width={18} height={18} color="white"></Plus>
              <Text className="text-white">Tạo bài viết</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("EditProfile", { profile: profile })
              }
              className="flex-row items-center justify-center gap-x-2 w-full bg-gray-300 py-2 rounded-md"
            >
              <Edit3
                width={18}
                height={18}
                color="black"
                fill={"black"}
              ></Edit3>
              <Text className="text-black">Chỉnh sửa trang cá nhân</Text>
            </TouchableOpacity>
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
                    <TouchableOpacity
                      onPress={() => goToOtherProfile(item.userId)}
                    >
                      <View className="w-1/3">
                        <FriendAvatar friend={item}></FriendAvatar>
                      </View>
                    </TouchableOpacity>
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
            keyExtractor={(item) => item.postId}
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
export default SelfProfileScreen;
