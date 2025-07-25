<template>
  <div class="notes-list-page">
    <div class="page-heading">
      <h1>All Notes</h1>
      <button class="new-btn" @click="openNewNote">
        <span class="icon">＋</span> New Note
      </button>
    </div>
    <div class="search-row">
      <input v-model="searchText" type="text" placeholder="Search notes..." class="search-input" />
      <select v-model="selectedCategory" class="cat-picker">
        <option value="">All Categories</option>
        <option v-for="cat in categories" :key="cat">{{ cat }}</option>
      </select>
    </div>
    <ul class="notes-list">
      <li v-for="note in filteredNotes" :key="note.id" @click="viewNote(note.id)" tabindex="0" class="note-item">
        <div class="title-row">
          <span class="note-title">{{ note.title }}</span>
          <span class="note-cat" :style="{background: catColor(note.category)}">{{ note.category }}</span>
        </div>
        <p class="note-snippet">{{ snippet(note.content) }}</p>
        <span class="note-date">{{ note.updated_at.split('T')[0] }}</span>
      </li>
      <li v-if="filteredNotes.length === 0" class="empty-list">
        No notes found.
      </li>
    </ul>
    <NoteEditorDrawer v-if="drawerOpen" :note-id="editorId" :open="drawerOpen" @close="closeDrawer" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useNotes, useCategories } from '../composables/useNotes';
import NoteEditorDrawer from '../components/NoteEditorDrawer.vue';
const notes = useNotes();
const categories = useCategories();

const searchText = ref('');
const selectedCategory = ref('');
const drawerOpen = ref(false);
const editorId = ref<string | null>(null);

const filteredNotes = computed(() => {
  let res = notes.value;
  if (selectedCategory.value)
    res = res.filter(n => n.category === selectedCategory.value);
  if (searchText.value)
    res = res.filter(
      n =>
        n.title.toLowerCase().includes(searchText.value.toLowerCase()) ||
        n.content.toLowerCase().includes(searchText.value.toLowerCase())
    );
  return res;
});

function openNewNote() {
  editorId.value = null;
  drawerOpen.value = true;
}
function viewNote(id: string) {
  editorId.value = id;
  drawerOpen.value = true;
}
function closeDrawer() {
  drawerOpen.value = false;
}

// Color per category
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
function snippet(content: string): string {
  return content.length > 100 ? content.slice(0, 100) + "…" : content;
}
</script>

<style scoped>
.notes-list-page {
  max-width: 750px;
  margin: auto;
}

.page-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2em;
}
.page-heading h1 {
  color: var(--color-primary);
  font-size: 2rem;
}

.new-btn {
  background: var(--color-accent);
  color: #fff;
  border: none;
  padding: 0.45em 1em;
  border-radius: 7px;
  font-size: 1.1em;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5em;
}

.search-row {
  display: flex;
  gap: 1em;
  margin-bottom: 1.5em;
}

.search-input, .cat-picker {
  font-size: 1em;
  padding: 0.52em 0.9em;
  border-radius: 8px;
  border: 1.1px solid #e5e7eb;
  outline: none;
  min-width: 0;
}
.cat-picker {
  width: 170px;
}

.notes-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.note-item {
  background: #fff;
  border-radius: 9px;
  box-shadow: 0 1.5px 12px rgba(79,138,139,0.05);
  margin-bottom: 1em;
  padding: 1.45em 1.1em 1em 1.1em;
  transition: box-shadow 0.15s;
  cursor: pointer;
  border-left: 8px solid var(--color-primary);
  outline: none;
}
.note-item:focus,
.note-item:hover {
  box-shadow: 0 3.5px 18px rgba(255,89,89,0.12);
  border-color: var(--color-accent);
}
.title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 7px;
}
.note-title {
  font-weight: bold;
  font-size: 1.13em;
  color: var(--color-primary);
}
.note-cat {
  border-radius: 5px;
  padding: 0.22em 0.8em;
  color: #000;
  font-size: 0.97em;
  opacity: 0.85;
  margin-left: 1.1em;
}
.note-snippet {
  color: #333;
  margin: 0.4em 0 0.2em 0;
}
.note-date {
  font-size: 0.9em;
  color: #888;
}
.empty-list {
  text-align: center;
  color: #999;
  padding: 2em 0 1em 0;
  font-size: 1.15em;
}
</style>
