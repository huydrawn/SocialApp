package com.example.mobile.model;

import java.util.Date;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Notification {
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private int id;
	private String content;
	@ManyToOne(cascade = { CascadeType.DETACH, CascadeType.PERSIST, CascadeType.REFRESH})
	private User trigger;
	@ManyToOne(cascade = { CascadeType.DETACH, CascadeType.PERSIST, CascadeType.REFRESH })
	private Post post;
	@CreationTimestamp
	private Date createAt;
	@Enumerated
	private NotificationType type;

}
