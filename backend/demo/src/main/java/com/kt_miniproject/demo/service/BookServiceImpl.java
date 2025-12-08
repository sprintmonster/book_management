package com.kt_miniproject.demo.service;

import com.kt_miniproject.demo.domain.book.Book;
import com.kt_miniproject.demo.domain.user.User;
import com.kt_miniproject.demo.dto.book.BookCreateRequest;
import com.kt_miniproject.demo.dto.book.BookResponse;
import com.kt_miniproject.demo.exception.DeletionException;
import com.kt_miniproject.demo.exception.ResourceNotFoundException;
import com.kt_miniproject.demo.repository.BookRepository;
import com.kt_miniproject.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)   //  기본은 전체 조회 트랜잭션
public class BookServiceImpl implements BookService {

    private final BookRepository bookRepository;
    private final UserRepository userRepository;

    /**
     * 도서 등록 (쓰기 → 별도 트랜잭션)
     */
    @Override
    @Transactional
    public BookResponse createBook(BookCreateRequest request, Long loginUserId) {
        User user = userRepository.findById(loginUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found. id=" + loginUserId));

        Book book = Book.builder()
                .title(request.getTitle())
                .content(request.getContent())
                .coverImageUrl(request.getCoverImageUrl())
                .user(user)
                .build();

        Book saved = bookRepository.save(book);
        return new BookResponse(saved);
    }

    /**
     * 전체 조회 (읽기 전용)
     */
    @Override
    @Transactional(readOnly = true)
    public List<BookResponse> getAllBooks() {
        return bookRepository.findAll()
                .stream()
                .map(BookResponse::new)
                .toList();
    }

    /**
     * 상세 조회 (읽기 전용)
     */
    @Override
    @Transactional(readOnly = true)
    public BookResponse getBookById(Long id) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Book not found. id=" + id)
                );

        return new BookResponse(book);
    }

    /**
     * 수정 (쓰기 트랜잭션 + Dirty Checking)
     */
    @Override
    @Transactional  //  변경 감지를 위한 트랜잭션
    public BookResponse updateBook(Long id, BookCreateRequest request) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Book not found. id=" + id)
                );

        // Dirty Checking이 자동 update 수행
        book.setTitle(request.getTitle());
        book.setContent(request.getContent());
        book.setCoverImageUrl(request.getCoverImageUrl());

        return new BookResponse(book);
    }

    /**
     * 삭제 (쓰기 트랜잭션)
     */
    @Override
    @Transactional
    public void deleteBook(Long id,Long userId) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found"));
        // 작성자만 삭제 가능 하게 하는거
        if (!book.getUser().getId().equals(userId)) {
            throw new DeletionException("책을 삭제할 권한이 없습니다");
        }
        bookRepository.deleteById(id);
    }

    /**
     * 검색 (읽기 전용)
     */
    @Override
    @Transactional(readOnly = true)
    public List<BookResponse> searchBooks(String title) {
        if (title == null || title.isBlank()) {
            return getAllBooks();
        }

        return bookRepository.findByTitleContainingIgnoreCase(title)
                .stream()
                .map(BookResponse::new)
                .toList();
    }
}
