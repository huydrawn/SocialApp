package com.example.mobile.model;

import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity(name = "t_like")
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class Like {
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private int id;
	private Date createAt;
	@JsonBackReference
	@ManyToOne(cascade = { CascadeType.DETACH, CascadeType.MERGE, CascadeType.PERSIST, CascadeType.REFRESH })
	private User user;
	@ManyToOne
	private Post post;
}
