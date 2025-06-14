package com.example.mobile.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.mobile.dto.AddPostDTO;
import com.example.mobile.dto.CommentDTO;
import com.example.mobile.dto.LikeDTO;
import com.example.mobile.dto.PostViewDTO;
import com.example.mobile.dto.ReplyCommentDTO;
import com.example.mobile.dto.ResponseDTO;
import com.example.mobile.mapper.PostMapper;
import com.example.mobile.model.Comment;
import com.example.mobile.model.Post;
import com.example.mobile.model.User;
import com.example.mobile.repository.UserRepository;
import com.example.mobile.service.AuthStaticService;
import com.example.mobile.service.PostService;
import com.example.mobile.service.UserService;

@RestController
@RequestMapping("/post")
public class PostController {
	@Autowired
	PostService postService;
	@Autowired
	UserService userService;
	@Autowired
	UserRepository userRepository;
	@Autowired
	AuthStaticService authStaticService;

	@PostMapping
	public ResponseEntity<?> create(@RequestBody AddPostDTO dto) {
		try {
			postService.save(dto);
			return ResponseEntity.ok(new ResponseDTO("Success"));
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return ResponseEntity.badRequest().body(new ResponseDTO("Failure"));
		}

	}

	@GetMapping
	public ResponseEntity<?> get(@RequestParam int page, @RequestParam int size) {
		try {
			User curr = authStaticService.currentUser();
			List<Post> posts = null;
			if (size != 0)
				posts = postService.get(page, size);
			else
				posts = postService.get();
			List<PostViewDTO> result = posts.stream().map(PostMapper.INSTANCE::entityToViewPostDTO).toList();
			for (int i = 0; i < posts.size(); i++) {
				for (var x : posts.get(i).getLikes()) {
					if (x.getUser().getId() == curr.getId()) {
						result.get(i).setLiked(true);
					}
				}
			}
			return ResponseEntity.ok(result);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body(new ResponseDTO("Failure"));
		}
	}

	@GetMapping("/get/{id}")
	public ResponseEntity<?> getSpecificPost(@PathVariable("id") int userId) {

		try {
			User curr = userRepository.findById(userId).get();
			List<Post> posts = postService.getSpecific(userId);
			List<PostViewDTO> result = posts.stream().map(PostMapper.INSTANCE::entityToViewPostDTO).toList();
			for (int i = 0; i < posts.size(); i++) {
				for (var x : posts.get(i).getLikes()) {
					if (x.getUser().getId() == curr.getId()) {
						result.get(i).setLiked(true);
					}
				}
			}
			return ResponseEntity.ok(result);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body(new ResponseDTO("Failure"));
		}
	}

	@PostMapping("/like")
	public ResponseEntity<?> like(@RequestBody LikeDTO dto) {
		try {
			userService.like(dto);
			return ResponseEntity.ok(new ResponseDTO("Success"));
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body(new ResponseDTO("Failure"));
		}
	}

	@PostMapping("/comment")
	public ResponseEntity<?> comment(@RequestBody CommentDTO dto) {
		try {
			Comment comment = userService.comment(dto);
			var response = PostMapper.INSTANCE.entityToCommentViewDTO(comment);
			return ResponseEntity.ok(response);
		} catch (Exception e) {
			e.printStackTrace();
			// TODO Auto-generated catch block
			return ResponseEntity.badRequest().body(new ResponseDTO("Failure"));
		}
	}

	@PostMapping("/reply")
	public ResponseEntity<?> comment(@RequestBody ReplyCommentDTO dto) {
		try {
			var comment = userService.replyComment(dto);
			return ResponseEntity.ok(PostMapper.INSTANCE.entityToCommentViewDTO(comment));
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return ResponseEntity.badRequest().body(new ResponseDTO("Failure"));
		}
	}

// đây là phương thức getComment
	@GetMapping("/comment/{postId}")
	public ResponseEntity<?> getComments(@PathVariable int postId) {
		try {
			return ResponseEntity
					// lấy được các thực thể comment xong sẽ ánh xạ nó qua dto để trả về danh sách
					// các DTO
					.ok(userService.getComments(postId).stream().map(PostMapper.INSTANCE::entityToCommentViewDTO));
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return ResponseEntity.badRequest().body(new ResponseDTO("Failure"));
		}
	}
}
