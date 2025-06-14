package com.example.mobile.controller;

import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.mobile.dto.CommentDTO;
import com.example.mobile.dto.LikeDTO;
import com.example.mobile.dto.ResponseDTO;
import com.example.mobile.dto.UserUpdateDTO;
import com.example.mobile.mapper.UserMapper;
import com.example.mobile.repository.UserRepository;
import com.example.mobile.service.AuthStaticService;
import com.example.mobile.service.UserService;

@RestController
@RequestMapping("/user")
public class UserController {
	@Autowired
	UserService userService;
	@Autowired
	AuthStaticService authStaticService;
	@Autowired
	UserRepository userRepository;

	@GetMapping
	public ResponseEntity<?> getUserInfor() {
		try {
			return ResponseEntity.ok(UserMapper.INSTANCE.entityToUserInformationDTO(authStaticService.currentUser()));
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return ResponseEntity.badRequest().body(new ResponseDTO(e.getMessage()));
		}
	}

	@PostMapping("/like")
	public ResponseEntity<?> add(@RequestBody LikeDTO dto) {
		try {
			userService.like(dto);
			return ResponseEntity.ok(new ResponseDTO("Success"));
		} catch (Exception e) {
			// TODO Auto-generated catch block
			return ResponseEntity.badRequest().body(new ResponseDTO(e.getMessage()));
		}
	}

	@GetMapping("/inf")
	public ResponseEntity<?> getHomeIF() {
		try {
			return ResponseEntity.ok(userService.getHomeView());
		} catch (Exception e) {
			// TODO Auto-generated catch block
			return ResponseEntity.badRequest().body(new ResponseDTO(e.getMessage()));
		}
	}

	@GetMapping("/get-inf/{id}")
	public ResponseEntity<?> getIF(@PathVariable("id") int id) {
		try {
			return ResponseEntity.ok(UserMapper.INSTANCE.entityToUserInformationDTO(userRepository.findById(id).get()));
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return ResponseEntity.badRequest().body(new ResponseDTO(e.getMessage()));
		}
	}

	@PostMapping("/comment")
	public ResponseEntity<?> add(@RequestBody CommentDTO dto) {
		try {
			userService.comment(dto);
			return ResponseEntity.ok(new ResponseDTO("Success"));
		} catch (Exception e) {
			// TODO Auto-generated catch block
			return ResponseEntity.badRequest().body(new ResponseDTO(e.getMessage()));
		}
	}

	@PutMapping("/update")
	public ResponseEntity<?> add(@RequestBody UserUpdateDTO dto) {
		try {
			var user = authStaticService.currentUser();
			user.setBirth(new Date(dto.getBirth()));
			user.setName(dto.getName());
			userRepository.save(user);
			return ResponseEntity.ok(new ResponseDTO("Success"));
		} catch (Exception e) {
			// TODO Auto-generated catch block
			return ResponseEntity.badRequest().body(new ResponseDTO(e.getMessage()));
		}
	}

}
