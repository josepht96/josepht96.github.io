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
  const [notes, setNotes] = useState<Note[]>([createNote()]);
  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Load notes from localStorage on mount
  useEffect(() => {
    const savedNotes = localStorage.getItem(`${sectionKey}-userNotes`);
    if (savedNotes) {
      let parsed: Note[] = JSON.parse(savedNotes);

      // Reset recurring tasks if it's a new day
      if (sectionKey === "recurring") {
        parsed = parsed.map((note) => ({
          ...note,
          completed: note.completedDate === today ? note.completed : false,
        }));
      }

      setNotes(parsed.length > 0 ? parsed : [createNote()]);
    }
  }, [sectionKey, today]);

  // Save notes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(`${sectionKey}-userNotes`, JSON.stringify(notes));
  }, [notes, sectionKey]);

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

  return (
    <div className="objective-group">
      <div className="objective-group-title">{title}</div>
      <div className="objective">
        <textarea
          className="text-box"
          placeholder="Type your objective here..."
        ></textarea>
        <button className="toggle-button complete"></button>
        <button className="toggle-button delete"></button>
      </div>
    </div>
  );
}
