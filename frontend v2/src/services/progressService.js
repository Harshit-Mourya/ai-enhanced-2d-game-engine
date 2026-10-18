const API_URL = "http://localhost:5000/api/progress";

async function progressRequest(path = "", options = {}) {
  const token = localStorage.getItem("token");

  if (!token || token.startsWith("local-token-")) {
    throw new Error("Please log in with a backend account first.");
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Progress request failed.");
  }

  return data;
}

export async function getGameProgress() {
  return progressRequest();
}

export async function saveCheckpoint(levelId, checkpoint) {
  return progressRequest("/checkpoint", {
    method: "PUT",
    body: JSON.stringify({ levelId, checkpoint }),
  });
}

export async function completeSector(levelId, stats) {
  return progressRequest("/complete", {
    method: "POST",
    body: JSON.stringify({
      levelId,
      score: stats.score,
      survivalTime: stats.survivalTime,
      enemiesKilled: stats.enemiesKilled,
    }),
  });
}

export async function clearSavedCheckpoint() {
  return progressRequest("/checkpoint", {
    method: "DELETE",
  });
}
