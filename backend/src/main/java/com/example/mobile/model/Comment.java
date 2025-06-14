package com.example.mobile.model;

import java.util.Date;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
@ToString
public class Comment {
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private int id;
	private String content;
	@CreationTimestamp
	private Date createAt;
	@CreationTimestamp
	private Date updateAt;
	@ManyToOne
	private User user;
	@ManyToOne
	private Post post;
	@ElementCollection
	List<Comment> replys;

}
