import { useEffect, useState } from "react";
import { Link, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import api from "./api";

function AuthLayout({ children, title, subtitle, switchText, switchTo }) {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="brand">📚 Books App</div>
        <h1>{title}</h1>
        <p className="muted">{subtitle}</p>
        {children}
        <p className="switch">{switchText} <Link to={switchTo.path}>{switchTo.label}</Link></p>
      </div>
    </div>
  );
}

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  async function submit(e) {
    e.preventDefault();
    setError("");
    try {
      const { data } = await api.post("/auth/login", form);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Login to manage your books."
      switchText="Don't have an account?"
      switchTo={{ path: "/signup", label: "Sign up" }}
    >
      <form onSubmit={submit}>
        {error && <div className="error">{error}</div>}
        <label>Email</label>
        <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="you@example.com" required />
        <label>Password</label>
        <input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} placeholder="••••••••" required />
        <button className="primary">Login</button>
      </form>
    </AuthLayout>
  );
}

function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  async function submit(e) {
    e.preventDefault();
    setError("");
    try {
      const { data } = await api.post("/auth/signup", form);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Sign up failed");
    }
  }

  return (
    <AuthLayout
      title="Create account"
      subtitle="Sign up to start managing books."
      switchText="Already have an account?"
      switchTo={{ path: "/login", label: "Login" }}
    >
      <form onSubmit={submit}>
        {error && <div className="error">{error}</div>}
        <label>Name</label>
        <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Your name" required />
        <label>Email</label>
        <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="you@example.com" required />
        <label>Password</label>
        <input type="password" minLength="6" value={form.password} onChange={e => setForm({...form, password: e.target.value})} placeholder="At least 6 characters" required />
        <button className="primary">Create Account</button>
      </form>
    </AuthLayout>
  );
}

function Protected({ children }) {
  return localStorage.getItem("token") ? children : <Navigate to="/login" replace />;
}

function Home() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [books, setBooks] = useState([]);
  const [form, setForm] = useState({ title: "", author: "", year: "" });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  async function loadBooks() {
    try {
      const { data } = await api.get("/books");
      setBooks(data);
    } catch {
      setError("Could not load books. Check your backend.");
    }
  }

  useEffect(() => { loadBooks(); }, []);

  function logout() {
    localStorage.clear();
    navigate("/login");
  }

  async function saveBook(e) {
    e.preventDefault();
    setError("");
    try {
      if (editingId) {
        await api.put(`/books/${editingId}`, form);
      } else {
        await api.post("/books", form);
      }
      setForm({ title: "", author: "", year: "" });
      setEditingId(null);
      loadBooks();
    } catch (err) {
      setError(err.response?.data?.message || "Could not save book");
    }
  }

  function editBook(book) {
    setEditingId(book._id);
    setForm({ title: book.title, author: book.author, year: book.year });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function deleteBook(id) {
    if (!confirm("Delete this book?")) return;
    try {
      await api.delete(`/books/${id}`);
      loadBooks();
    } catch {
      setError("Could not delete book");
    }
  }

  return (
    <div className="home-page">
      <header>
        <div>
          <div className="brand">📚 Books App</div>
          <span className="welcome">Hello, {user.name || "Reader"} 👋</span>
        </div>
        <button className="logout" onClick={logout}>Logout</button>
      </header>

      <main>
        <section className="book-form card">
          <h1>{editingId ? "Edit Book" : "Add a Book"}</h1>
          <form onSubmit={saveBook} className="book-grid">
            <div>
              <label>Book Title</label>
              <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="Book title" required />
            </div>
            <div>
              <label>Author</label>
              <input value={form.author} onChange={e => setForm({...form, author: e.target.value})} placeholder="Author name" required />
            </div>
            <div>
              <label>Year</label>
              <input type="number" value={form.year} onChange={e => setForm({...form, year: e.target.value})} placeholder="2026" required />
            </div>
            <div className="actions">
              <button className="primary">{editingId ? "Update Book" : "Add Book"}</button>
              {editingId && <button type="button" className="secondary" onClick={() => { setEditingId(null); setForm({title:"", author:"", year:""}); }}>Cancel</button>}
            </div>
          </form>
          {error && <div className="error">{error}</div>}
        </section>

        <section className="card">
          <div className="section-title">
            <h2>My Books</h2>
            <span>{books.length} book{books.length === 1 ? "" : "s"}</span>
          </div>
          {books.length === 0 ? (
            <div className="empty">No books yet. Add your first book above.</div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr><th>Title</th><th>Author</th><th>Year</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {books.map(book => (
                    <tr key={book._id}>
                      <td>{book.title}</td>
                      <td>{book.author}</td>
                      <td>{book.year}</td>
                      <td className="row-actions">
                        <button className="edit" onClick={() => editBook(book)}>Edit</button>
                        <button className="delete" onClick={() => deleteBook(book._id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/" element={<Protected><Home /></Protected>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
