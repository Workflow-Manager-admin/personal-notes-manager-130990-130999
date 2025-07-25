<template>
  <div class="categories-page">
    <h1>Categories</h1>
    <form @submit.prevent="addCat" class="cat-form">
      <input v-model="newCat" type="text" placeholder="New category..." maxlength="25" />
      <button type="submit">Add</button>
    </form>
    <ul class="cat-list">
      <li v-for="cat in categories" :key="cat">
        <span class="cat-dot" :style="{background: catColor(cat)}"></span>
        <span class="name">{{ cat }}</span>
        <button
          v-if="cat !== 'General'"
          class="del-btn"
          @click="deleteCat(cat)"
        >
          Delete
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useCategories, addCategory, deleteCategory } from '../composables/useNotes';

const categories = useCategories();
const newCat = ref('');

function addCat() {
  const name = newCat.value.trim();
  if (name && !categories.value.includes(name) && name.length < 25) {
    addCategory(name);
    newCat.value = '';
  }
}
function deleteCat(cat: string) {
  if (confirm(`Delete category '${cat}'? This will move notes in this category to 'General'.`)) {
    deleteCategory(cat);
  }
}
function catColor(cat: string): string {
  const cats = categories.value;
  const idx = cats.indexOf(cat);
  const palette = [
    "var(--color-secondary)",
    "#B8D8D8",
    "#fcbf49",
    "#ffbcaf",
    "#95e1d3",
    "var(--color-primary)"
  ];
  return palette[idx % palette.length] || "var(--color-secondary)";
}
</script>

<style scoped>
.categories-page {
  max-width: 480px;
  margin: 2em auto;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2.5px 20px rgba(79,138,139,0.09);
  padding: 2.1em 2em 1.2em 2em;
}
h1 {
  margin-top: 0;
  color: var(--color-primary);
}
.cat-form {
  display: flex;
  gap: 0.9em;
  margin-bottom: 1.5em;
}
.cat-form input {
  flex: 1 1 0px;
  font-size: 1em;
  border-radius: 8px;
  border: 1.1px solid #e5e7eb;
  padding: 0.48em 1em;
}
.cat-form button {
  background: var(--color-accent);
  color: #fff;
  border: none;
  border-radius: 7px;
  font-size: 1em;
  padding: 0.54em 1.12em;
  cursor: pointer;
}
.cat-list {
  margin: 0;
  padding: 0;
  list-style: none;
}
.cat-list li {
  display: flex;
  align-items: center;
  gap: 1em;
  font-size: 1.1em;
  margin-bottom: 0.7em;
}
.cat-dot {
  width: 1.25em;
  height: 1.25em;
  border-radius: 50%;
  display: inline-block;
  margin-right: 0.2em;
}
.del-btn {
  border: none;
  background: var(--color-accent);
  color: #fff;
  border-radius: 5px;
  font-size: 0.9em;
  margin-left: 1.3em;
  padding: 4px 13px 4px 13px;
  cursor: pointer;
  transition: background 0.13s;
}
.del-btn:hover {
  background: #cc1e1e;
}
.name {
  min-width: 70px;
}
</style>
