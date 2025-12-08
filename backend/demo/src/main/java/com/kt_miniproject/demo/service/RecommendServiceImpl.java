package com.kt_miniproject.demo.service;

import com.kt_miniproject.demo.domain.book.Book;
import com.kt_miniproject.demo.domain.comment.Comment;
import com.kt_miniproject.demo.domain.recommend.BookRecommend;
import com.kt_miniproject.demo.domain.recommend.CommentRecommend;
import com.kt_miniproject.demo.domain.user.User;
import com.kt_miniproject.demo.repository.BookRecommendRepository;
import com.kt_miniproject.demo.repository.BookRepository;
import com.kt_miniproject.demo.repository.CommentRecommendRepository;
import com.kt_miniproject.demo.repository.CommentRepository;
import com.kt_miniproject.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RecommendServiceImpl implements RecommendService {

    private final UserRepository userRepository;
    private final BookRepository bookRepository;
    private final CommentRepository commentRepository;
    private final BookRecommendRepository bookRecommendRepository;
    private final CommentRecommendRepository commentRecommendRepository;

    @Override
    public void recommendBook(Long bookId, Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new IllegalArgumentException("Book not found"));

        if (bookRecommendRepository.existsByUserAndBook(user, book)) {
            throw new IllegalStateException("이미 추천한 도서입니다.");
        }

        bookRecommendRepository.save(
                BookRecommend.builder()
                        .user(user)
                        .book(book)
                        .build()
        );
    }

    @Override
    public void recommendComment(Long commentId, Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("Comment not found"));

        if (commentRecommendRepository.existsByUserAndComment(user, comment)) {
            throw new IllegalStateException("이미 추천한 댓글입니다.");
        }

        commentRecommendRepository.save(
                CommentRecommend.builder()
                        .user(user)
                        .comment(comment)
                        .build()
        );
    }
}
