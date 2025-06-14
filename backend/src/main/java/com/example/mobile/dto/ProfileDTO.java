package com.example.mobile.dto;

import java.util.List;

import lombok.Data;

@Data
public class ProfileDTO {
	private int userId; // userID
	private String name;
	private long birth;
	private String avatar;
	private boolean own;
	private List<FriendViewDTO> friends;
}
