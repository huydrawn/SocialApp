import { useNavigation } from "@react-navigation/native";
import { useEffect, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Image, Text, View } from "react-native";
import { Camera, ChevronLeft } from "react-native-feather";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { setVisiable } from "../slice/navigationSlice";
import { Image as FeatherImage } from "react-native-feather";
import * as ImagePicker from "expo-image-picker";
import { callApiWithAuth } from "../service/ApiServices";
import { userIf } from "../slice/userSlice";

export default function CreatePost() {
  const inputRef = useRef(null);
  const dispath = useDispatch();
  const navigation = useNavigation();
  const [selectedImage, setSelectedImage] = useState(null);
  const [content, setContent] = useState("");
  const user = useSelector(userIf);

  useEffect(() => {
    (async () => {
      // Yêu cầu quyền truy cập vào thư viện ảnh
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission needed",
          "This app needs access to your photo library"
        );
      }
    })();
  }, []);

  const openImagePicker = async () => {
    // Mở trình chọn ảnh
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    } else {
      console.log("User cancelled image picker");
    }
  };

  const takePicture = async () => {
    // Yêu cầu quyền truy cập vào camera
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed", "This app needs access to your camera");
      return;
    }

    // Mở camera để chụp ảnh
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    } else {
      console.log("User cancelled camera");
    }
  };

  // Sử dụng useEffect để focus TextInput khi component được mount

  const finish = () => {
    dispath(setVisiable(true));
    navigation.goBack();
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus(); // Focus vào TextInput
    }
  }, []);
  const uploadPost = async () => {
    if (!content.trim()) {
      Alert.alert("Error", "Please enter content for the post.");
      return;
    }

    try {
      let base64Image = null;

      if (selectedImage) {
        const response = await fetch(selectedImage);
        const blob = await response.blob();
        base64Image = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result.split(",")[1]);
          reader.readAsDataURL(blob);
        });
      }
      const postData = {
        content,
        image: base64Image,
      };
      await callApiWithAuth("/post", "POST", postData);
      navigation.navigate('Home');
      Alert.alert("Success", "Post created successfully!");
    } catch (error) {
      Alert.alert("Error", "Failed to create post. Please try again.");
    }
  };
  return (
    <SafeAreaView className="bg-white flex-1 relative">
      <View className="flex-row justify-between p-3 items-center border-b border-gray-300">
        <View className="flex-row items-center">
          <ChevronLeft
            onPress={finish}
            width={30}
            height={30}
            color={"black"}
          ></ChevronLeft>
          <Text className="text-lg font-medium">Tạo bài viết</Text>
        </View>
        <TouchableOpacity onPress={uploadPost}> 
          <Text className="text-blue-700 font-medium">Tạo</Text>
        </TouchableOpacity>
      </View>
      <View className="flex-row gap-x-3  p-3">
        <Image
          className="w-14 h-14 rounded-full"
          source={{ uri: `data:image/png;base64,${user.avatar}` }}
        />
        <View className="grow flex-col">
          <Text className="text-xl font-bold">{user.name}</Text>
        </View>
      </View>
      <TextInput
        ref={inputRef}
        focusable={true}
        className="mx-3 text-3xl"
        placeholder="Bạn đang nghĩ gì?"
        onChangeText={setContent}
      ></TextInput>

      {selectedImage && (
        <Image source={{ uri: selectedImage }} className="w-screen h-64 mt-5" />
      )}
      <View className="absolute bottom-0 left-0 right-0 p-4 flex-row justify-between">
        <TouchableOpacity onPress={openImagePicker}>
          <View className="flex-row items-center gap-x-2">
            <FeatherImage width={25} height={25} color="green"></FeatherImage>
            <Text className="font-bold text-green-600">Ảnh</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={takePicture}>
          <View className="flex-row items-center gap-x-2">
            <Text className="font-bold">Camera</Text>
            <Camera width={25} height={25} color="black"></Camera>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
