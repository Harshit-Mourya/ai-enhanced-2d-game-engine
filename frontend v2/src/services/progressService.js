const API_URL = `${import.meta.env.VITE_API_URL}/api/progress`;

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
