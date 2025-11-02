import { useState, useEffect } from "react";
import "./Objective.css";
import "../../../../app.css";

// Note type definition
interface Note {
  text: string;
  completed: boolean;
  completedDate: string;
  id: number;
}

const createNote = (
  text = "",
  completed = false,
  completedDate = ""
): Note => ({
  text,
  completed,
  completedDate,
  id: Date.now() + Math.random(),
});

interface NotesSectionProps {
  title: string;
  sectionKey: string;
}

export function ObjectiveGroup({ title, sectionKey }: NotesSectionProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Load notes from localStorage on mount
  useEffect(() => {
    const savedNotes = localStorage.getItem(`${sectionKey}-userNotes`);
    if (savedNotes) {
      try {
        let parsed: Note[] = JSON.parse(savedNotes);

        // Reset recurring tasks if it's a new day
        if (sectionKey === "recurring") {
          parsed = parsed.map((note) => ({
            ...note,
            completed: note.completedDate === today ? note.completed : false,
          }));
        }

        setNotes(parsed.length > 0 ? parsed : [createNote()]);
      } catch (error) {
        console.error("Error loading notes:", error);
        setNotes([createNote()]);
      }
    } else {
      setNotes([createNote()]);
    }
    setIsLoaded(true);
  }, [sectionKey, today]);

  // Save notes to localStorage whenever they change (only after initial load)
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(`${sectionKey}-userNotes`, JSON.stringify(notes));
    }
  }, [notes, sectionKey, isLoaded]);

  const addNewRow = () => {
    setNotes([createNote(), ...notes]);
  };

  const deleteRow = (id: number) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  const clearAll = () => {
    if (window.confirm("Are you sure you want to clear all objectives?")) {
      setNotes([createNote()]);
    }
  };

  const toggleComplete = (id: number) => {
    setNotes(
      notes.map((note) =>
        note.id === id
          ? { ...note, completed: !note.completed, completedDate: today }
          : note
      )
    );
  };

  const updateText = (id: number, text: string) => {
    setNotes(notes.map((note) => (note.id === id ? { ...note, text } : note)));
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div draggable="true" className="objective-group">
      <button className="objective-group-title" onClick={addNewRow}>
        {title}
      </button>
      {notes.map((note) => (
        <div className="objective" key={note.id}>
          <textarea
            className="text-box"
            placeholder="Type your objective here..."
            value={note.text}
            onChange={(e) => updateText(note.id, e.target.value)}
            style={{ opacity: note.completed ? 0.5 : 1 }}
          ></textarea>{" "}
          <button
            className="toggle-button complete"
            onClick={() => toggleComplete(note.id)}
          ></button>
          <button
            className="toggle-button delete"
            onClick={() => deleteRow(note.id)}
          ></button>
        </div>
      ))}
    </div>
  );
}
