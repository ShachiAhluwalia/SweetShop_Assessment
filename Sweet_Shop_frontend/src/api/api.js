const API_BASE_URL = "http://127.0.0.1:8000";

/**
 * Helper to get JWT token
 */
function getToken() {
  return localStorage.getItem("token");
}

/**
 * Generic request wrapper
 */
async function request(endpoint, options = {}) {
  const token = getToken();

  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "API Error");
  }

  return response.json();
}

/**
 * Auth APIs
 */
export function login(email, password) {
  const formData = new URLSearchParams();
  formData.append("username", email);
  formData.append("password", password);

  return fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData,
  }).then(async (res) => {
    if (!res.ok) {
      throw new Error("Invalid credentials");
    }
    return res.json();
  });
}

/**
 * Sweet APIs
 */
export function getSweets() {
  return request("/sweets");
}

export function searchSweets(params) {
  const query = new URLSearchParams(params).toString();
  return request(`/sweets/search?${query}`);
}
