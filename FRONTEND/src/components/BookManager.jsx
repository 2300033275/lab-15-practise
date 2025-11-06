import { useState, useEffect } from "react";
import axios from "axios";
import "./style.css";
function BookManager() {
  const baseUrl = `${import.meta.env.VITE_API_URL}/bookapi`;

  const [books, setBooks] = useState([]);
  const [form, setForm] = useState({
    id: "",
    title: "",
    author: "",
    publisher: "",
    year: "",
    genre: "",
  });
  const [searchId, setSearchId] = useState("");
  const [searchedBook, setSearchedBook] = useState(null);
  const [message, setMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  // Load all books
  const loadBooks = async () => {
    try {
      const res = await axios.get(`${baseUrl}/all`);
      setBooks(res.data);
    } catch (err) {
      console.error("Error loading books:", err);
    }
  };

  useEffect(() => {
    loadBooks();
  }, []);

  // Handle form change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add book
  const handleAddBook = async () => {
    if (!form.id || !form.title) {
      setMessage("❌ Please enter at least ID and Title");
      return;
    }
    try {
      const newBook = { ...form, year: Number(form.year) };
      await axios.post(`${baseUrl}/add`, newBook);
      setMessage("✅ Book added successfully!");
      resetForm();
      loadBooks();
    } catch (err) {
      console.error("Error adding book:", err);
    }
  };

  // Delete book
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${baseUrl}/delete/${id}`);
      setMessage("🗑️ Book deleted!");
      loadBooks();
    } catch (err) {
      console.error("Error deleting book:", err);
    }
  };

  // Fetch book by ID
  const handleFetch = async () => {
    try {
      const res = await axios.get(`${baseUrl}/${searchId}`);
      setSearchedBook(res.data);
      if (!res.data) setMessage("❌ No book found with this ID!");
    } catch {
      setSearchedBook(null);
      setMessage("❌ No book found with this ID!");
    }
  };

  // Start editing
  const handleEdit = (book) => {
    setForm(book);
    setIsEditing(true);
  };

  // Update book
  const handleUpdateBook = async () => {
    try {
      const updatedBook = { ...form, year: Number(form.year) };
      await axios.put(`${baseUrl}/update/${form.id}`, updatedBook);
      setMessage("✏️ Book updated successfully!");
      resetForm();
      setIsEditing(false);
      loadBooks();
    } catch (err) {
      console.error("Error updating book:", err);
    }
  };

  // Reset form
  const resetForm = () => {
    setForm({
      id: "",
      title: "",
      author: "",
      publisher: "",
      year: "",
      genre: "",
    });
  };

  return (
    <div className="library-container">
      <h2>📚 Library Management System</h2>

      {message && <div className="message">{message}</div>}

      {/* Add/Edit Book Form */}
      <div className="form-grid">
        <input name="id" placeholder="ID" value={form.id} onChange={handleChange} disabled={isEditing} />
        <input name="title" placeholder="Title" value={form.title} onChange={handleChange} />
        <input name="author" placeholder="Author" value={form.author} onChange={handleChange} />
        <input name="publisher" placeholder="Publisher" value={form.publisher} onChange={handleChange} />
        <input name="year" placeholder="Year" value={form.year} onChange={handleChange} />
        <input name="genre" placeholder="Genre" value={form.genre} onChange={handleChange} />
      </div>
      <div className="btn-group">
        {isEditing ? (
          <>
            <button className="btn-green" onClick={handleUpdateBook}>Update Book</button>
            <button className="btn-gray" onClick={() => { resetForm(); setIsEditing(false); }}>Cancel</button>
          </>
        ) : (
          <button className="btn-blue" onClick={handleAddBook}>Add Book</button>
        )}
      </div>

      {/* Fetch Book By ID */}
      <div className="fetch-section">
        <h3>🔍 Get Book By ID</h3>
        <input placeholder="Enter Book ID" value={searchId} onChange={(e) => setSearchId(e.target.value)} />
        <button className="btn-blue" onClick={handleFetch}>Fetch</button>

        {searchedBook && (
          <div className="searched-book">
            <p><b>ID:</b> {searchedBook.id}</p>
            <p><b>Title:</b> {searchedBook.title}</p>
            <p><b>Author:</b> {searchedBook.author}</p>
            <p><b>Publisher:</b> {searchedBook.publisher}</p>
            <p><b>Year:</b> {searchedBook.year}</p>
            <p><b>Genre:</b> {searchedBook.genre}</p>
          </div>
        )}
      </div>

      {/* All Books Table */}
      <h3>📖 All Books</h3>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>ID</th><th>Title</th><th>Author</th>
              <th>Publisher</th><th>Year</th><th>Genre</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.length === 0 ? (
              <tr><td colSpan="7">No books available</td></tr>
            ) : (
              books.map((book) => (
                <tr key={book.id}>
                  <td>{book.id}</td>
                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  <td>{book.publisher}</td>
                  <td>{book.year}</td>
                  <td>{book.genre}</td>
                  <td>
                    <button className="btn-yellow" onClick={() => handleEdit(book)}>Edit</button>
                    <button className="btn-red" onClick={() => handleDelete(book.id)}>Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default BookManager;
