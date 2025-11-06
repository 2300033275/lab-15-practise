package com.klef.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.klef.entity.Book;
import com.klef.repository.BookRepository;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/bookapi")
@CrossOrigin(origins = "http://localhost:5174") // frontend
public class BookController {

    @Autowired
    private BookRepository repo;

    // Get all books
    @GetMapping("/all")
    public List<Book> getAllBooks() {
        return repo.findAll();
    }

    // Get book by ID
    @GetMapping("/{id}")
    public Book getBookById(@PathVariable int id) {
        Optional<Book> book = repo.findById(id);
        return book.orElse(null);
    }

    // Add book
    @PostMapping("/add")
    public Book addBook(@RequestBody Book book) {
        System.out.println("📌 Adding book: " + book.getTitle());
        return repo.save(book);
    }

    // Update book
    @PutMapping("/update/{id}")
    public Book updateBook(@PathVariable int id, @RequestBody Book bookDetails) {
        return repo.findById(id).map(book -> {
            book.setTitle(bookDetails.getTitle());
            book.setAuthor(bookDetails.getAuthor());
            book.setPublisher(bookDetails.getPublisher());
            book.setYear(bookDetails.getYear());
            book.setGenre(bookDetails.getGenre());
            return repo.save(book);
        }).orElse(null);
    }

    // Delete book
    @DeleteMapping("/delete/{id}")
    public String deleteBook(@PathVariable int id) {
        repo.deleteById(id);
        return "Book deleted with id " + id;
    }
}
