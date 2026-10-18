import { db, getOrCreateUserData } from "./db";

const API_URL = "http://localhost:5000/api/auth";

export async function signup(userData) {
  try {
    const response = await fetch(`${API_URL}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    if (response.ok) {
      return await response.json();
    }
  } catch {
    console.warn("Backend auth offline, using Dexie IndexedDB offline fallback.");
  }

  // Dexie IndexedDB fallback
  const existing = await db.users.where({ email: userData.email }).first();
  if (existing) {
    return { success: false, message: "User email already exists in local database." };
  }

  const userId = await db.users.add({
    username: userData.username || "Pilot",
    email: userData.email,
    createdAt: new Date().toISOString(),
  });

  await getOrCreateUserData(String(userId));

  return {
    success: true,
    user: { id: userId, username: userData.username, email: userData.email },
    token: `local-token-${userId}`,
  };
}

export async function login(userData) {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    if (response.ok) {
      return await response.json();
    }
  } catch {
    console.warn("Backend auth offline, using Dexie IndexedDB offline fallback.");
  }

  // Dexie IndexedDB fallback
  const user = await db.users.where({ email: userData.email }).first();
  if (!user) {
    const newId = await db.users.add({
      username: userData.email.split("@")[0] || "Pilot",
      email: userData.email,
      createdAt: new Date().toISOString(),
    });
    const newUser = await db.users.get(newId);
    await getOrCreateUserData(String(newId));

    return {
      success: true,
      user: { id: newId, username: newUser.username, email: newUser.email },
      token: `local-token-${newId}`,
    };
  }

  await getOrCreateUserData(String(user.id));

  return {
    success: true,
    user: { id: user.id, username: user.username, email: user.email },
    token: `local-token-${user.id}`,
  };
}
