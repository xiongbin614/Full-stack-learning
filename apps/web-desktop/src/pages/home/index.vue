<script setup lang="ts">
import { computed, ref } from "vue";
import AppSidebar, { type ConversationItem } from "@/components/AppSidebar.vue";
import ChatInput from "@/components/ChatInput.vue";
import { useAuthStore } from "@/stores/auth";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const auth = useAuthStore();
const draft = ref("");
const activeId = ref("c1");
const conversations = ref<ConversationItem[]>([
  { id: "c1", title: "帮我写一段产品介绍", updatedAt: "今天" },
  { id: "c2", title: "周末去哪玩比较合适", updatedAt: "昨天" },
  { id: "c3", title: "解释一下 Redis 登录态", updatedAt: "周一" },
]);

const messages = ref<ChatMessage[]>([]);

const greetingName = computed(() => {
  if (auth.user?.nickname) return auth.user.nickname;
  return "朋友";
});

const hasMessages = computed(() => messages.value.length > 0);

const prompts = [
  "帮我润色一段工作周报",
  "用通俗的话解释 JWT 和 Session",
  "生成一个待办清单模板",
  "推荐几个提升专注力的小技巧",
];

function newChat() {
  activeId.value = "";
  messages.value = [];
  draft.value = "";
}

function selectConversation(id: string) {
  activeId.value = id;
  const item = conversations.value.find((c) => c.id === id);
  messages.value = item
    ? [
        { id: "m1", role: "user", content: item.title },
        {
          id: "m2",
          role: "assistant",
          content: "这是框架占位回复。后续会接入真正的对话接口。",
        },
      ]
    : [];
}

function usePrompt(text: string) {
  draft.value = text;
}

function sendMessage() {
  const content = draft.value.trim();
  if (!content) return;

  if (!auth.isLoggedIn) {
    auth.openLogin("login");
    return;
  }

  messages.value.push({
    id: `u_${Date.now()}`,
    role: "user",
    content,
  });

  if (!activeId.value) {
    const id = `c_${Date.now()}`;
    activeId.value = id;
    conversations.value.unshift({
      id,
      title: content.slice(0, 18) || "新对话",
      updatedAt: "刚刚",
    });
  }

  draft.value = "";

  messages.value.push({
    id: `a_${Date.now()}`,
    role: "assistant",
    content: "收到。当前是页面框架阶段，真实 AI 回复会在下一步接入。",
  });
}
</script>

<template>
  <div class="home-layout">
    <AppSidebar
      :conversations="conversations"
      :active-id="activeId"
      @new-chat="newChat"
      @select="selectConversation"
    />

    <main class="home-main">
      <header class="home-topbar">
        <div class="topbar-title">墨言</div>
        <button
          v-if="!auth.isLoggedIn"
          class="topbar-login"
          type="button"
          @click="auth.openLogin('login')"
        >
          登录
        </button>
      </header>

      <section v-if="!hasMessages" class="welcome">
        <div class="welcome__badge">桌面端 · 随时问</div>
        <h1>你好，{{ greetingName }}</h1>
        <p>我是墨言，可以帮你写作、总结、答疑，也可以聊聊想法。</p>

        <div class="prompt-grid">
          <button
            v-for="item in prompts"
            :key="item"
            type="button"
            class="prompt-card"
            @click="usePrompt(item)"
          >
            {{ item }}
          </button>
        </div>
      </section>

      <section v-else class="message-list">
        <article
          v-for="msg in messages"
          :key="msg.id"
          class="message"
          :class="`message--${msg.role}`"
        >
          <div class="message__avatar">
            {{ msg.role === "user" ? "我" : "墨" }}
          </div>
          <div class="message__bubble">{{ msg.content }}</div>
        </article>
      </section>

      <footer class="home-composer">
        <ChatInput v-model="draft" @submit="sendMessage" />
        <p class="composer-tip">Enter 发送 · Shift + Enter 换行 · 未登录发送会弹出登录</p>
      </footer>
    </main>
  </div>
</template>

<style scoped>
.home-layout {
  display: flex;
  height: 100%;
  min-height: 0;
  background:
    radial-gradient(circle at 18% 12%, rgba(20, 184, 166, 0.12), transparent 36%),
    radial-gradient(circle at 88% 8%, rgba(59, 130, 246, 0.08), transparent 30%),
    linear-gradient(180deg, #f5f8fb 0%, #eef2f6 100%);
}

.home-main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  position: relative;
}

.home-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 56px;
  padding: 0 24px;
}

.topbar-title {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 15px;
  letter-spacing: 0.04em;
  color: var(--color-text-secondary);
}

.topbar-login {
  height: 34px;
  padding: 0 16px;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.8);
  color: var(--color-text);
  transition: border-color 0.18s, background 0.18s;
}

.topbar-login:hover {
  border-color: rgba(15, 118, 110, 0.35);
  background: #fff;
}

.welcome {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px 24px 120px;
  text-align: center;
  animation: rise-in 0.45s var(--ease-out);
}

.welcome__badge {
  display: inline-flex;
  padding: 6px 12px;
  margin-bottom: 18px;
  border-radius: 999px;
  font-size: 12px;
  color: var(--color-accent);
  background: var(--color-accent-soft);
}

.welcome h1 {
  margin: 0 0 12px;
  font-family: var(--font-display);
  font-size: clamp(28px, 4vw, 40px);
  font-weight: 700;
  letter-spacing: -0.02em;
}

.welcome p {
  margin: 0 0 28px;
  max-width: 420px;
  color: var(--color-text-secondary);
  line-height: 1.7;
}

.prompt-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 220px));
  gap: 12px;
}

.prompt-card {
  padding: 14px 16px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: rgba(255, 255, 255, 0.72);
  text-align: left;
  color: var(--color-text);
  line-height: 1.5;
  transition: transform 0.2s var(--ease-out), box-shadow 0.2s var(--ease-out),
    border-color 0.2s;
}

.prompt-card:hover {
  transform: translateY(-2px);
  border-color: rgba(15, 118, 110, 0.28);
  box-shadow: var(--shadow-sm);
  background: #fff;
}

.message-list {
  flex: 1;
  overflow: auto;
  padding: 12px 24px 140px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  max-width: 820px;
  width: 100%;
  margin: 0 auto;
  animation: rise-in 0.35s var(--ease-out);
}

.message {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.message--user {
  flex-direction: row-reverse;
}

.message__avatar {
  width: 34px;
  height: 34px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  font-size: 13px;
  font-weight: 600;
  color: #fff;
  background: #64748b;
}

.message--assistant .message__avatar {
  background: linear-gradient(145deg, #0f766e, #14b8a6);
}

.message__bubble {
  max-width: min(100%, 560px);
  padding: 12px 16px;
  border-radius: 16px;
  line-height: 1.65;
  background: #fff;
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-sm);
  white-space: pre-wrap;
}

.message--user .message__bubble {
  background: #0f766e;
  color: #fff;
  border-color: transparent;
}

.home-composer {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 0 24px 18px;
  background: linear-gradient(180deg, transparent, rgba(238, 242, 246, 0.92) 28%);
}

.home-composer :deep(.chat-input) {
  max-width: 760px;
  margin: 0 auto;
}

.composer-tip {
  margin: 10px 0 0;
  text-align: center;
  font-size: 12px;
  color: var(--color-text-muted);
}

@keyframes rise-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 860px) {
  .prompt-grid {
    grid-template-columns: 1fr;
    width: min(100%, 360px);
  }
}
</style>
