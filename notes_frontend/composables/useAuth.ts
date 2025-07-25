import { ref, computed } from "vue";

interface User {
  id: string;
  email: string;
}

/**
 * PUBLIC_INTERFACE
 * Provides authentication logic and state for the app.
 */
const user = ref<User | null>(getSavedUser());
const token = ref<string | null>(getSavedToken());
const loading = ref(false);
const error = ref<string | null>(null);

function getSavedUser(): User | null {
  if (typeof window !== "undefined" && window.localStorage) {
    const u = localStorage.getItem("notesapp_user");
    return u ? JSON.parse(u) : null;
  }
  return null;
}
function getSavedToken(): string | null {
  if (typeof window !== "undefined" && window.localStorage) {
    return localStorage.getItem("notesapp_token") || null;
  }
  return null;
}

/**
 * PUBLIC_INTERFACE
 * Returns the authenticated user.
 */
export function useAuthUser() {
  return computed(() => user.value);
}

/**
 * PUBLIC_INTERFACE
 * Returns authentication loading state.
 */
export function useAuthLoading() {
  return computed(() => loading.value);
}

/**
 * PUBLIC_INTERFACE
 * Returns authentication error state.
 */
export function useAuthError() {
  return computed(() => error.value);
}

/**
 * PUBLIC_INTERFACE
 * Attempts to login user, sets local state on success.
 */
export async function login(email: string, password: string): Promise<boolean> {
  loading.value = true;
  error.value = null;
  try {
    // TODO: replace with real API call to backend!
    // Simulated mock login for demo:
    if (email && password && password.length >= 3) {
      user.value = { id: 'demo-user-1', email };
      token.value = "demotoken";
      // Save to storage for persistence
      if (typeof window !== "undefined" && window.localStorage) {
        localStorage.setItem("notesapp_user", JSON.stringify(user.value));
        localStorage.setItem("notesapp_token", token.value);
      }
      return true;
    }
    error.value = "Invalid email or password";
    return false;
  } finally {
    loading.value = false;
  }
}

/**
 * PUBLIC_INTERFACE
 * Attempts to register user, auto-logs in on success.
 */
export async function register(email: string, password: string): Promise<boolean> {
  loading.value = true;
  error.value = null;
  try {
    // TODO: replace with real API call to backend!
    // Simulated registration - allows any email/password:
    if (email && password && password.length >= 3) {
      user.value = { id: 'demo-user-1', email };
      token.value = "demotoken";
      if (typeof window !== "undefined" && window.localStorage) {
        localStorage.setItem("notesapp_user", JSON.stringify(user.value));
        localStorage.setItem("notesapp_token", token.value);
      }
      return true;
    }
    error.value = "Invalid registration data";
    return false;
  } finally {
    loading.value = false;
  }
}

/**
 * PUBLIC_INTERFACE
 * Logs out the current user.
 */
export function logout() {
  user.value = null;
  token.value = null;
  if (typeof window !== "undefined" && window.localStorage) {
    localStorage.removeItem("notesapp_user");
    localStorage.removeItem("notesapp_token");
  }
}

