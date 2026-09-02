import { defineStore } from "pinia";
import { computed, ref } from "vue";

export interface AuthUser {
  id: number;
  username: string;
  nickname: string;
  avatar?: string;
}

export const useAuthStore = defineStore("auth", () => {
  const token = ref<string | null>(localStorage.getItem("auth_token"));
  const user = ref<AuthUser | null>(readUser());
  const loginVisible = ref(false);
  const authMode = ref<"login" | "register">("login");

  const isLoggedIn = computed(() => Boolean(token.value && user.value));

  function readUser(): AuthUser | null {
    const raw = localStorage.getItem("auth_user");
    if (!raw) return null;
    try {
      return JSON.parse(raw) as AuthUser;
    } catch {
      return null;
    }
  }

  function openLogin(mode: "login" | "register" = "login") {
    authMode.value = mode;
    loginVisible.value = true;
  }

  function closeLogin() {
    loginVisible.value = false;
  }

  /** 框架阶段：本地模拟登录，后续再接 /api/auth */
  function loginMock(username: string, _password: string) {
    const nextUser: AuthUser = {
      id: Date.now(),
      username,
      nickname: username,
    };
    token.value = `mock_${Date.now()}`;
    user.value = nextUser;
    localStorage.setItem("auth_token", token.value);
    localStorage.setItem("auth_user", JSON.stringify(nextUser));
    loginVisible.value = false;
  }

  function registerMock(username: string, password: string) {
    loginMock(username, password);
  }

  function logout() {
    token.value = null;
    user.value = null;
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
  }

  return {
    token,
    user,
    loginVisible,
    authMode,
    isLoggedIn,
    openLogin,
    closeLogin,
    loginMock,
    registerMock,
    logout,
  };
});
