package com.example.mobile.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.mobile.dto.FriendRequestDTO;
import com.example.mobile.dto.ResponseDTO;
import com.example.mobile.mapper.UserMapper;
import com.example.mobile.repository.UserRepository;
import com.example.mobile.service.AuthStaticService;
import com.example.mobile.service.UserService;

@RestController
@RequestMapping("/friend")
public class FriendsController {
	@Autowired
	UserService userService;
	@Autowired
	UserRepository userRepository;
	@Autowired
	AuthStaticService authStaticService;

	@GetMapping
	public ResponseEntity<?> getFriends() {
		try {
			return ResponseEntity.ok(authStaticService.currentUser().getFriends().stream()
					.map(UserMapper.INSTANCE::userEntityToDTO).toList());
		} catch (Exception e) {
			// TODO Auto-generated catch block
			System.out.println(e);
			return ResponseEntity.badRequest().body(new ResponseDTO(e.getMessage()));
		}
	}

	@GetMapping("/{userId}")
	public ResponseEntity<?> getStatusRelationship(@PathVariable("userId") int userId) {
		try {
			int statusCode = -1;
			var user = authStaticService.currentUser();
			var friends = user.getFriends();
			for (var friend : friends) {
				if (friend.getId() == userId) {
					statusCode = 0;
					break;
				}
			}
			if (statusCode == -1) {
				var friendRequests = user.getFriendRequests();
				for (var friendRequest : friendRequests) {
					if (friendRequest.getFromUser().getId() == userId) {
						statusCode = 1;
						break;
					}
				}
			}
			if (statusCode == -1) {
				var other = userRepository.findById(userId).get();
				for (var otherReceivedRequest : other.getFriendRequests()) {
					if (otherReceivedRequest.getFromUser().getId() == user.getId()) {
						statusCode = 2;
						break;
					}
				}
			}

			return ResponseEntity.ok(new ResponseDTO(statusCode + ""));
		} catch (Exception e) {

			return ResponseEntity.badRequest().body(new ResponseDTO(e.getMessage()));
		}
	}

	@GetMapping("/suggest")
	public ResponseEntity<?> getSuggestAddFriendList() {
		try {

			return ResponseEntity
					.ok(userService.getSuggestAddFriend().stream().map(UserMapper.INSTANCE::userEntityToDTO).toList());
		} catch (Exception e) {
			// TODO Auto-generated catch block
			return ResponseEntity.badRequest().body(new ResponseDTO(e.getMessage()));
		}
	}

	@PostMapping("/addfriend")
	public ResponseEntity<?> addFriend(@RequestBody FriendRequestDTO dto) {

		try {
			userService.handleFriendRequest(dto);
			return ResponseEntity.ok(new ResponseDTO("Success"));
		} catch (Exception e) {

			// TODO Auto-generated catch block
			return ResponseEntity.badRequest().body(new ResponseDTO(e.getMessage()));
		}
	}

	@PutMapping("/reject/addfriend")
	public ResponseEntity<?> rejectAddFriend(@RequestBody FriendRequestDTO dto) {

		try {
			userService.handleRejectFriendRequest(dto);
			return ResponseEntity.ok(new ResponseDTO("Success"));
		} catch (Exception e) {
			// TODO Auto-generated catch block
			return ResponseEntity.badRequest().body(new ResponseDTO(e.getMessage()));
		}
	}

	@PutMapping("/accept/addfriend")
	public ResponseEntity<?> accpetAddFriend(@RequestBody FriendRequestDTO dto) {
		try {
			userService.handleAccpetFriendRequest(dto);
			return ResponseEntity.ok(new ResponseDTO("Success"));
		} catch (Exception e) {
			// TODO Auto-generated catch block
			return ResponseEntity.badRequest().body(new ResponseDTO(e.getMessage()));
		}
	}

	@DeleteMapping("/cancel")
	public ResponseEntity<?> cancelAddFriend(@RequestBody FriendRequestDTO dto) {

		try {
			userService.handleCancelFriend(dto);
			return ResponseEntity.ok(new ResponseDTO("Success"));
		} catch (Exception e) {
			// TODO Auto-generated catch block
			return ResponseEntity.badRequest().body(new ResponseDTO(e.getMessage()));
		}
	}

	@GetMapping("/addfriend")
	public ResponseEntity<?> getAddFriends() {
		try {
			return ResponseEntity.ok(userService.getAllFriendRequest().stream()
					.map(UserMapper.INSTANCE::friendRequestEntityToDTO).toList());
		} catch (Exception e) {
			// TODO Auto-generated catch block
			return ResponseEntity.badRequest().body(new ResponseDTO(e.getMessage()));
		}
	}
}
