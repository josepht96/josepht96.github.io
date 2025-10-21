import { useState, useEffect } from 'react';

// Note type definition
interface Note {
  text: string;
  completed: boolean;
  completedDate: string;
  id: number;
}

const createNote = (text = '', completed = false, completedDate = ''): Note => ({
  text,
  completed,
  completedDate,
  id: Date.now() + Math.random()
});

interface NotesSectionProps {
  title: string;
  sectionKey: string;
}

const NotesSection = ({ title, sectionKey }: NotesSectionProps) => {
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
      if (sectionKey === 'recurring') {
        parsed = parsed.map(note => ({
          ...note,
          completed: note.completedDate === today ? note.completed : false
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
    setNotes(notes.filter(note => note.id !== id));
  };

  const clearAll = () => {
    if (window.confirm("Are you sure you want to clear all objectives?")) {
      setNotes([createNote()]);
    }
  };

  const toggleComplete = (id: number) => {
    setNotes(notes.map(note => 
      note.id === id 
        ? { ...note, completed: !note.completed, completedDate: today }
        : note
    ));
  };

  const updateText = (id: number, text: string) => {
    setNotes(notes.map(note => 
      note.id === id ? { ...note, text } : note
    ));
  };

  return (
    <div style={styles.notesSection}>
      <h2>{title}</h2>
      <div style={styles.buttonContainer}>
        <button style={styles.addRowBtn} onClick={addNewRow}>
          + Add Row
        </button>
        <button style={styles.clearAllBtn} onClick={clearAll}>
          Clear All
        </button>
      </div>
      <div>
        {notes.map((note) => (
          <div key={note.id} style={styles.textRow}>
            <div style={styles.checkboxContainer}>
              <input
                type="checkbox"
                style={styles.checkbox}
                checked={note.completed}
                onChange={() => toggleComplete(note.id)}
              />
            </div>
            <textarea
              style={{
                ...styles.textBox,
                ...(note.completed ? styles.textBoxCompleted : {})
              }}
              placeholder="Type your objective here..."
              value={note.text}
              onChange={(e) => updateText(note.id, e.target.value)}
            />
            <button 
              style={styles.deleteBtn}
              onClick={() => deleteRow(note.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function ObjectivesTracker() {
  return (
    <div style={styles.body}>
      <NotesSection title="Day Objectives" sectionKey="short" />
      <NotesSection title="Daily, Recurring Objectives (resets daily)" sectionKey="recurring" />
      <NotesSection title="Long Term Objectives" sectionKey="long" />
    </div>
  );
}

const styles = {
  body: {
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    marginLeft: '25%',
    marginRight: '25%',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f0f0f0',
  },
  notesSection: {
    marginTop: '40px',
    padding: '20px',
    backgroundColor: 'rgb(227, 227, 227)',
    borderRadius: '8px',
  },
  buttonContainer: {
    display: 'flex',
    gap: '10px',
    marginBottom: '15px',
  },
  addRowBtn: {
    backgroundColor: '#718eac',
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    fontSize: '14px',
    cursor: 'pointer',
  },
  clearAllBtn: {
    backgroundColor: '#b58e92',
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    fontSize: '14px',
    cursor: 'pointer',
  },
  textRow: {
    marginBottom: '15px',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
  },
  checkboxContainer: {
    paddingTop: '18px',
  },
  checkbox: {
    width: '20px',
    height: '20px',
    cursor: 'pointer',
    accentColor: 'rgb(119, 125, 171)',
  },
  textBox: {
    flex: 1,
    padding: '12px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    fontFamily: 'Arial, sans-serif',
    fontSize: '14px',
    boxSizing: 'border-box',
    resize: 'vertical',
    minHeight: '40px',
  } as React.CSSProperties,
  textBoxCompleted: {
    opacity: 0.4,
  },
  deleteBtn: {
    background: 'rgb(208, 206, 206)',
    color: 'white',
    padding: '6px 6px',
    border: 'none',
    borderRadius: '5px',
    fontSize: '14px',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  } as React.CSSProperties,
};