package com.example.mobile.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import org.springframework.stereotype.Repository;

import com.example.mobile.model.Comment;
import com.example.mobile.model.User;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Integer> {

}
