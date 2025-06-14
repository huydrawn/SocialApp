package com.example.mobile.service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.Iterator;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.mobile.config.CommonRegex;
import com.example.mobile.config.ConvertFile;
import com.example.mobile.config.DefaultSource;
import com.example.mobile.config.security.JwtUtils;
import com.example.mobile.dto.CommentDTO;
import com.example.mobile.dto.FriendRequestDTO;
import com.example.mobile.dto.HomeViewDTO;
import com.example.mobile.dto.LikeDTO;
import com.example.mobile.dto.LoginDTO;
import com.example.mobile.dto.RegisterDTO;
import com.example.mobile.dto.ReplyCommentDTO;
import com.example.mobile.dto.UpdateAvatarDTO;
import com.example.mobile.model.Comment;
import com.example.mobile.model.FriendRequest;
import com.example.mobile.model.Gender;
import com.example.mobile.model.Like;
import com.example.mobile.model.Post;
import com.example.mobile.model.User;
import com.example.mobile.repository.CommentRepository;
import com.example.mobile.repository.FriendRequestRepository;
import com.example.mobile.repository.LikeRepository;
import com.example.mobile.repository.PostRepository;
import com.example.mobile.repository.UserRepository;

import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;

@Service
public class UserServiceImp implements UserService {
	@Autowired
	PasswordEncoder passwordEncoder;
	@Autowired
	UserRepository userRepository;
	@Autowired
	PostRepository postRepository;
	@Autowired
	AuthStaticService authStaticService;
	@Autowired
	NotificationService notificationService;
	@Autowired
	LikeRepository likeRepository;
	@Autowired
	FriendRequestRepository friendRequestRepository;
	@Autowired
	CommentRepository commentRepository;
	@Autowired
	EntityManager entityManager;
	@Autowired
	JwtUtils jwtUtils;

	@Override
	public void register(RegisterDTO dto) throws Exception {
		if (userRepository.findByPhone(dto.getPhone()) != null)
			throw new Exception("Phone exist");
		if (!CommonRegex.isValidNumberPhone(dto.getPhone())) {
			throw new Exception("Phone's Format is incorrect");
		}
		if (!CommonRegex.isValidPassword(dto.getPassword())) {
			throw new Exception("Password's Format is incorrect");
		}
		Gender gender = Gender.valueOf(dto.getGender());
		if (gender == null)
			throw new Exception("InValid Gender");
		User u = User.builder().phone(dto.getPhone()).name(dto.getName())
				.password(passwordEncoder.encode(dto.getPassword())).comments(new ArrayList<>())
				.posts(new ArrayList<>()).gender(gender).birth(new Date(dto.getBirth()))
				.avatar(ConvertFile.toBlob(DefaultSource.DEFAULT_AVATAR_MALE)).build();

		userRepository.save(u);
	}

	@Override
	public String login(LoginDTO loginDTO) throws Exception {
		User user = userRepository.findByPhone(loginDTO.phone);
		if (user == null)
			throw new Exception("Phone number is not exit");

		if (passwordEncoder.matches(loginDTO.password, user.getPassword())) {
			return jwtUtils.gennerateJwtToken(loginDTO.phone);
		} else {
			throw new Exception("Password incorrect");
		}
	}

	@Override
	public void like(LikeDTO dto) throws Exception {
		User u = authStaticService.currentUser();
		Post post = postRepository.findById(dto.getPostId()).orElseThrow();
		Like like = likeRepository.findByUser_IdAndPost_Id(u.getId(), dto.getPostId());
		if (like != null) {
			Iterator<Like> it = post.getLikes().iterator();
			while (it.hasNext()) {
				if (it.next().getId() == like.getId())
					it.remove();
			}
			postRepository.save(post);
			likeRepository.delete(like);
		} else {
			User user = authStaticService.currentUser();
			like = Like.builder().user(user).post(post).createAt(new Date()).build();
			post.getLikes().add(like);
			notificationService.likeNoti(post);
			postRepository.save(post);
		}
	}

	@Override
	public Comment comment(CommentDTO dto) throws Exception {
		User user = authStaticService.currentUser();
		Post post = postRepository.findById(dto.getPostId()).orElseThrow();
		notificationService.commentNoti(post);
		Comment comment = Comment.builder().user(user).replys(new ArrayList<>()).post(post).content(dto.getContent())
				.updateAt(new Date()).createAt(new Date()).build();
		post.getComments().add(comment);
		return commentRepository.save(comment);
	}

//	@Override
//	public void update(UserUpdateDTO dto) throws Exception {
//		
//	}

	@Override
	public List<User> findAllAcceptFriend() {
		return userRepository.findAllExcludeFriend(Arrays.asList(authStaticService.currentUser()));
	}

	@Override
	@Transactional
	public void handleFriendRequest(FriendRequestDTO dto) throws Exception {
		User current = authStaticService.currentUser();
		Optional<User> toUser = userRepository.findById(dto.getUserId());
		if (toUser.isPresent()) {

			if (toUser.get().friended(current.getId())) {
				throw new Exception("To User is your friend");
			}
			if (toUser.get().requested(current.getId())) {
				throw new Exception("Requested to this user");
			}
			var friendRequest = FriendRequest.builder().fromUser(current).createAt(new Date()).build();
			toUser.get().getFriendRequests().add(friendRequest);
			notificationService.requestAddFriend(toUser.get());
			userRepository.save(toUser.get());
		} else {
			throw new Exception("To User is not present");
		}
	}

	@Override
	public List<FriendRequest> getAllFriendRequest() throws Exception {

		return authStaticService.currentUser().getFriendRequests();
	}

	@Override
	@Transactional
	public void handleAccpetFriendRequest(FriendRequestDTO dto) throws Exception {
		User user = authStaticService.currentUser();

		List<FriendRequest> friendRequests = user.getFriendRequests();
		Iterator<FriendRequest> it = friendRequests.iterator();
		User accept = null;
		try {
			while (it.hasNext()) {
				FriendRequest friendRequest = it.next();
				accept = userRepository.findById(friendRequest.getFromUser().getId()).get();
				if (accept.getId() == dto.getUserId()) {
					user.getFriends().add(accept);
					accept.getFriends().add(user);
					it.remove();
					userRepository.save(user);
					notificationService.acceptionAddFriend(accept);
					friendRequestRepository.deleteById(friendRequest.getId());
					return;

				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		throw new Exception("Invalid userId");
	}

	@Override
	public void handleRejectFriendRequest(FriendRequestDTO dto) throws Exception {
		User user = authStaticService.currentUser();
		List<FriendRequest> friendRequests = user.getFriendRequests();
		Iterator<FriendRequest> it = friendRequests.iterator();
		FriendRequest reject = null;
		while (it.hasNext()) {
			reject = it.next();
			if (reject.getFromUser().getId() == dto.getUserId()) {
				it.remove();
				userRepository.save(user);
				return;
			}
		}
		throw new Exception("Don't have request for this user");
	}

	@Override
	public List<User> getSuggestAddFriend() {
		try {

			User current = authStaticService.currentUser();

			List<User> exclude = new ArrayList<>(current.getFriends());
			current.getFriendRequests().forEach(n -> exclude.add(n.getFromUser()));
			exclude.add(current);

			List<User> result = userRepository.findAllExcludeFriend(exclude);

			List<FriendRequest> requesteds = friendRequestRepository.findAllByUserId(current.getId());
			List<User> haveRequested = userRepository.findByFriendRequestsIn(requesteds);
			for (var requested : haveRequested) {
				result.removeIf(n -> n.getId() == requested.getId());
			}
			return result;
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}

	}

	@Override
	public void handleCancelFriend(FriendRequestDTO dto) throws Exception {
		
		User current = authStaticService.currentUser();
		try {

			if (current.friended(dto.getUserId())) {
				User cancelFriend = userRepository.findById(dto.getUserId()).get();

				Iterator<User> friendOfCurrentUser = current.getFriends().iterator();
				Iterator<User> friendOfCancelUser = cancelFriend.getFriends().iterator();

				while (friendOfCancelUser.hasNext()) {
					if (friendOfCancelUser.next().getId() == current.getId()) {
						friendOfCancelUser.remove();
						break;
					}
				}
				while (friendOfCurrentUser.hasNext()) {
					if (friendOfCurrentUser.next().getId() == cancelFriend.getId()) {
						friendOfCurrentUser.remove();
						break;
					}
				}
				userRepository.save(current);
				return;
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		throw new Exception("Invalid userId");
	}

	@Override
	public void updateAvatar(UpdateAvatarDTO dto) throws Exception {
		User user = authStaticService.currentUser();
		user.setAvatar(ConvertFile.toBlob(dto.getAvatar()));
		userRepository.save(user);
	}

	@Override
	public HomeViewDTO getHomeView() {
		User u = authStaticService.currentUser();

		return HomeViewDTO.builder().numberAddFriend(u.getFriendRequests().size())
				.numberNoti(u.getNotifications().size() - u.getCurrentNoti()).build();
	}

	@Override
	public Comment replyComment(ReplyCommentDTO dto) {
		User curr = authStaticService.currentUser();
		Comment comment = Comment.builder().user(curr).replys(new ArrayList<>()).content(dto.getContent()).build();
		Comment addTo = commentRepository.findById(dto.getCommentId()).get();
		addTo.getReplys().add(comment);
		var commentIsSaved = commentRepository.save(comment);
		commentRepository.save(addTo);
		notificationService.replyNoti(addTo.getPost());
		return commentIsSaved;
	}

	@Override
	public List<Comment> getComments(int postId) {
		return postRepository.findById(postId).get().getComments();
	}

}
