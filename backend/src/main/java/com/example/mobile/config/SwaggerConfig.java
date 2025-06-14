package com.example.mobile.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;

@Configuration
public class SwaggerConfig {

	@Bean
	public OpenAPI customOpenAPI() {
		// Định nghĩa JWT Security Scheme
		SecurityScheme securityScheme = new SecurityScheme().type(SecurityScheme.Type.HTTP).scheme("bearer")
				.bearerFormat("JWT").name("Authorization");

		// Thêm Security Requirement
		SecurityRequirement securityRequirement = new SecurityRequirement().addList("bearerAuth");

		return new OpenAPI().components(new Components().addSecuritySchemes("bearerAuth", securityScheme))
				.addSecurityItem(securityRequirement).info(new Info().title("Spring Boot Swagger API").version("1.0.0")
						.description("API Documentation with JWT Authentication"));
	}
}