import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const authService = {
  login: async (email: string | undefined, password: string) => {
    return api.post("/loginSuperUser", {
      email,
      password,
    });
  },
};

export default api;
