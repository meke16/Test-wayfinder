import React, { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { request } from "@/api/client";
import * as studentsApi from "@/api/routes/students/index";


interface Student {
  id: number;
  name: string;
  grade: string;
}

const StudentCRUD: React.FC = () => {
  // --- STATE ---
  const [studentList, setStudentList] = useState<Array<Student>>([]); // Renamed from students
  const [name, setName] = useState<string>("");
  const [grade, setGrade] = useState<string>("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // --- API ACTIONS ---

  const fetchStudents = async () => {
    setLoading(true);
    setError("");
    try {
      // Use the Wayfinder index route
      const result = await request<Array<Student>>(studentsApi.index());
      setStudentList(result);
    } catch (err: any) {
      setError(err.message || "Failed to fetch students from Laravel.");
      console.error("Fetch failed", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      if (editingId) {
        // Wayfinder update: studentsApi.update(id)
        const route = studentsApi.update(editingId);
        await request(route, { name, grade });
      } else {
        // Wayfinder store: studentsApi.store()
        await request(studentsApi.store(), { name, grade });
      }
      
      // Success Cleanup
      setName(""); 
      setGrade(""); 
      setEditingId(null);
      fetchStudents();
    } catch (err: any) {
      setError(err.message || "Error saving record. Check validation.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("🗑️ Are you sure you want to delete this student?")) return;
    
    setError("");
    try {
      // Wayfinder destroy: studentsApi.destroy(id)
      await request(studentsApi.destroy(id));
      fetchStudents();
    } catch (err: any) {
      setError(err.message || "Delete failed.");
    }
  };

  const handleEdit = (student: Student) => {
    setName(student.name);
    setGrade(student.grade);
    setEditingId(student.id);
    setError("");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // --- MODERN INLINE STYLES ---
  const s = {
    wrapper: {
      minHeight: "100vh",
      backgroundColor: "#f8fafc",
      padding: "40px 20px",
      fontFamily: "'Inter', system-ui, sans-serif",
      color: "#1e293b"
    },
    card: {
      maxWidth: "1200px",
      margin: "0 auto",
      backgroundColor: "#ffffff",
      borderRadius: "16px",
      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05)",
      padding: "32px",
      border: "1px solid #e2e8f0"
    },
    title: {
      fontSize: "24px",
      fontWeight: "800",
      marginBottom: "24px",
      color: "#0f172a",
      letterSpacing: "-0.5px"
    },
    form: {
      display: "flex",
      gap: "12px",
      marginBottom: "32px",
      flexWrap: "wrap" as const
    },
    input: {
      flex: 1,
      minWidth: "200px",
      padding: "12px 16px",
      borderRadius: "8px",
      border: "1px solid #cbd5e1",
      fontSize: "14px",
      outline: "none",
      backgroundColor: "#ffffff"
    },
    btnPrimary: {
      padding: "12px 24px",
      backgroundColor: "#4f46e5",
      color: "white",
      border: "none",
      borderRadius: "8px",
      fontWeight: "600",
      cursor: "pointer",
      opacity: loading ? 0.7 : 1
    },
    btnCancel: {
      padding: "12px 20px",
      backgroundColor: "#f1f5f9",
      color: "#64748b",
      border: "none",
      borderRadius: "8px",
      fontWeight: "600",
      cursor: "pointer"
    },
    table: {
      width: "100%",
      borderCollapse: "separate" as const,
      borderSpacing: "0"
    },
    th: {
      textAlign: "left" as const,
      padding: "12px 16px",
      backgroundColor: "#f1f5f9",
      color: "#64748b",
      fontSize: "12px",
      textTransform: "uppercase" as const,
      fontWeight: "700",
      borderBottom: "2px solid #e2e8f0"
    },
    td: {
      padding: "16px",
      borderBottom: "1px solid #f1f5f9",
      fontSize: "14px"
    },
    actionBtn: {
      padding: "6px 12px",
      fontSize: "12px",
      borderRadius: "6px",
      border: "none",
      cursor: "pointer",
      fontWeight: "600",
      marginRight: "8px"
    },
    error: {
      backgroundColor: "#fef2f2",
      color: "#b91c1c",
      padding: "12px",
      borderRadius: "8px",
      marginBottom: "20px",
      fontSize: "14px",
      border: "1px solid #fee2e2"
    },
    loadingBar: {
      height: "3px",
      backgroundColor: "#4f46e5",
      width: loading ? "100%" : "0%",
      transition: "width 0.3s ease",
      marginBottom: "10px"
    }
  };

  return (
    <div style={s.wrapper}>
      <div style={s.card}>
        <h2 style={s.title}>👨‍🎓 Student Management</h2>
        
        <div style={s.loadingBar}></div>

        {error && <div style={s.error}>⚠️ {error}</div>}

        <form onSubmit={handleSubmit} style={s.form}>
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={loading}
            style={s.input}
          />
          <input
            type="text"
            placeholder="Grade (e.g. 10th)"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            required
            disabled={loading}
            style={s.input}
          />
          <button type="submit" disabled={loading} style={s.btnPrimary}>
            {editingId ? "Update Student" : "Add Student"}
          </button>
          {editingId && (
            <button 
              type="button" 
              onClick={() => { setEditingId(null); setName(""); setGrade(""); }} 
              style={s.btnCancel}
            >
              Cancel
            </button>
          )}
        </form>

        <div style={{ overflowX: "auto" }}>
          <table style={s.table}>
            <thead>
              <tr>
                <th style={{ ...s.th, borderRadius: "8px 0 0 0" }}>#</th>
                <th style={s.th}>Name</th>
                <th style={s.th}>Grade</th>
                <th style={{ ...s.th, borderRadius: "0 8px 0 0" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {studentList.length > 0 ? (
                studentList.map((st, index) => (
                 
                  <tr key={st.id}>
                    <td style={s.td}>
                      <span style={{ color: "#94a3b8", fontWeight: "bold" }}>#{index + 1}</span>
                    </td>
                    <td style={{ ...s.td, fontWeight: "600" }}>{st.name}</td>
                    <td style={s.td}>
                       <span style={{ backgroundColor: "#e0e7ff", color: "#4338ca", padding: "4px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "bold" }}>
                        {st.grade}
                       </span>
                    </td>
                    <td style={s.td}>
                      <button 
                        style={{ ...s.actionBtn, backgroundColor: "#eff6ff", color: "#2563eb" }} 
                        onClick={() => handleEdit(st)}
                      >
                        Edit
                      </button>
                      <button 
                        style={{ ...s.actionBtn, backgroundColor: "#fff1f2", color: "#e11d48" }} 
                        onClick={() => handleDelete(st.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} style={{ ...s.td, textAlign: "center", padding: "40px", color: "#94a3b8" }}>
                    {loading ? "Syncing with Laravel..." : "No students recorded yet."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentCRUD;