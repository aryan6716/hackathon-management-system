const API_BASE = import.meta.env.VITE_API_URL;

// ======================
// Helper: Get token
// ======================
const getToken = () => localStorage.getItem("token");

// ======================
// GET
// ======================
export const apiGet = async (url) => {
  const res = await fetch(`${API_BASE}${url}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: getToken() ? `Bearer ${getToken()}` : "",
    },
  });

  if (!res.ok) {
    throw new Error("API GET failed");
  }

  return res.json();
};

// ======================
// POST
// ======================
export const apiPost = async (url, body) => {
  const res = await fetch(`${API_BASE}${url}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: getToken() ? `Bearer ${getToken()}` : "",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "API POST failed");
  }

  return res.json();
};

// ======================
// PUT
// ======================
export const apiPut = async (url, body) => {
  const res = await fetch(`${API_BASE}${url}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: getToken() ? `Bearer ${getToken()}` : "",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error("API PUT failed");
  }

  return res.json();
};

// ======================
// DELETE
// ======================
export const apiDelete = async (url) => {
  const res = await fetch(`${API_BASE}${url}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: getToken() ? `Bearer ${getToken()}` : "",
    },
  });

  if (!res.ok) {
    throw new Error("API DELETE failed");
  }

  return res.json();
};