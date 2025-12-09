package com.kt_miniproject.demo.controller;

import com.kt_miniproject.demo.dto.book.BookCreateRequest;
import com.kt_miniproject.demo.dto.book.BookResponse;
import com.kt_miniproject.demo.service.BookService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/books")   // 전체 prefix
@RequiredArgsConstructor
public class BookController {

    private final BookService bookService;

    // 1. 도서 등록 (Create)
    @PostMapping
    public ResponseEntity<BookResponse> createBook(
            @RequestBody BookCreateRequest request) {

        BookResponse response = bookService.createBook(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // 2. 도서 목록 조회 + 제목 검색 (Read List)
    // GET /api/books         -> 전체 목록
    // GET /api/books?title=별 -> 제목 검색
    @GetMapping
    public ResponseEntity<List<BookResponse>> getBooks(
            @RequestParam(required = false) String title) {

        List<BookResponse> books = bookService.searchBooks(title);
        return ResponseEntity.ok(books);
    }

    // 3. 도서 상세 조회 (Read One)
    // GET /api/books/{id}
    @GetMapping("/{id}")
    public ResponseEntity<BookResponse> getBook(@PathVariable Long id) {
        BookResponse response = bookService.getBookById(id);
        return ResponseEntity.ok(response);
    }

    // 4. 도서 수정 (Update)
    // PUT /api/books/{id}
    @PutMapping("/{id}")
    public ResponseEntity<BookResponse> updateBook(
            @PathVariable Long id,
            @RequestBody BookCreateRequest request) {

        BookResponse response = bookService.updateBook(id, request);
        return ResponseEntity.ok(response);
    }

    // 5. 도서 삭제 (Delete)
    // DELETE /api/books/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBook(@PathVariable("id") Long id,
                                           @RequestParam("userId") Long userId) {
        bookService.deleteBook(id,userId);
        return ResponseEntity.noContent().build();   // 204 응답
    }


    // BookController.java

    @PutMapping("/{id}/cover-image")
    public ResponseEntity<BookResponse> updateBookCoverUrl(
            @PathVariable Long id,
            @RequestBody Map<String, String> requests) { // json형태로 url 입력
        String imageUrl = requests.get("ImageUrl");
        if (imageUrl == null || imageUrl.isBlank()) {
            throw new IllegalArgumentException("이미지 URL 값이 없습니다.");
        }

        BookResponse response = bookService.updateBookCoverUrl(id, imageUrl);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/generate-image")
    public ResponseEntity<String> generateAiImageUrl(
            @PathVariable Long id) {
        String bookUrl = bookService.generateAiImageUrl(id);
        return ResponseEntity.ok(bookUrl);
    }
}
