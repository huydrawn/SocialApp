package com.example.mobile.service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.example.mobile.config.ConvertFile;
import com.example.mobile.dto.AddPostDTO;
import com.example.mobile.model.Post;
import com.example.mobile.model.User;
import com.example.mobile.repository.PostRepository;
import com.example.mobile.repository.UserRepository;

import jakarta.transaction.Transactional;

@Service
public class PostServiceImp implements PostService {
	@Autowired
	PostRepository postRepository;

	@Autowired
	UserRepository userRepository;

	@Autowired
	AuthStaticService authStaticService;

	@Override
	@Transactional
	public void save(AddPostDTO dto) throws Exception {
		User user = authStaticService.currentUser();
		Post post = Post.builder().user(user).content(dto.getContent()).comments(new ArrayList<>())
				.likes(new ArrayList<>()).image(ConvertFile.toBlob(dto.getImage())).build();
		postRepository.save(post);
	}

	@Override
	public List<Post> get() {
		User u = authStaticService.currentUser();
		List<User> users = new ArrayList<>(u.getFriends());
		users.add(u);
		return postRepository.findFriendPosts(users);
	}
	@Override
	public List<Post> get(int page, int size) {
		User u = authStaticService.currentUser();
		List<User> users = new ArrayList<>(u.getFriends());
		users.add(u);
		return postRepository.findFriendPosts(users, PageRequest.of(page, size)).getContent();
	}

	@Override
	public List<Post> getSpecific(int userId) {
		User user = userRepository.findById(userId).get();
		return postRepository.findFriendPosts(new ArrayList<>(Arrays.asList(user)));
	}

}
