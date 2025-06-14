package com.example.mobile.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.mobile.dto.ProfileDTO;
import com.example.mobile.dto.ResponseDTO;
import com.example.mobile.dto.UpdateAvatarDTO;
import com.example.mobile.mapper.UserMapper;
import com.example.mobile.repository.UserRepository;
import com.example.mobile.service.AuthStaticService;
import com.example.mobile.service.UserService;


@RestController
@RequestMapping("/profile")
public class ProfileController {
	@Autowired
	AuthStaticService authStaticService;
	@Autowired
	UserRepository userRepository;
	@Autowired
	UserService userService;

	@GetMapping
	public ResponseEntity<?> getProfile() {
		
		ProfileDTO dto = UserMapper.INSTANCE.userToProfileDTO(authStaticService.currentUser());
		if (authStaticService.currentUser().getId() == dto.getUserId()) {
			dto.setOwn(true);
		}
		return ResponseEntity.ok(dto);
	}

	@GetMapping("/{id}")

	public ResponseEntity<?> getProfileForUser(@PathVariable int id) {
		ProfileDTO dto = UserMapper.INSTANCE.userToProfileDTO(userRepository.findById(id).get());
		if (authStaticService.currentUser().getId() == dto.getUserId()) {
			dto.setOwn(true);
		}
		return ResponseEntity.ok(dto);
	}
	@PutMapping("/updateAvatar")
	public ResponseEntity<?> updateAvatar(@RequestBody UpdateAvatarDTO dto){
		try {
			
			userService.updateAvatar(dto);
			return ResponseEntity.ok(new ResponseDTO("save successfully"));
		} catch (Exception e) {
			
			e.printStackTrace();
			return ResponseEntity.badRequest().body(new ResponseDTO("save failure"));
		}
	}
}
