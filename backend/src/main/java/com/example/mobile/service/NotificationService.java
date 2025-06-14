package com.example.mobile.service;

import java.util.List;

import com.example.mobile.dto.RequestNotificationDTO;
import com.example.mobile.model.Notification;
import com.example.mobile.model.Post;
import com.example.mobile.model.User;

public interface NotificationService {
	public void likeNoti(Post to);

	public void commentNoti(Post post);

	public void requestAddFriend(User to);

	public void acceptionAddFriend(User to);

	public void replyNoti(Post to);

	public List<Notification> getNotis(RequestNotificationDTO dto);
}
