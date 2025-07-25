<template>
  <div class="main-wrapper" :class="{ 'sidebar-open': sidebarOpen }">
    <aside class="sidebar">
      <div class="logo">Notes</div>
      <nav class="nav">
        <NuxtLink to="/" class="nav-link" exact-active-class="active">
          <span class="icon">📝</span> All Notes
        </NuxtLink>
        <NuxtLink to="/categories" class="nav-link" exact-active-class="active">
          <span class="icon">🏷️</span> Categories
        </NuxtLink>
        <NuxtLink to="/search" class="nav-link" exact-active-class="active">
          <span class="icon">🔍</span> Search
        </NuxtLink>
      </nav>
      <div class="user-auth">
        <AuthUserPanel />
      </div>
    </aside>
    <div class="content-column">
      <header class="app-header">
        <button class="sidebar-toggle" @click="sidebarOpen = !sidebarOpen">
          <span class="icon">☰</span>
        </button>
        <span class="header-title"></span>
      </header>
      <main class="main-content">
        <NuxtPage />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const sidebarOpen = ref(false)
</script>

<style scoped>
:root {
  --color-primary: #4F8A8B;
  --color-secondary: #FBD46D;
  --color-accent: #FF5959;
  --color-bg: #fff;
  --color-text: #232c33;
  --color-fade: #f8f8f8;
}
.main-wrapper {
  display: flex;
  min-height: 100vh;
  background: var(--color-bg);
}
.sidebar {
  background: var(--color-primary);
  color: #fff;
  width: 240px;
  padding: 1.5rem 1rem;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  gap: 2rem;
  transition: width 0.2s;
}
.logo {
  font-size: 1.6rem;
  font-weight: bold;
  margin-bottom: 2rem;
  letter-spacing: 2px;
}
.nav {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.nav-link {
  color: #fff;
  text-decoration: none;
  font-weight: 500;
  display: flex;
  align-items: center;
  padding: 0.3em 0.6em;
  border-radius: 6px;
  transition: background 0.14s;
}
.nav-link .icon {
  margin-right: 0.6em;
}
.nav-link.active, .nav-link:hover {
  background: var(--color-accent);
  color: #fff;
}
.user-auth {
  margin-top: auto;
}
.content-column {
  flex: 1 1 0;
  display: flex;
  flex-direction: column;
  min-width: 0;
  background: var(--color-fade);
}
.app-header {
  display: flex;
  align-items: center;
  height: 56px;
  background: var(--color-bg);
  border-bottom: 1px solid #ececec;
  padding: 0 1rem;
  box-shadow: 0 0.5px 4px rgba(0,0,0,0.025);
}
.sidebar-toggle {
  background: transparent;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  margin-right: 0.7em;
  color: var(--color-primary);
  display: none;
}
.header-title {
  font-size: 1.1rem;
  font-weight: 500;
  color: var(--color-primary);
}
.main-content {
  flex: 1 1 0;
  padding: 2rem 1rem;
  min-height: 0;
}
/* Responsive sidebar */
@media (max-width: 900px) {
  .sidebar {
    position: fixed;
    left: -240px;
    top: 0;
    height: 100vh;
    z-index: 20;
    transition: left 0.18s;
    box-shadow: 10px 0 10px rgba(79, 138, 139, 0.06);
  }
  .main-wrapper.sidebar-open .sidebar {
    left: 0;
  }
  .sidebar-toggle {
    display: block;
  }
  .main-wrapper {
    flex-direction: column;
  }
  .content-column {
    flex: 1 1 0;
  }
}
</style>
