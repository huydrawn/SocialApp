package com.example.mobile.dto;

import lombok.Data;

@Data
public class PostViewDTO {
	private int userId;
	private int postId;
	private String name;
	private String avatarUser;
	private String image;
	private String content;
	// thuộc tính này thể hiện người dùng đã like hay chưa like cái Post này hay không
	private boolean isLiked;
	private int numberLike;
	private int numberComment;
	private long createAt;
}
