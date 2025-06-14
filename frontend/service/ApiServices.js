import { getToken } from "./JwtTokenService";

const API_URL = "http://10.0.113.110:8080"; // Đặt URL của API

// Gọi API có bảo vệ
export const callApiWithAuth = async (
  endpoint,
  method = "GET",
  body = null
) => {
  try {
    let token = await getToken();
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : null,
    });
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("API Request Error:", error);
    throw error;
  }
};
export const getUserIF = async (accessToken, endpoint, method = "GET") => {
  try {
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
      method,
      headers,
    });
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("API Request Error:", error);
    throw error;
  }
};
export const registerApi = async (endpoint, method, body) => {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: method,
      headers: {
        "Content-Type": "application/json", // Định dạng JSON
      },
      body: body ? JSON.stringify(body) : null,
    });

    if (!response.ok) {
      // Xử lý lỗi HTTP
      const errorResponse = await response.json();
      throw new Error(errorResponse.message || "Registration failed");
    }

    // Trả về kết quả nếu thành công
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error during registration:", error.message);
    throw error;
  }
};
// Hàm gọi API POST chung
export const loginApi = async (phone, password) => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        phone: phone,
        password: password,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }
    const result = await response.json();
    return result; // Trả về JSON từ server
  } catch (error) {
    console.error("Login API Error:", error.message);
    throw error;
  }
};
