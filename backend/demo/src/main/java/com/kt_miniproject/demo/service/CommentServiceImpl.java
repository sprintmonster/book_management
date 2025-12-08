package com.kt_miniproject.demo.service;

import com.kt_miniproject.demo.domain.book.Book;
import com.kt_miniproject.demo.domain.comment.Comment;
import com.kt_miniproject.demo.domain.user.User;
import com.kt_miniproject.demo.dto.comment.CommentCreateRequest;
import com.kt_miniproject.demo.dto.comment.CommentResponse;
import com.kt_miniproject.demo.exception.DeletionException;
import com.kt_miniproject.demo.exception.ResourceNotFoundException;
import com.kt_miniproject.demo.repository.BookRepository;
import com.kt_miniproject.demo.repository.CommentRepository;
import com.kt_miniproject.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CommentServiceImpl implements CommentService {

    private final CommentRepository commentRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
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
                .title(request.getTitle())
                .content(request.getContent())
                .createdAt(LocalDateTime.now())
                .recommend(0)
                .book(book)
                .user(user)
                .build();

        commentRepository.save(comment);
        return new CommentResponse(comment);
    }


    @Override
    @Transactional
    public void deleteComment(Long commentId, Long userId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found"));

        // 작성자만 삭제 가능
        if (!comment.getUser().getId().equals(userId)) {
            throw new DeletionException("댓글을 삭제할 권한이 없습니다");
        }

        commentRepository.delete(comment);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CommentResponse> getCommentsByBook(Long bookId) {
        // repository 네이밍은 findByBook_Id로 되어 있어야 안전함
        return commentRepository.findByBook_Id(bookId)
                .stream()
                .map(CommentResponse::new)
                .collect(Collectors.toList());
    }
}
