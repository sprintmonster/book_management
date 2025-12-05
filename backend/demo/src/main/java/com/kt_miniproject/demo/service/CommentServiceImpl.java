package com.kt_miniproject.demo.service;

import com.kt_miniproject.demo.domain.book.Book;
import com.kt_miniproject.demo.domain.comment.Comment;
import com.kt_miniproject.demo.repository.CommentRepository;
import com.kt_miniproject.demo.domain.user.User;
import com.kt_miniproject.demo.dto.comment.CommentCreateRequest;
import com.kt_miniproject.demo.dto.comment.CommentResponse;
import com.kt_miniproject.demo.repository.BookRepository;
import com.kt_miniproject.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService {

    private final CommentRepository commentRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;

    @Override
    public CommentResponse createComment(Long bookId, Long userId, CommentCreateRequest request) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new IllegalArgumentException("도서를 찾을 수 없습니다."));

        Comment comment = Comment.builder()
                .content(request.getContent())
                .user(user)
                .book(book)
                .build();

        // 양방향일 때 Book.comments에도 추가하고 싶으면
        comment.setBook(book);   // setBook 안에서 book.getComments().add(this) 해주는 형태

        Comment saved = commentRepository.save(comment);

        return CommentResponse.builder()
                .id(saved.getId())
                .content(saved.getContent())
                .userId(user.getId())
                .userName(user.getName())          // User 엔티티의 필드명에 맞게 수정
                .bookId(book.getId())
                .createdAt(saved.getCreatedAt())   // BaseTimeEntity 쓰면 거기에서 가져오기
                .build();
    }

    @Override
    public List<CommentResponse> getComments(Long bookId) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new IllegalArgumentException("도서를 찾을 수 없습니다."));

        List<Comment> comments = commentRepository.findByBook(book);

        return comments.stream()
                .map(c -> CommentResponse.builder()
                        .id(c.getId())
                        .content(c.getContent())
                        .userId(c.getUser().getId())
                        .userName(c.getUser().getName())
                        .bookId(c.getId())
                        .createdAt(c.getCreatedAt())
                        .build()
                )
                .toList();
    }

    @Override
    public void deleteComment(Long bookId, Long commentId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("댓글을 찾을 수 없습니다."));

        if (!comment.getBook().getId().equals(bookId)) {
            throw new IllegalArgumentException("이 도서의 댓글이 아닙니다.");
        }

        commentRepository.delete(comment);
    }
}
