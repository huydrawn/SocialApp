import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
  Animated,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { ChevronRight, Send, ThumbsUp } from "react-native-feather";
import Modal from "react-native-modal";
import LikeButton from "./LikeButton";
import Comments from "./Comments";
import { callApiWithAuth } from "../service/ApiServices";

function CommentModal({ isVisible, onClose, post, liked, setLiked }) {
  const [allowSwipe, setAllowSwipe] = useState(true);
  const [commentText, setCommentText] = useState(null);
  const [commentIdReply, setComentIdReply] = useState(null);
  const [comments, setComments] = useState([]);
  const [loadSending, setLoadSending] = useState(false);
  const inputRef = useRef(null);

  const addReplyToComment = (commentId, newReply) => {
    setComments((prevComments) => {
      return prevComments.map((comment) => {
        if (comment.commentId == commentId) {
          return {
            ...comment,
            replys: Array.isArray(comment.replys)
              ? [...comment.replys, newReply]
              : [newReply], // Nếu `replies` không phải mảng, khởi tạo nó
          };
        }
        return comment;
      });
    });
  };

  const handleCommentSubmit = async () => {
    setLoadSending(true);
    if (commentText) {
      if (commentIdReply) {
        response = await callApiWithAuth("/post/reply", "POST", {
          commentId: commentIdReply, // Giá trị postId của bạn
          content: commentText + "", // Nội dung bình luận
        });
        addReplyToComment(commentIdReply, response);
        setComentIdReply(null);
      } else {
        response = await callApiWithAuth("/post/comment", "POST", {
          postId: post.postId, // Giá trị postId của bạn
          content: commentText + "", // Nội dung bình luận
        });
        setComments((pre) => [response, ...pre]);
      }
      setCommentText(null);
      inputRef.current.clear();
      setLoadSending(false);
    }
  };

  return (
    <Modal
      className="h-screen w-screen m-0"
      customBackdrop={<View style={{ flex: 1 }} />}
      onSwipeComplete={onClose}
      swipeDirection={allowSwipe ? "down" : []} // Tắt swipe khi cuộn
      propagateSwipe
      isVisible={isVisible}
    >
      <View className="bg-white flex-1 ">
        <View className="flex-col">
          <View className="flex-row justify-between mx-3 mt-4">
            <View className="flex-row gap-x-2 items-center">
              <ThumbsUp color={"blue"} fill={"blue"} width={20} height={20} />
              <Text className="text-xl font-bold">{post.numberLike}</Text>
              <ChevronRight
                color={"black"}
                width={20}
                height={20}
              ></ChevronRight>
            </View>
            <View>
              <LikeButton
                postId={post.postId}
                liked={liked}
                setLiked={setLiked}
              ></LikeButton>
            </View>
          </View>
          <Pressable>
            <Comments
              post={post}
              inputRef={inputRef}
              comments={comments}
              setComments={setComments}
              setCommentText={setCommentText}
              setComentIdReply={setComentIdReply}
            ></Comments>
          </Pressable>
          <View className="absolute bottom-10  w-full  bg-white">
            <View className="flex-row mb-3">
              <TextInput
                ref={inputRef}
                onChangeText={setCommentText}
                className="grow h-10 bg-gray-100  rounded-2xl ml-3 px-2"
                placeholder="Enter your comment..."
              />
              {!loadSending ? (
                <TouchableOpacity onPress={handleCommentSubmit}>
                  <View className="flex items-center justify-center p-2">
                    <Send width={25} height={25} color={"gray"}></Send>
                  </View>
                </TouchableOpacity>
              ) : (
                <ActivityIndicator
                  size="small"
                  color="gray"
                ></ActivityIndicator>
              )}
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default CommentModal;
