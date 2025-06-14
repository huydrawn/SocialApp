package com.example.mobile.config.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.servlet.PathRequest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.csrf.XorCsrfTokenRequestAttributeHandler;

import com.example.mobile.config.path.PathConfig;

@Configuration
public class SercurityConfig {
	@Autowired
	JwtFilter jwtFilter;
	@Autowired
	UserDetailService userDetailService;

	@Bean
	public PasswordEncoder setEncoder() {
		return new BCryptPasswordEncoder();
	}

	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		XorCsrfTokenRequestAttributeHandler requestHandler = new XorCsrfTokenRequestAttributeHandler();
		// set the name of the attribute the CsrfToken will be populated on
		requestHandler.setCsrfRequestAttributeName(null);
//		http.csrf(csrf -> csrf.csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
//				.csrfTokenRequestHandler(requestHandler));
		http.csrf(csrf -> csrf.disable()).cors();
		http.userDetailsService(userDetailService);
//		http.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
		http.authorizeHttpRequests(request -> request.requestMatchers(PathConfig.getPathPermitAll()).permitAll()
				.requestMatchers(HttpMethod.GET, PathConfig.getPathPermitAllForGetMethod()).permitAll()
				.requestMatchers(HttpMethod.POST , PathConfig.getPathPermitAllForPostMethod()).permitAll()
				.requestMatchers(PathRequest.toStaticResources().toString()).permitAll().anyRequest().authenticated());

		http.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
		return http.build();
	}
}
