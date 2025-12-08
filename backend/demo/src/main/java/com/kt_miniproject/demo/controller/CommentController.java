package com.kt_miniproject.demo.controller;

import com.kt_miniproject.demo.dto.comment.CommentCreateRequest;
import com.kt_miniproject.demo.dto.comment.CommentResponse;
import com.kt_miniproject.demo.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/books/{bookId}/comments") // 🔹 bookId 포함
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    // 댓글 작성
    @PostMapping
    public ResponseEntity<CommentResponse> createComment(
            @PathVariable("bookId") Long bookId,
            @RequestBody CommentCreateRequest request
    ) {
        CommentResponse response = commentService.createComment(bookId, request);
        return ResponseEntity.ok(response);
    }

    // 책별 댓글 조회
    @GetMapping
    public ResponseEntity<List<CommentResponse>> getCommentsByBook(
            @PathVariable("bookId") Long bookId
    ) {
        List<CommentResponse> comments = commentService.getCommentsByBook(bookId);
        return ResponseEntity.ok(comments);
    }

    // 댓글 삭제
    @DeleteMapping("/{commentId}")
    public ResponseEntity<Void> deleteComment(
            @PathVariable("bookId") Long bookId,
            @PathVariable("commentId") Long commentId,
            @RequestParam("userId") Long userId
    ) {
        commentService.deleteComment(commentId, userId);
        return ResponseEntity.noContent().build();
    }
}
