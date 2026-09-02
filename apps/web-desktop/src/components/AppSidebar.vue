<script setup lang="ts">
import { computed, ref } from "vue";
import { useAuthStore } from "@/stores/auth";

export interface ConversationItem {
  id: string;
  title: string;
  updatedAt: string;
}

const props = defineProps<{
  conversations: ConversationItem[];
  activeId?: string;
}>();

const emit = defineEmits<{
  (e: "new-chat"): void;
  (e: "select", id: string): void;
}>();

const auth = useAuthStore();
const menuOpen = ref(false);

const displayName = computed(() => {
  if (!auth.user) return "未登录";
  return auth.user.nickname || auth.user.username;
});

function onAvatarClick() {
  if (!auth.isLoggedIn) {
    auth.openLogin("login");
    return;
  }
  menuOpen.value = !menuOpen.value;
}

function onLogout() {
  menuOpen.value = false;
  auth.logout();
}
</script>

<template>
  <aside class="sidebar">
    <div class="sidebar__brand">
      <div class="brand-mark" aria-hidden="true">墨</div>
      <div class="brand-text">
        <strong>墨言</strong>
        <span>桌面智能助手</span>
      </div>
    </div>

    <button class="new-chat" type="button" @click="emit('new-chat')">
      <span class="new-chat__icon">+</span>
      开启新对话
    </button>

    <div class="sidebar__section-label">最近对话</div>
    <nav class="conversation-list">
      <button
        v-for="item in props.conversations"
        :key="item.id"
        type="button"
        class="conversation-item"
        :class="{ 'is-active': item.id === props.activeId }"
        @click="emit('select', item.id)"
      >
        <span class="conversation-item__title">{{ item.title }}</span>
        <span class="conversation-item__time">{{ item.updatedAt }}</span>
      </button>
      <p v-if="!props.conversations.length" class="conversation-empty">
        还没有对话，点上方开始吧
      </p>
    </nav>

    <div class="sidebar__footer">
      <button class="user-entry" type="button" @click="onAvatarClick">
        <div class="user-avatar">
          {{ auth.isLoggedIn ? displayName.slice(0, 1) : "?" }}
        </div>
        <div class="user-meta">
          <strong>{{ displayName }}</strong>
          <span>{{ auth.isLoggedIn ? "已登录" : "点击登录账号" }}</span>
        </div>
      </button>

      <div v-if="menuOpen && auth.isLoggedIn" class="user-menu">
        <button type="button" @click="onLogout">退出登录</button>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  width: var(--sidebar-width);
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 18px 14px 14px;
  background: linear-gradient(180deg, #f7fafc 0%, var(--color-sidebar) 100%);
  border-right: 1px solid var(--color-border);
}

.sidebar__brand {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 4px 8px 18px;
}

.brand-mark {
  width: 40px;
  height: 40px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  color: #fff;
  font-family: var(--font-display);
  font-weight: 700;
  background: linear-gradient(145deg, #0f766e, #14b8a6);
  box-shadow: 0 8px 18px rgba(15, 118, 110, 0.28);
}

.brand-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.brand-text strong {
  font-family: var(--font-display);
  font-size: 17px;
  letter-spacing: 0.02em;
}

.brand-text span {
  font-size: 12px;
  color: var(--color-text-muted);
}

.new-chat {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 42px;
  margin: 0 4px 16px;
  border: none;
  border-radius: 999px;
  color: #fff;
  background: var(--color-accent);
  transition: background 0.2s var(--ease-out), transform 0.2s var(--ease-out);
}

.new-chat:hover {
  background: var(--color-accent-hover);
  transform: translateY(-1px);
}

.new-chat__icon {
  font-size: 18px;
  line-height: 1;
}

.sidebar__section-label {
  padding: 0 12px 8px;
  font-size: 12px;
  color: var(--color-text-muted);
}

.conversation-list {
  flex: 1;
  overflow: auto;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 0 4px;
}

.conversation-item {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  width: 100%;
  padding: 10px 12px;
  border: none;
  border-radius: var(--radius-sm);
  text-align: left;
  background: transparent;
  color: var(--color-text);
  transition: background 0.18s var(--ease-out);
}

.conversation-item:hover,
.conversation-item.is-active {
  background: rgba(15, 118, 110, 0.08);
}

.conversation-item__title {
  font-size: 14px;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
}

.conversation-item__time {
  font-size: 11px;
  color: var(--color-text-muted);
}

.conversation-empty {
  margin: 24px 12px;
  font-size: 13px;
  color: var(--color-text-muted);
  line-height: 1.6;
}

.sidebar__footer {
  position: relative;
  padding-top: 12px;
  border-top: 1px solid var(--color-border);
}

.user-entry {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: var(--radius-md);
  background: transparent;
  text-align: left;
  transition: background 0.18s var(--ease-out);
}

.user-entry:hover {
  background: rgba(15, 23, 42, 0.04);
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  background: linear-gradient(145deg, #334155, #64748b);
}

.user-meta {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.user-meta strong {
  font-size: 14px;
}

.user-meta span {
  font-size: 12px;
  color: var(--color-text-muted);
}

.user-menu {
  position: absolute;
  left: 10px;
  right: 10px;
  bottom: 64px;
  padding: 6px;
  border-radius: var(--radius-sm);
  background: var(--color-surface);
  box-shadow: var(--shadow-md);
  border: 1px solid var(--color-border);
  animation: menu-in 0.18s var(--ease-out);
}

.user-menu button {
  width: 100%;
  padding: 10px 12px;
  border: none;
  border-radius: 8px;
  background: transparent;
  text-align: left;
  color: var(--color-danger);
}

.user-menu button:hover {
  background: rgba(220, 38, 38, 0.06);
}

@keyframes menu-in {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
