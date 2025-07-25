<template>
  <div class="search-page">
    <h1>Search Notes</h1>
    <input
      v-model="searchTerm"
      class="search-in"
      type="text"
      placeholder="Start typing to search notes..."
      autofocus
    />
    <ul class="results-list">
      <li
        v-for="note in filteredNotes"
        :key="note.id"
        @click="viewNote(note.id)"
        class="result-item"
        tabindex="0"
      >
        <div class="row">
          <span class="title">{{ note.title }}</span>
          <span class="cat" :style="{background: catColor(note.category)}">{{ note.category }}</span>
        </div>
        <div class="snippet">{{ snippet(note.content) }}</div>
      </li>
      <li v-if="filteredNotes.length === 0" class="none">No results.</li>
    </ul>
    <NoteEditorDrawer v-if="drawerOpen" :note-id="editorId" :open="drawerOpen" @close="closeDrawer" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useNotes, useCategories } from '../composables/useNotes';
import NoteEditorDrawer from '../components/NoteEditorDrawer.vue';
const searchTerm = ref('');
const notes = useNotes();
const categories = useCategories();
const drawerOpen = ref(false);
const editorId = ref<string | null>(null);

const filteredNotes = computed(() => {
  if (!searchTerm.value.trim()) return notes.value;
  return notes.value.filter(
    n =>
      n.title.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      n.content.toLowerCase().includes(searchTerm.value.toLowerCase())
  );
});
function snippet(content: string): string {
  return content.length > 100 ? content.slice(0, 100) + "…" : content;
}
function viewNote(id: string) {
  editorId.value = id;
  drawerOpen.value = true;
}
function closeDrawer() {
  drawerOpen.value = false;
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
.search-page {
  max-width: 690px;
  margin: auto;
}
h1 {
  color: var(--color-primary);
}
.search-in {
  width: 100%;
  border-radius: 9px;
  border: 1.5px solid #e8e8e8;
  font-size: 1.16em;
  margin: 1.2em 0 2.5em 0;
  padding: 0.7em 1em;
  background: #fff;
}
.results-list {
  padding: 0;
  margin: 0;
  list-style: none;
}
.result-item {
  background: #fff;
  margin-bottom: 0.9em;
  border-radius: 10px;
  box-shadow: 0 1.5px 13px rgba(79,138,139,0.06);
  padding: 1.3em 1em;
  cursor: pointer;
  outline: none;
  border-left: 8px solid var(--color-primary);
  transition: box-shadow 0.13s, border-color 0.13s;
}
.result-item:focus, .result-item:hover {
  box-shadow: 0 3.5px 18px rgba(255,89,89,0.12);
  border-color: var(--color-accent);
}
.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.title {
  font-weight: bold;
  color: var(--color-primary);
  font-size: 1.1em;
}
.cat {
  border-radius: 5px;
  padding: 0.2em 0.7em;
  color: #000;
  font-size: 0.96em;
  opacity: 0.85;
  margin-left: 1em;
}
.snippet {
  color: #272727;
  margin: 0.3em 0 0.12em 0;
}
.none {
  text-align: center;
  color: #999;
  padding: 2em 0 1em 0;
  font-size: 1.15em;
}
</style>
