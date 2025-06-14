package com.example.mobile;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.data.web.config.EnableSpringDataWebSupport;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;

@SpringBootApplication
@EnableJpaRepositories
@EnableWebSecurity
@EnableSpringDataWebSupport
public class MobileApplication {
	public static void main(String[] args) {
		SpringApplication.run(MobileApplication.class, args);
	}

}
