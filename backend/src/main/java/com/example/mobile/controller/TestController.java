package com.example.mobile.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.mobile.dto.ResponseDTO;

@RestController
@RequestMapping("/test")
public class TestController {
	@GetMapping
	public ResponseEntity<ResponseDTO> test(){
		return ResponseEntity.ok(new ResponseDTO("Successful"));
	}
}
