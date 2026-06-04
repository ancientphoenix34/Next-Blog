import { CurrentUser } from "@/types";

type SetCurrentUser = (user: CurrentUser | null) => void;

export async function fetchWithAuth(
  url: string,
  options: RequestInit,
  currentUser: CurrentUser,
  setCurrentUser: SetCurrentUser
): Promise<Response> {
  // First attempt
  let res = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${currentUser.token}`,
    },
  });

  // If 403 → try refreshing the access token
  if (res.status === 403) {
    const refreshRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/refresh`, {
      method: "POST",
    });

    if (refreshRes.ok) {
      const { accessToken } = await refreshRes.json();

      // Update context with new token
      const updatedUser: CurrentUser = { ...currentUser, token: accessToken };
      setCurrentUser(updatedUser);

      // Retry original request with new token
      res = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${accessToken}`,
        },
      });
    } else {
      // Refresh token also expired — log the user out
      setCurrentUser(null);
    }
  }

  return res;
}
