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

@Service               // 서비스 빈 등록
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BookServiceImpl implements BookService {

    //AutoWired 대신 RequiredArgsConstructor로 의존성 주입
    private final BookRepository bookRepository;
    private final UserRepository userRepository;

    // 도서 등록
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

    // 전체 조회
    @Override
    public List<BookResponse> getAllBooks() {
        return bookRepository.findAll()
                .stream()
                .map(BookResponse::new)
                .toList();
    }

    // 상세 조회
    @Override
    public BookResponse getBookById(Long id) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("책이 존재하지 않습니다. id=" + id)); //  illegalArgument에서 직접 처리한 예외로 변경
        return new BookResponse(book);
    }

    // 수정
    @Override
    @Transactional
    public BookResponse updateBook(Long id, BookCreateRequest request) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("책이 존재하지 않습니다. id=" + id)); //  illegalArgument에서 직접 처리한 예외로 변경

        book.setTitle(request.getTitle());
        book.setContent(request.getContent());
        book.setCoverImageUrl(request.getCoverImageUrl());

        // 변경감지(dirty checking)로 자동 update
        return new BookResponse(book);
    }

    // 삭제
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

    // 제목 검색 (like 검색)
    @Override
    public List<BookResponse> searchBooks(String title) {
        if (title == null || title.isBlank()) {
            return getAllBooks();
        }

        return bookRepository
                .findByTitleContainingIgnoreCase(title)
                .stream()
                .map(BookResponse::new)
                .toList();
    }
}
