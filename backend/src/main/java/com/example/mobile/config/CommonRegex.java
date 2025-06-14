package com.example.mobile.config;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class CommonRegex {
	public static boolean isValidNumberPhone(String phone) {
		String regex = "^(\\+?84|0)(3[2-9]|5[689]|7[06-9]|8[1-9]|9[0-9])[0-9]{7}$";
		Pattern pattern = Pattern.compile(regex);
		Matcher matcher = pattern.matcher(phone);
		return matcher.matches();
	}

	public static boolean isValidPassword(String password) {
		String regex = "^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\\-={}\\[\\]|;:'\"<>,./?])(?=.*\\d).{6,}$";
		Pattern pattern = Pattern.compile(regex);
		Matcher matcher = pattern.matcher(password);
		return matcher.matches();
	}
}
