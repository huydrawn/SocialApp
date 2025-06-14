package com.example.mobile.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RegisterDTO {
	private String name;
	private String phone;
	private String gender;
	private long birth;
	private String password;
}
