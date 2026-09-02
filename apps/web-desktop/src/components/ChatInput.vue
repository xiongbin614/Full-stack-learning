<script setup lang="ts">
import { nextTick, ref } from "vue";

const props = defineProps<{
  modelValue: string;
  disabled?: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
  (e: "submit"): void;
}>();

const textareaRef = ref<HTMLTextAreaElement | null>(null);

function onInput(event: Event) {
  const target = event.target as HTMLTextAreaElement;
  emit("update:modelValue", target.value);
  autoResize(target);
}

function autoResize(el: HTMLTextAreaElement) {
  el.style.height = "auto";
  el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    if (!props.disabled && props.modelValue.trim()) {
      emit("submit");
      nextTick(() => {
        if (textareaRef.value) {
          textareaRef.value.style.height = "auto";
        }
      });
    }
  }
}
</script>

<template>
  <div class="chat-input">
    <textarea
      ref="textareaRef"
      :value="props.modelValue"
      rows="1"
      placeholder="有问题，尽管问…"
      @input="onInput"
      @keydown="onKeydown"
    />
    <button
      class="send-btn"
      type="button"
      :disabled="props.disabled || !props.modelValue.trim()"
      @click="emit('submit')"
    >
      发送
    </button>
  </div>
</template>

<style scoped>
.chat-input {
  display: flex;
  align-items: flex-end;
  gap: 12px;
  padding: 14px 16px;
  border-radius: var(--radius-xl);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-md);
}

.chat-input textarea {
  flex: 1;
  resize: none;
  border: none;
  outline: none;
  background: transparent;
  color: var(--color-text);
  line-height: 1.55;
  max-height: 160px;
  padding: 6px 0;
}

.chat-input textarea::placeholder {
  color: var(--color-text-muted);
}

.send-btn {
  flex-shrink: 0;
  height: 40px;
  padding: 0 18px;
  border: none;
  border-radius: 999px;
  color: #fff;
  background: var(--color-accent);
  font-weight: 600;
  transition: background 0.18s var(--ease-out), opacity 0.18s;
}

.send-btn:hover:not(:disabled) {
  background: var(--color-accent-hover);
}

.send-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}
</style>
