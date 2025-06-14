package com.example.mobile.config.exception;
public class JwtTokenMaformedException extends JwtTokenException {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public JwtTokenMaformedException(String error) {
		super(error);
	}
}