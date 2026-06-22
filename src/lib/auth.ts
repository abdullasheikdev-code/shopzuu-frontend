import Cookies from "js-cookie";

export interface AuthUser {
  userId: number;
  name: string;
  email: string;
  role: "BUYER" | "VENDOR" | "ADMIN";
  vendorId: number | null;
}

export function saveAuth(token: string, user: AuthUser) {
  Cookies.set("shopzuu_token", token, { expires: 1 });
  Cookies.set("shopzuu_user", JSON.stringify(user), { expires: 1 });
}

export function getAuthUser(): AuthUser | null {
  const raw = Cookies.get("shopzuu_user");
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function getToken(): string | undefined {
  return Cookies.get("shopzuu_token");
}

export function logout() {
  Cookies.remove("shopzuu_token");
  Cookies.remove("shopzuu_user");
  window.location.href = "/login";
}

export function isAuthenticated(): boolean {
  return !!getToken();
}