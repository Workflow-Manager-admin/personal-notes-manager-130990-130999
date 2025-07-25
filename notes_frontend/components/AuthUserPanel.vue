<template>
  <div class="auth-panel">
    <div v-if="authUser" class="authed">
      <div class="user-greet">
        <span class="avatar">{{ authUser.email.charAt(0).toUpperCase() }}</span>
        <span class="greet">Hi, {{ authUser.email }}</span>
      </div>
      <button class="logout-btn" @click="logoutUser">Logout</button>
    </div>
    <div v-else>
      <form @submit.prevent="onLogin" class="auth-form">
        <input
          v-model="email"
          type="email"
          placeholder="Email"
          required
        />
        <input
          v-model="password"
          type="password"
          placeholder="Password"
          minlength="3"
          required
        />
        <div class="btn-row">
          <button type="submit" :disabled="loading">Login</button>
          <button type="button" @click="onRegister" :disabled="loading" class="outline">Register</button>
        </div>
      </form>
      <div v-if="error" class="error-msg">{{ error }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useAuthUser, useAuthLoading, useAuthError, login, register, logout } from "../composables/useAuth";

const email = ref("");
const password = ref("");

const authUser = useAuthUser();
const loading = useAuthLoading();
const error = useAuthError();

async function onLogin() {
  await login(email.value, password.value);
}
async function onRegister() {
  await register(email.value, password.value);
}
function logoutUser() {
  logout();
}
</script>

<style scoped>
.auth-panel {
  background: rgba(255,255,255,0.1);
  border-radius: 8px;
  padding: 0.8rem 1rem;
  margin-top: 1rem;
  font-size: 0.97rem;
  color: #fff;
}
.user-greet {
  display: flex;
  align-items: center;
  gap: 0.7em;
}
.avatar {
  background: var(--color-secondary);
  color: var(--color-primary);
  font-weight: 600;
  border-radius: 50%;
  width: 2em;
  height: 2em;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1em;
}
.greet {
  font-weight: 500;
}
.logout-btn,
.auth-form button {
  background: var(--color-accent);
  color: #fff;
  border: none;
  padding: 0.45em 1.1em;
  border-radius: 6px;
  font-size: 0.95em;
  cursor: pointer;
  margin-top: 1em;
  box-shadow: 0 0.5px 1.5px rgba(0,0,0,0.04);
  transition: background 0.14s;
}
.logout-btn:hover {
  background: #ee5151;
}
.auth-form {
  display: flex;
  flex-direction: column;
  gap: 0.6em;
}
.auth-form input {
  border-radius: 5px;
  padding: 0.45em 0.8em;
  border: none;
  font-size: 1em;
  outline: none;
  margin-bottom: 0.1em;
}
.auth-form .btn-row {
  display: flex;
  gap: 0.6em;
}
.auth-form button.outline {
  background: transparent;
  color: var(--color-secondary);
  border: 1.7px solid var(--color-accent);
}
.error-msg {
  color: #fff0f0;
  background: var(--color-accent);
  margin-top: 0.6em;
  border-radius: 5px;
  padding: 0.2em 0.7em;
  font-size: 0.95em;
}
</style>
