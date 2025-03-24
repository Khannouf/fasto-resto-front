import {jwtDecode} from "jwt-decode"

export const isTokenValid = (token: string | null): boolean => {
  if (!token) return false;
  try {
    const decoded: { exp: number } = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp > currentTime;
  } catch (err) {
    return false; // Si le token ne peut pas être décodé
  }
};
