package com.example.mobile.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class FriendViewDTO {
	private int userId;
	private String avatar;
	private String name;
}
