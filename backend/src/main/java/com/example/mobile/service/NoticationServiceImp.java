package com.example.mobile.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.example.mobile.dto.RequestNotificationDTO;
import com.example.mobile.model.Notification;
import com.example.mobile.model.NotificationType;
import com.example.mobile.model.Post;
import com.example.mobile.model.User;
import com.example.mobile.repository.NotificationRepository;
import com.example.mobile.repository.UserRepository;

import lombok.AllArgsConstructor;
// triển khai api nội bộ để rest có thể gọi
@Service
@AllArgsConstructor
public class NoticationServiceImp implements NotificationService {
	private final NotificationRepository notificationRepository;
	private final UserRepository userRepository;
	private AuthStaticService authStaticService;

	@Override
	public void likeNoti(Post to) {
		User currUser = authStaticService.currentUser();
		Notification notification = Notification.builder().type(NotificationType.LIKE_POST).trigger(currUser)
				.content("Đã thích bài viết của bạn").post(to).build();
		to.getUser().getNotifications().add(notification);
		notificationRepository.save(notification); 
		userRepository.save(to.getUser());
	}
	
	@Override
	public void replyNoti(Post to) {
		User currUser = authStaticService.currentUser();
		Notification notification = Notification.builder().type(NotificationType.LIKE_POST).trigger(currUser)
				.content("Đã phản hồi bình luận của bạn").post(to).build();
		to.getUser().getNotifications().add(notification);
		notificationRepository.save(notification); 
		userRepository.save(to.getUser());
	}
	
	@Override
	public void commentNoti(Post to) {
		User currUser = authStaticService.currentUser();
		Notification notification = Notification.builder().type(NotificationType.COMMENT_POST).trigger(currUser)
				.content("Đã bình luận bài viết của bạn").post(to).build();
		to.getUser().getNotifications().add(notification);
		notificationRepository.save(notification);
		userRepository.save(to.getUser());
	}

	@Override
	public void requestAddFriend(User to) {
		User currUser = authStaticService.currentUser();
		Notification notification = Notification.builder().type(NotificationType.REQUEST_ADD_FRIEND).trigger(currUser)
				.content("Đã gửi yêu cầu kết bạn").build();
		to.getNotifications().add(notification);
		notificationRepository.save(notification);
		userRepository.save(to);
	}

	@Override
	public void acceptionAddFriend(User to) {
		User currUser = authStaticService.currentUser();
		Notification notification = Notification.builder().type(NotificationType.ACCEPT_ADD_FRIEND).trigger(currUser)
				.content("Đã chấp nhận lời mời kết bạn").build();
		to.getNotifications().add(notification);
		notificationRepository.save(notification);
		userRepository.save(to);
	}

	@Override
	public List<Notification> getNotis(RequestNotificationDTO dto) {
		// TODO Auto-generated method stub

		User curr = authStaticService.currentUser();
		List<Notification> notifications = authStaticService.currentUser().getNotifications();
		curr.setCurrentNoti(curr.getNotifications().size());
		userRepository.save(curr);
		if (dto.getNext() * 10 >= notifications.size())
			return null;
		return authStaticService.currentUser().getNotifications().subList(dto.getNext() * 10,
				Math.min(dto.getNext() * 10 + 10, notifications.size()));

	}

}
