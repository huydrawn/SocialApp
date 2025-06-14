package com.example.mobile.config.security;
import java.util.Date;

import org.springframework.stereotype.Service;

import com.example.mobile.config.exception.JwtTokenException;
import com.example.mobile.config.exception.JwtTokenMaformedException;
import com.example.mobile.config.exception.JwtTokenMissingException;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.SignatureException;
import io.jsonwebtoken.UnsupportedJwtException;




@Service
public class JwtUtils {
	private final String secret = "35763238948271910447123hasodoawoa8792F423F4428472B4B6250655368566D597133743677397A2443264629";
	private final int jwtExpirationMs = 36000000;

	public String gennerateJwtToken(String phone) {
		return Jwts.builder().setSubject(phone).setIssuedAt(new Date())
				.setExpiration(new Date((new Date()).getTime() + jwtExpirationMs))
				.signWith(SignatureAlgorithm.HS512, secret).compact();
	}
	 public String generateRefreshToken(String phone) {
	        return Jwts.builder()
	                .setSubject(phone)
	                .setIssuedAt(new Date())
	                .setExpiration(new Date(System.currentTimeMillis() + jwtExpirationMs)) 
	                .signWith(SignatureAlgorithm.HS512, secret)
	                .compact();
	    }
	
	public Date getExpriedTime(String token) {
		return Jwts.parser().setSigningKey(secret).parseClaimsJws(token).getBody().getExpiration();
	}

	public boolean valiadJwtToken(String token) throws JwtTokenException {
		try {
			Jwts.parser().setSigningKey(secret).parseClaimsJws(token);
			return true;
		} catch (SignatureException e) {
			throw new JwtTokenMaformedException("Invaliad Jwt Signature");
		} catch (MalformedJwtException e) {
			throw new JwtTokenMaformedException("Invaliad Jwt Token");
		} catch (ExpiredJwtException e) {
			throw new JwtTokenMaformedException("Jwt Token has expried");
		} catch (UnsupportedJwtException e) {
			throw new JwtTokenMaformedException("Unsupported Jwt Token");
		} catch (IllegalArgumentException e) {
			throw new JwtTokenMissingException("Jwt token is empty");
		}
	}


	public String getSubjectFromJwtToken(String token) {
		return Jwts.parser().setSigningKey(secret).parseClaimsJws(token).getBody().getSubject();
	}
}
