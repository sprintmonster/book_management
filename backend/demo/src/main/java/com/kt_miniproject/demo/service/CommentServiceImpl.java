package com.kt_miniproject.demo.service;

import com.kt_miniproject.demo.domain.book.Book;
import com.kt_miniproject.demo.domain.comment.Comment;
import com.kt_miniproject.demo.repository.CommentRepository;
import com.kt_miniproject.demo.domain.user.User;
import com.kt_miniproject.demo.dto.comment.CommentCreateRequest;
import com.kt_miniproject.demo.dto.comment.CommentResponse;
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
@Transactional(readOnly = true)     // ⭐ 기본은 조회 트랜잭션

public class CommentServiceImpl implements CommentService {

    private final CommentRepository commentRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;

    /**
     * 댓글 생성 — 쓰기 트랜잭션 필요
     */
    @Override
    @Transactional                //  여기만 readOnly false
    public CommentResponse createComment(Long bookId, CommentCreateRequest request) {

        // 댓글 내용 검증
        if (request.getContent() == null || request.getContent().trim().isEmpty()) {
            throw new IllegalArgumentException("댓글 내용을 입력해야 합니다.");
        }
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found"));

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Comment comment = Comment.builder()
                .content(request.getContent())
                .user(user)
                .book(book)
                .build();

        comment.setBook(book);  //  너가 원래 넣은 로직 그대로 유지

        Comment saved = commentRepository.save(comment);

        return CommentResponse.builder()
                .id(saved.getId())
                .content(saved.getContent())
                .userName(user.getName())
                .bookId(book.getId())
                .createdAt(saved.getCreatedAt())
                .build();
    }
    /**
     * 댓글 조회 — 기본 readOnly 트랜잭션 사용
     */
    @Override
    public List<CommentResponse> getCommentsByBook(Long bookId) {

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new IllegalArgumentException("도서를 찾을 수 없습니다."));

        List<Comment> comments = commentRepository.findByBook(book);

        return comments.stream()
                .map(c -> CommentResponse.builder()
                        .id(c.getId())
                        .content(c.getContent())
                        .userId(c.getUser().getId())
                        .userName(c.getUser().getName())
                        .bookId(c.getBook().getId())
                        .createdAt(c.getCreatedAt())
                        .build()
                )
                .toList();
    }

    /**
     * 댓글 삭제 — 쓰기 트랜잭션 필요
     */
    @Override
    @Transactional               //  삭제도 write 트랜잭션
    public void deleteComment(Long bookId, Long commentId) {

        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found"));

        // 작성자만 삭제 가능
        if (!comment.getBook().getId().equals(bookId)) {
            throw new IllegalArgumentException("이 도서의 댓글이 아닙니다.");
        }

        commentRepository.delete(comment);
    }
}
