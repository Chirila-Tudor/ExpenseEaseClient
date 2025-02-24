const API_URL = "http://localhost:8080/users";

export async function addUser(userRequestDTO) {
  const response = await fetch(`${API_URL}/addUser`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userRequestDTO),
  });

  if (!response.ok) {
    throw new Error("User already exists or failed to create user");
  }
  return await response.json();
}

export async function loginUser(username: string, hashPassword: string) {
  const response = await fetch(`${API_URL}/login?username=${username}`, {
    method: "POST",
    body: hashPassword,
  });

  if (!response.ok) {
    throw new Error("Invalid username or password");
  }

  const json = await response.json();

  if (json.message === "User was deactivated") {
    throw new Error(json.message);
  }

  localStorage.setItem("username", json.username);
  localStorage.setItem("role", json.role);
  localStorage.setItem("isFirstLogin", json.isFirstLogin);
  localStorage.setItem("userId", json.userId);

  return json;
}

function sleepNow(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function isFirstLogin(username) {
  await sleepNow(500);
  const response = await fetch(`${API_URL}/isFirstLogin?username=${username}`);
  const json = response.json();
  return json;
}

export async function changePassword(changePasswordDTO) {
  const response = await fetch(`${API_URL}/changePassword`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(changePasswordDTO),
  });

  if (!response.ok) {
    throw new Error("Password change failed");
  }
  return response;
}

export async function modifyUserActivity(id: number) {
  const response = await fetch(`${API_URL}/modifyUserActivity?id=${id}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error("Failed to modify user activity");
  }
  return response;
}

export async function getUserByUsername(username: string) {
  const response = await fetch(`${API_URL}?username=${username}`);
  if (!response.ok) {
    throw new Error("Failed to fetch user by username");
  }
  return await response.json();
}

export async function deleteUser(username: string) {
  const response = await fetch(`${API_URL}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(username),
  });

  if (!response.ok) {
    throw new Error("Failed to delete user");
  }
  return response;
}

export async function forgotPassword(username: string) {
  const response = await fetch(
    `${API_URL}/forgotPassword?username=${username}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to request password reset");
  }
  return response;
}

export async function requestPassword(username: string, securityCode: string) {
  const response = await fetch(
    `${API_URL}/requestPassword?username=${username}`,
    {
      method: "POST",
      body: securityCode,
    }
  );

  if (!response.ok) {
    throw new Error("Failed to request password");
  }
  return response;
}
