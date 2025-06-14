package com.example.mobile.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import org.springframework.stereotype.Repository;

import com.example.mobile.model.Like;

@Repository
public interface LikeRepository extends JpaRepository<Like, Integer> {
	public Like findByUser_IdAndPost_Id(int userId, int postId);
}
