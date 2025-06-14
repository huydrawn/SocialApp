import {
  Platform,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Animated,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useCallback, useEffect, useRef, useState } from "react";
import * as Icon from "react-native-feather";
import Header from "../component/Header.js";
import { useDispatch } from "react-redux";
import {
  setCurrent,
  setScrollY,
  setVisiable,
} from "../slice/navigationSlice.js";
import Post from "../component/Post.js";
import { useAnimatedScrollHandler, withDecay } from "react-native-reanimated";
import { useScrollY } from "../context/ScrollContext.js";
import { callApiWithAuth } from "../service/ApiServices"; // Import API service
import { Gesture } from "react-native-gesture-handler";
import { useFocusEffect } from "@react-navigation/native";
export default function HomeSceen({ scrollY }) {
  const dispatch = useDispatch();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(0);
  useEffect(() => {
    dispatch(setCurrent("Home"));
    dispatch(setVisiable(true));
  });
  const refresh = async () => {
    setRefreshing(true);
    const response = await callApiWithAuth(`/post?page=${0}&size=3`);
    setPosts(response);
    setRefreshing(false);
  };
  useFocusEffect(
    useCallback(() => {
      dispatch(setVisiable(true)); // Chạy khi Home được focus
      return () => {
        // Cleanup logic nếu cần
      };
    }, [dispatch])
  );
  useEffect(() => {
    fetchPosts();
  }, [page]);
  const loadMorePosts = () => {
    setPage((prevPage) => prevPage + 1); // Tăng số trang
  };
  const fetchPosts = async (loadMore = true) => {
    try {
      const response = await callApiWithAuth(`/post?page=${page}&size=3`);
      setPosts((prevPosts) =>
        loadMore ? [...prevPosts, ...response] : response
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView>
      <Animated.FlatList
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refresh} />
        }
        showsVerticalScrollIndicator={false}
        data={posts}
        renderItem={({ item }) => <Post post={item} />}
        keyExtractor={(item) => item.postId}
        contentContainerStyle={[
          styles.list,
          {
            flexGrow: 1,
            justifyContent: posts.length === 0 ? "center" : "flex-start",
            paddingVertical: posts.length === 0 ? 50 : 0, // Thêm không gian cuộn
          },
        ]}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", color: "#999" }}>
            Không có bài viết nào
          </Text>
        }
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true } // Sử dụng native driver để tăng hiệu suất
        )}
        onEndReached={loadMorePosts} // Gọi khi cuộn đến cuối danh sách
        onEndReachedThreshold={0.5} // Ngưỡng cuộn (50% cuối)
        ListFooterComponent={
          loading && <ActivityIndicator size="large" color="#0000ff" />
        }
      />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {},
  header: {
    height: 60,
    backgroundColor: "#4267B2", // Màu xanh giống Facebook
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000, // Đảm bảo header nằm trên cùng
  },
  headerText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  list: {},
  postItem: {
    padding: 20,
    marginVertical: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
});
