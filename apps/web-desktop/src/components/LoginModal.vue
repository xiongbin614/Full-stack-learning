<script setup lang="ts">
import { computed, reactive, ref, watch } from "vue";
import { useAuthStore } from "@/stores/auth";

const auth = useAuthStore();

const form = reactive({
  username: "",
  password: "",
  confirmPassword: "",
});
const error = ref("");
const submitting = ref(false);

const isRegister = computed(() => auth.authMode === "register");
const title = computed(() => (isRegister.value ? "注册墨言账号" : "登录墨言"));
const subtitle = computed(() =>
  isRegister.value ? "创建账号，同步对话与偏好" : "登录后可同步历史对话",
);

watch(
  () => auth.loginVisible,
  (visible) => {
    if (!visible) {
      form.username = "";
      form.password = "";
      form.confirmPassword = "";
      error.value = "";
      submitting.value = false;
    }
  },
);

function switchMode(mode: "login" | "register") {
  auth.authMode = mode;
  error.value = "";
}

function onOverlayClick() {
  auth.closeLogin();
}

async function onSubmit() {
  error.value = "";
  if (!form.username.trim() || !form.password) {
    error.value = "请输入用户名和密码";
    return;
  }
  if (isRegister.value && form.password !== form.confirmPassword) {
    error.value = "两次输入的密码不一致";
    return;
  }
  if (form.password.length < 6) {
    error.value = "密码至少 6 位";
    return;
  }

  submitting.value = true;
  try {
    // 框架阶段先本地模拟；下一步再对接 /api/auth
    await new Promise((r) => setTimeout(r, 280));
    if (isRegister.value) {
      auth.registerMock(form.username.trim(), form.password);
    } else {
      auth.loginMock(form.username.trim(), form.password);
    }
  } finally {
    submitting.value = false;
  }
}
</script>

<template>
  <Teleport to="body">
    <div v-if="auth.loginVisible" class="modal-root" role="dialog" aria-modal="true">
      <div class="modal-overlay" @click="onOverlayClick" />
      <div class="modal-panel" @click.stop>
        <button class="modal-close" type="button" aria-label="关闭" @click="auth.closeLogin()">
          ×
        </button>

        <div class="modal-hero">
          <div class="modal-mark">墨</div>
          <h2>{{ title }}</h2>
          <p>{{ subtitle }}</p>
        </div>

        <form class="modal-form" @submit.prevent="onSubmit">
          <label class="field">
            <span>用户名</span>
            <input v-model="form.username" type="text" autocomplete="username" placeholder="请输入用户名" />
          </label>
          <label class="field">
            <span>密码</span>
            <input
              v-model="form.password"
              type="password"
              autocomplete="current-password"
              placeholder="请输入密码"
            />
          </label>
          <label v-if="isRegister" class="field">
            <span>确认密码</span>
            <input
              v-model="form.confirmPassword"
              type="password"
              autocomplete="new-password"
              placeholder="再次输入密码"
            />
          </label>

          <p v-if="error" class="form-error">{{ error }}</p>

          <button class="submit-btn" type="submit" :disabled="submitting">
            {{ submitting ? "提交中..." : isRegister ? "注册并登录" : "登录" }}
          </button>
        </form>

        <div class="modal-switch">
          <template v-if="isRegister">
            已有账号？
            <button type="button" @click="switchMode('login')">去登录</button>
          </template>
          <template v-else>
            还没有账号？
            <button type="button" @click="switchMode('register')">去注册</button>
          </template>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.modal-root {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: grid;
  place-items: center;
  padding: 24px;
}

.modal-overlay {
  position: absolute;
  inset: 0;
  background: rgba(15, 23, 42, 0.42);
  backdrop-filter: blur(6px);
  animation: fade-in 0.22s var(--ease-out);
}

.modal-panel {
  position: relative;
  width: min(420px, 100%);
  padding: 32px 28px 24px;
  border-radius: var(--radius-lg);
  background:
    radial-gradient(circle at top right, rgba(20, 184, 166, 0.12), transparent 42%),
    var(--color-surface);
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--color-border);
  animation: panel-in 0.28s var(--ease-out);
}

.modal-close {
  position: absolute;
  top: 14px;
  right: 14px;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 50%;
  background: transparent;
  color: var(--color-text-muted);
  font-size: 22px;
  line-height: 1;
}

.modal-close:hover {
  background: rgba(15, 23, 42, 0.05);
  color: var(--color-text);
}

.modal-hero {
  text-align: center;
  margin-bottom: 24px;
}

.modal-mark {
  width: 52px;
  height: 52px;
  margin: 0 auto 14px;
  border-radius: 18px;
  display: grid;
  place-items: center;
  color: #fff;
  font-family: var(--font-display);
  font-size: 22px;
  font-weight: 700;
  background: linear-gradient(145deg, #0f766e, #14b8a6);
  box-shadow: 0 10px 24px rgba(15, 118, 110, 0.28);
}

.modal-hero h2 {
  margin: 0 0 8px;
  font-family: var(--font-display);
  font-size: 22px;
  font-weight: 600;
}

.modal-hero p {
  margin: 0;
  color: var(--color-text-secondary);
  font-size: 14px;
}

.modal-form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 13px;
  color: var(--color-text-secondary);
}

.field input {
  height: 44px;
  padding: 0 14px;
  border: 1px solid var(--color-border);
  border-radius: 12px;
  background: var(--color-bg-soft);
  color: var(--color-text);
  outline: none;
  transition: border-color 0.18s var(--ease-out), box-shadow 0.18s var(--ease-out);
}

.field input:focus {
  border-color: rgba(15, 118, 110, 0.45);
  box-shadow: 0 0 0 3px rgba(15, 118, 110, 0.12);
  background: #fff;
}

.form-error {
  margin: 0;
  font-size: 13px;
  color: var(--color-danger);
}

.submit-btn {
  height: 44px;
  margin-top: 4px;
  border: none;
  border-radius: 12px;
  color: #fff;
  background: var(--color-accent);
  font-weight: 600;
  transition: background 0.18s var(--ease-out), opacity 0.18s;
}

.submit-btn:hover:not(:disabled) {
  background: var(--color-accent-hover);
}

.submit-btn:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.modal-switch {
  margin-top: 18px;
  text-align: center;
  font-size: 13px;
  color: var(--color-text-secondary);
}

.modal-switch button {
  border: none;
  background: transparent;
  color: var(--color-accent);
  font-weight: 600;
  padding: 0 4px;
}

.modal-switch button:hover {
  color: var(--color-accent-hover);
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes panel-in {
  from {
    opacity: 0;
    transform: translateY(12px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
</style>
