package com.example.mobile.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.mobile.model.FriendRequest;

@Repository
public interface FriendRequestRepository extends JpaRepository<FriendRequest, Integer> {
	
	@Query("SELECT fr from FriendRequest fr WHERE fr.fromUser.id = :id")
	List<FriendRequest> findAllByUserId(int id);
	
}
