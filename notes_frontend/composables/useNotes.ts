import { ref, computed, watch } from "vue";

export interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
  created_at: string;
  updated_at: string;
}

const notes = ref<Note[]>(getSavedNotes());
const categories = ref<string[]>(getSavedCategories());

function getSavedNotes(): Note[] {
  if (typeof window !== "undefined" && window.localStorage) {
    const n = localStorage.getItem("notesapp_notes");
    return n ? JSON.parse(n) : [];
  }
  return [];
}
function getSavedCategories(): string[] {
  if (typeof window !== "undefined" && window.localStorage) {
    const c = localStorage.getItem("notesapp_categories");
    return c ? JSON.parse(c) : [];
  }
  return ["General", "Work", "Ideas"];
}

function saveNotes() {
  if (typeof window !== "undefined" && window.localStorage) {
    localStorage.setItem("notesapp_notes", JSON.stringify(notes.value));
  }
}
function saveCategories() {
  if (typeof window !== "undefined" && window.localStorage) {
    localStorage.setItem("notesapp_categories", JSON.stringify(categories.value));
  }
}

/**
 * PUBLIC_INTERFACE
 * Returns all notes sorted by updated_at desc.
 */
export function useNotes() {
  return computed(() =>
    notes.value.slice().sort((a, b) => b.updated_at.localeCompare(a.updated_at))
  );
}

/**
 * PUBLIC_INTERFACE
 * Returns all categories.
 */
export function useCategories() {
  return computed(() => categories.value);
}

/**
 * PUBLIC_INTERFACE
 * Creates a new note.
 */
export function createNote(title: string, content: string, category: string) {
  const n: Note = {
    id: `note-${Date.now()}-${Math.floor(1000 + Math.random()*8999)}`,
    title,
    content,
    category,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  notes.value.push(n);
  saveNotes();
}

/**
 * PUBLIC_INTERFACE
 * Updates a note by id.
 */
export function updateNote(id: string, title: string, content: string, category: string) {
  const idx = notes.value.findIndex(n => n.id === id);
  if (idx > -1) {
    notes.value[idx] = {
      ...notes.value[idx],
      title,
      content,
      category,
      updated_at: new Date().toISOString(),
    };
    saveNotes();
  }
}

/**
 * PUBLIC_INTERFACE
 * Deletes a note.
 */
export function deleteNote(id: string) {
  const idx = notes.value.findIndex(n => n.id === id);
  if (idx > -1) {
    notes.value.splice(idx, 1);
    saveNotes();
  }
}

/**
 * PUBLIC_INTERFACE
 * Find a note by ID.
 */
export function getNoteById(id: string): Note | undefined {
  return notes.value.find(n => n.id === id);
}

/**
 * PUBLIC_INTERFACE
 * Returns notes matching search string in title or content.
 */
export function searchNotes(term: string) {
  const lc = term.trim().toLowerCase();
  if (!lc) return notes.value.slice();
  return notes.value.filter(n =>
    n.title.toLowerCase().includes(lc) ||
    n.content.toLowerCase().includes(lc)
  );
}

/**
 * PUBLIC_INTERFACE
 * Adds a new category.
 */
export function addCategory(name: string) {
  if (!categories.value.includes(name)) {
    categories.value.push(name);
    saveCategories();
  }
}

/**
 * PUBLIC_INTERFACE
 * Deletes a category (and removes it from notes).
 */
export function deleteCategory(name: string) {
  categories.value = categories.value.filter(c => c !== name);
  notes.value.forEach(n => {
    if (n.category === name) n.category = "General";
  });
  saveCategories();
  saveNotes();
}

/* Re-save on changes */
watch(notes, saveNotes, { deep: true });
watch(categories, saveCategories, { deep: true });
