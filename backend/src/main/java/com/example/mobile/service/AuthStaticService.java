package com.example.mobile.service;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.example.mobile.model.User;
import com.example.mobile.repository.UserRepository;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class AuthStaticService {
	private final UserRepository userRepository;

	public User currentUser() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		User user = (User) authentication.getPrincipal();
		return userRepository.findById(user.getId()).get();
	}
}
