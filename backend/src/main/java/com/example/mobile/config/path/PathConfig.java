package com.example.mobile.config.path;

import org.springframework.util.AntPathMatcher;
// đây là lớp bảo mật trong springboot
public class PathConfig {
	// trả về mảng các đường dẫn không yêu cầu xác thức
	public static String[] getPathPermitAll() {
		return new String[] { "/", "/image/**", "/auth/login", "/product/type", "/register/**", "/verification/**",
				"/auth/**", "/swagger-ui/**", "/swagger-ui.html", "/v3/api-docs/**" };
	}
	// trả về mảng đường dẫn yêu cầu xác thực
	public static String[] oligate() {
		return new String[] { "/product/info" };
	}
	//trả về mảng đường dẫn không yêu cầu xác thực từ phương thức get
	public static String[] getPathPermitAllForGetMethod() {
		return new String[] {};
	}
	// trả về mảng đường dẫn yêu cầu xác thực từ phương thức post
	public static String[] getPathPermitAllForPostMethod() {
		return new String[] { "/user/register" };
	}
	//trả về một chuỗi đại diện cho đường dẫn tới websocket
	public static String connectWebsocket() {
		return "/ws";
	}
	// kiểm tra xem đường dẫn có chứa web chuỗi dẫn đến websocket hay không
	public static boolean matcherConnectWebSocketPath(String path) {
		return path.contains(connectWebsocket());
	}

	// Đầu tiên, phương thức kiểm tra xem path có yêu cầu xác thực hay không
	// Nếu không, kiểm tra tiếp đường dẫn có thuộc đg dẫn không yêu cầu xác thực hay không
	// bNe16u phương thức là get, kiểm tra đường dẫn có yêu cầu xác thực cho get hay không, nếu true thì đường dẫn yêu cầu xác thực
	// false là đường dẫn không yêu cầu xác thực
	public static boolean checkPathForAuthentication(String path, String methodRequest) {
		boolean isCheck = true;
		for (var x : PathConfig.oligate()) {
			if (new AntPathMatcher().match(x, path)) {
				return true;
			}
		}
		for (var x : PathConfig.getPathPermitAll()) {
			if (new AntPathMatcher().match(x, path)) {
				isCheck = false;
				break;
			}
		}
		if (methodRequest.equalsIgnoreCase("GET") && isCheck == true) {

			for (var x : PathConfig.getPathPermitAllForGetMethod()) {
				if (new AntPathMatcher().match(x, path)) {
					isCheck = false;

				}
			}
		}

		return isCheck;
	}
}
