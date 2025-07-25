<template>
  <div class="drawer-mask" @click.self="onClose">
    <div class="drawer">
      <h2>{{ noteId ? 'Edit Note' : 'New Note' }}</h2>
      <form @submit.prevent="saveNote">
        <label>
          Title
          <input v-model="title" type="text" placeholder="Untitled" maxlength="60" required />
        </label>
        <label>
          Content
          <textarea v-model="content" rows="7" placeholder="Your note..." required></textarea>
        </label>
        <label>
          Category
          <select v-model="category">
            <option v-for="cat in categories" :key="cat">{{ cat }}</option>
          </select>
        </label>
        <div class="actions-row">
          <button type="submit" class="save-btn">{{ noteId ? 'Update' : 'Create' }}</button>
          <button v-if="noteId" type="button" class="delete-btn" @click="deleteCurrentNote">Delete</button>
          <button type="button" @click="onClose" class="outline">Cancel</button>
        </div>
      </form>
      <div v-if="noteId" class="note-meta">
        Updated: {{ note?.updated_at.split('T')[0] }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, defineProps, defineEmits } from "vue";
import { useNotes, createNote, updateNote, deleteNote, getNoteById, useCategories } from "../composables/useNotes";
const props = defineProps<{ noteId?: string | null, open: boolean }>();
const emit = defineEmits<{
  (e: 'close'): void;
}>();

const title = ref("");
const content = ref("");
const category = ref("General");
const note = computed(() => props.noteId ? getNoteById(props.noteId) : null);
const categories = useCategories();

watch(
  () => props.noteId,
  (id) => {
    if (id && note.value) {
      title.value = note.value.title;
      content.value = note.value.content;
      category.value = note.value.category;
    } else {
      title.value = "";
      content.value = "";
      category.value = categories.value[0] || "General";
    }
  },
  { immediate: true }
);

function saveNote() {
  if (!title.value.trim() || !content.value.trim()) return;
  if (props.noteId) {
    updateNote(props.noteId, title.value, content.value, category.value);
  } else {
    createNote(title.value, content.value, category.value);
  }
  emit("close");
}
function onClose() {
  emit("close");
}
function deleteCurrentNote() {
  if (props.noteId) {
    if (confirm("Delete this note permanently?")) {
      deleteNote(props.noteId);
      emit("close");
    }
  }
}
</script>

<style scoped>
.drawer-mask {
  position: fixed;
  z-index: 50;
  top: 0; left: 0; width: 100vw; height: 100vh;
  background: rgba(62, 87, 89, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
}
.drawer {
  background: #fff;
  border-radius: 12px;
  min-width: 340px;
  width: 100%;
  max-width: 525px;
  box-shadow: 0 10px 34px 6px rgba(79,138,139,0.09);
  padding: 2.2em 2em 1.1em 2em;
}
h2 {
  margin-top: 0;
  font-size: 1.36em;
  color: var(--color-primary);
}
label {
  display: flex;
  flex-direction: column;
  gap: 0.4em;
  font-weight: 500;
  margin: 0.6em 0;
}
input, textarea, select {
  margin-top: 0.13em;
  border: 1.1px solid #ebebeb;
  border-radius: 7px;
  font-size: 1em;
  padding: 0.64em 0.7em;
  background: #f8f8f8;
  outline: none;
  color: #2d2d36;
}
textarea {
  resize: vertical;
}
.actions-row {
  display: flex;
  gap: 1em;
  margin-top: 1.1em;
}
button {
  background: var(--color-primary);
  color: #fff;
  border: none;
  border-radius: 7px;
  padding: 0.65em 1.4em;
  font-size: 1em;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.14s;
}
.save-btn {
  background: var(--color-secondary);
  color: #222;
}
.delete-btn {
  background: var(--color-accent);
}
button.outline {
  background: transparent;
  color: var(--color-primary);
  border: 1.5px solid var(--color-primary);
}
.note-meta {
  margin-top: 1.9em;
  font-size: 0.93em;
  color: #888;
}
</style>
