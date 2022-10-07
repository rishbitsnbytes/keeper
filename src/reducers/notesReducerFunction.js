import { notePriorities } from "components/Notes/note-priorities";

const notesActions = {
  INIT_NOTES: "INIT_NOTES",
  SET_NOTES: "SET_NOTES",
  RESET_NOTES: "RESET_NOTES",
  SHOW_NEW_NOTE_FORM: "SHOW_NEW_NOTE_FORM",
  SET_ARCHIVES: "SET_ARCHIVES",
  EDIT_ARCHIVES: "EDIT_ARCHIVES",
  ADD_LABEL: "ADD_LABEL",
  SORT_BY: "SORT_BY",
  FILTER_BY_LABELS: "FILTER_BY_LABELS",
  RESET_FILTERS: "RESET_FILTERS",
  RESTORE_FROM_TRASH: "RESTORE_FROM_TRASH",
  SET_TRASH: "SET_TRASH",
  FILTER_BY_PRIORITY: "FILTER_BY_PRIORITY",
  SET_NOTES_LOADER_ERROR: "SET_NOTES_LOADER_ERROR",
};

const initialNotesState = {
  notes: [],
  archives: [],
  labels: [],
  trash: [],
  notesStateLoading: true,
  notesStateError: null,
  showNewNoteForm: false,
  isEditing: null,
  editingNoteId: -1,
  sortBy: { sortByDate: "", sortByPriority: "" },
  filterByLabel: [],
  filterByPriority: notePriorities.map(({ priorityId, priority }) => ({
    id: priorityId,
    priority,
    filtered: false,
  })),
};

const notesReducerFunction = (
  prevNotesState,
  { action: { type, payload } }
) => {
  const {
    notes,
    notesStateLoading,
    notesStateError,
    showNewNoteForm,
    isEditing,
    editingNoteId,
    archives,
    labels,
    label,
    labelId,
    filterByLabel,
    sortBy,
    trash,
    filterByPriority,
  } = payload;

  switch (type) {
    case notesActions.SET_NOTES:
      return {
        ...prevNotesState,
        notes,
        trash: trash || prevNotesState.trash,
        showNewNoteForm,
        isEditing,
        editingNoteId,
      };

    case notesActions.INIT_NOTES:
      return {
        ...prevNotesState,
        notes,
        archives,
        notesStateLoading,
        notesStateError,
        showNewNoteForm,
        isEditing,
        editingNoteId,
        labels,
        trash,
      };

    case notesActions.SET_NOTES_LOADER_ERROR:
      return {
        ...prevNotesState,
        notesStateLoading,
        notesStateError,
      };

    case notesActions.RESET_NOTES:
      return initialNotesState;

    case notesActions.SHOW_NEW_NOTE_FORM:
      return {
        ...prevNotesState,
        showNewNoteForm,
        isEditing,
        editingNoteId,
      };

    case notesActions.SET_ARCHIVES:
      return { ...prevNotesState, notes, archives };

    case notesActions.EDIT_ARCHIVES:
      return {
        ...prevNotesState,
        archives,
        trash: trash || prevNotesState.trash,
        isEditing,
        editingNoteId,
        showNewNoteForm,
      };

    case notesActions.ADD_LABEL:
      return {
        ...prevNotesState,
        labels: [...prevNotesState.labels, { label, id: labelId }],
      };

    case notesActions.FILTER_BY_LABELS:
      return {
        ...prevNotesState,
        filterByLabel,
      };

    case notesActions.SORT_BY:
      return {
        ...prevNotesState,
        sortBy,
      };

    case notesActions.RESET_FILTERS:
      return {
        ...prevNotesState,
        sortBy,
        filterByLabel,
        filterByPriority,
      };

    case notesActions.RESTORE_FROM_TRASH:
      return {
        ...prevNotesState,
        notes,
        archives,
        trash,
      };

    case notesActions.SET_TRASH:
      return {
        ...prevNotesState,
        trash,
      };

    case notesActions.FILTER_BY_PRIORITY:
      return {
        ...prevNotesState,
        filterByPriority,
      };

    default:
      throw new Error("Invalid Dispatch action type!");
  }
};

export { notesReducerFunction, initialNotesState };
