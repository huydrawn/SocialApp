package com.example.mobile.config.security;
// đây là các lớp sử dụng json web token (JWT) để bảo vệ các tài nguyên và xác thực người dùng
import java.io.IOException;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import com.example.mobile.config.path.PathConfig;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {

	private final JwtUtils jwtUtils;
	private final UserDetailService userDetailService;

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {

		if (PathConfig.checkPathForAuthentication(request.getServletPath(), request.getMethod())) {
			try {

				String token = getTokenFroRequest(request);

				if (StringUtils.hasText(token) && jwtUtils.valiadJwtToken(token)) {

					String phone = jwtUtils.getSubjectFromJwtToken(token);

					UserDetails userDetails = userDetailService.loadUserByPhone(phone);

					UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken = new UsernamePasswordAuthenticationToken(
							userDetails, null, userDetails.getAuthorities());
					usernamePasswordAuthenticationToken
							.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
					SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);

				}
			} catch (Exception e) {
				System.out.println(e.getMessage());
			}
		}
		filterChain.doFilter(request, response);
	}

	private String getTokenFroRequest(HttpServletRequest request) throws Exception {

		if (PathConfig.matcherConnectWebSocketPath(request.getServletPath())
				&& request.getHeader("Authorization") == null) {
			return request.getParameter("token").toString();
		}
		String bearerToken = request.getHeader("Authorization");
		if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
			return bearerToken.substring(7);
		} else {
			throw new Exception("Not Found Bearer Token in headers");
		}
	}

}
