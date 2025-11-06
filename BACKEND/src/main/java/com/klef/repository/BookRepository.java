package com.klef.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.klef.entity.Book;

public interface BookRepository extends JpaRepository<Book, Integer> {
}
