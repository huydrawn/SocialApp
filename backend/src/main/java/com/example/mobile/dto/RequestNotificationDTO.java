package com.example.mobile.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;

import lombok.Data;

import java.util.HashMap;
import java.util.Map;

@Data
@JsonInclude(value = Include.NON_NULL)
public class RequestNotificationDTO {
	//đây là số lượng thông báo cần đc lấy cho mỗi trang
	private int next;

}
