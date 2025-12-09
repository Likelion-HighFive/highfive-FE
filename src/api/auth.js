const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function login({ email, password, nickname }) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      email,
      password,
      nickname: nickname ?? "",
    }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      data?.message ||
      data?.detail?.[0]?.msg ||
      `로그인에 실패했습니다. (status: ${response.status})`;
    const error = new Error(message);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export async function signup({ email, password, nickname }) {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        nickname,
      }),
    });
  
    const data = await response.json().catch(() => null);
  
    if (!response.ok) {
      const message =
        data?.message ||
        data?.detail?.[0]?.msg ||
        `회원가입에 실패했습니다. (status: ${response.status})`;
      const error = new Error(message);
      error.status = response.status;
      error.data = data;
      throw error;
    }
  
    return data;
  }