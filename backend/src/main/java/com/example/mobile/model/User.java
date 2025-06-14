package com.example.mobile.model;

import java.sql.Blob;
import java.util.Collection;
import java.util.Date;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class User implements UserDetails {
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private int id;

	private String name;
	private Gender gender;
//	@Pattern(regexp = "(\\+?84|0)(3[2-9]|5[689]|7[06-9]|8[1-9]|9[0-9])[0-9]{7}", message = "Invalid phone number")
	private String phone;
	private Date birth;
	private Blob avatar;
//	@Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\\\\-={}\\\\[\\\\]|;:'\\\"<>,./?])(?=.*\\\\d).{6,}$", message = "Invalid password")
//	@Size(min = 6)
	private String password;
	@OneToMany
	private List<Comment> comments;
	@OneToMany
	@JsonManagedReference
	private List<Post> posts;
	@ElementCollection
	private List<User> friends;
	@OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
//	@JsonBackReference
	@JsonManagedReference 
	private List<FriendRequest> friendRequests;
	@OneToMany
	private List<Notification> notifications;

	private int currentNoti;

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public String getPassword() {
		// TODO Auto-generated method stub
		return password;
	}

	@Override
	public String getUsername() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public boolean isAccountNonExpired() {
		// TODO Auto-generated method stub
		return true;
	}

	@Override
	public boolean isAccountNonLocked() {
		// TODO Auto-generated method stub
		return true;
	}

	@Override
	public boolean isCredentialsNonExpired() {
		// TODO Auto-generated method stub
		return true;
	}

	@Override
	public boolean isEnabled() {
		// TODO Auto-generated method stub
		return false;
	}

	public boolean friended(int userId) {
		for (var x : getFriends()) {
			if (x.getId() == userId)
				return true;
		}
		return false;
	}

	public boolean requested(int userId) {
		for (var x : getFriendRequests()) {
			if (x.getFromUser().getId() == userId)
				return true;
		}
		return false;
	}
}
