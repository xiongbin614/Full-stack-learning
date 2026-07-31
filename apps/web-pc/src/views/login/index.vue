<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const formRef = ref<FormInstance>()
const loading = ref(false)

const form = reactive({
  username: 'admin',
  password: 'admin123',
  remember: true,
})

const rules: FormRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
}

async function handleLogin() {
  if (!formRef.value) return
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return

  loading.value = true
  try {
    await userStore.login(form.username, form.password)
    ElMessage.success('登录成功')
    const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/dashboard'
    router.replace(redirect)
  } catch {
    // 错误提示已由 request 拦截器统一处理
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-page">
    <div class="login-card">
      <div class="login-head">
        <el-icon :size="32" color="#409eff"><Cpu /></el-icon>
        <h1 class="login-title">CMCCPC · AI 业务工作台</h1>
        <p class="login-subtitle">Mock 模式 · 暂未联调后端</p>
      </div>

      <el-form ref="formRef" :model="form" :rules="rules" size="large" @keyup.enter="handleLogin">
        <el-form-item prop="username">
          <el-input v-model="form.username" placeholder="用户名" :prefix-icon="'User'" clearable />
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="form.password" type="password" placeholder="密码" :prefix-icon="'Lock'" show-password />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="login-btn" :loading="loading" @click="handleLogin">
            登 录
          </el-button>
        </el-form-item>
      </el-form>

      <div class="login-tips">
        <p>Mock 账号：<code>admin / admin123</code>（管理员）</p>
        <p>或 <code>alice / 123456</code>、<code>bob / 123456</code>（普通用户）</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1f3b5c 0%, #0a1a2f 100%);
}

.login-card {
  width: 380px;
  background: #fff;
  border-radius: 12px;
  padding: 40px 36px 24px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.25);
}

.login-head {
  text-align: center;
  margin-bottom: 28px;
}

.login-title {
  font-size: 20px;
  margin: 12px 0 4px;
  color: #303133;
}

.login-subtitle {
  font-size: 12px;
  color: #909399;
  margin: 0;
}

.login-btn {
  width: 100%;
}

.login-tips {
  margin-top: 8px;
  padding-top: 12px;
  border-top: 1px dashed #e4e7ed;
  font-size: 12px;
  color: #909399;
  line-height: 1.8;
  text-align: center;
}

.login-tips code {
  background: #f0f2f5;
  padding: 1px 6px;
  border-radius: 4px;
  color: #409eff;
}
</style>
