package com.example.mobile.config.exception;
public class JwtTokenMissingException extends JwtTokenException {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public JwtTokenMissingException(String error) {
		super(error);
	}
}
