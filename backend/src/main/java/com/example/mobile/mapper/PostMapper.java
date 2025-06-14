package com.example.mobile.mapper;

import java.sql.Blob;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.mapstruct.factory.Mappers;

import com.example.mobile.config.ConvertFile;
import com.example.mobile.dto.CommentViewDTO;
import com.example.mobile.dto.PostViewDTO;
import com.example.mobile.model.Comment;
import com.example.mobile.model.Post;

@Mapper(componentModel = "spring")
public abstract class PostMapper {
	public static PostMapper INSTANCE = Mappers.getMapper(PostMapper.class);

	@Mapping(source = "id", target = "postId")
	@Mapping(source = "user.id", target = "userId")
	@Mapping(source = "user.avatar", target = "avatarUser", qualifiedByName = "blobToString")
	@Mapping(source = "image", target = "image", qualifiedByName = "blobToString")
	@Mapping(expression = "java(post.getLikes().size())", target = "numberLike")
	@Mapping(source = "comments", target = "numberComment" , qualifiedByName = "countComemnts")
	@Mapping(source = "createAt", target = "createAt", qualifiedByName = "dateToMillis")
	@Mapping(source = "user.name", target = "name")
	public abstract PostViewDTO entityToViewPostDTO(Post post);

	@Named("dateToMillis")
	public long dateToMillis(Date date) {
		return date.getTime();
	}

	@Named("countComemnts")
	public int countComemnts(List<Comment> comments) {
		int count = 0;
		for (var x : comments) {
			count += x.getReplys().size() + 1;
		}
		return count;
	}

	@Named("blobToString")
	public String blodToString(Blob blob) {
		return ConvertFile.toString(blob);
	}

	@Mapping(source = "id", target = "commentId")
	@Mapping(source = "user.avatar", target = "avatar", qualifiedByName = "blobToString")
	@Mapping(source = "user.name", target = "name")
	@Mapping(source = "replys", target = "replys", qualifiedByName = "toListReply")
	@Mapping(source = "createAt", target = "createAt", qualifiedByName = "dateToMillis")
	public abstract CommentViewDTO entityToCommentViewDTO(Comment comment);

	@Named("toListReply")
	public List<CommentViewDTO> entitysToListReply(List<Comment> comments) {
		List<CommentViewDTO> result = new ArrayList<>();
		for (var x : comments) {
			result.add(CommentViewDTO.builder().commentId(x.getId()).avatar(blodToString(x.getUser().getAvatar()))
					.name(x.getUser().getName()).content(x.getContent()).createAt(dateToMillis(x.getCreateAt()))
					.build());
		}
		return result;
	}
}
