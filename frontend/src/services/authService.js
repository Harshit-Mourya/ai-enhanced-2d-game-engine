const API_URL = "http://localhost:5000/api/auth";

export async function signup(userData) {
  const response = await fetch(`${API_URL}/signup`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(userData),
  });

  return response.json();
}

export async function login(userData) {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(userData),
  });

  return response.json();
}
