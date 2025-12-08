package com.kt_miniproject.demo.controller;

import com.kt_miniproject.demo.service.RecommendService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/recommend")
@RequiredArgsConstructor
public class RecommendController {

    private final RecommendService recommendService;

    // 도서 추천
    @PostMapping("/book/{bookId}")
    public ResponseEntity<String> recommendBook(
            @PathVariable Long bookId,
            @RequestParam Long userId
    ) {
        recommendService.recommendBook(bookId, userId);
        return ResponseEntity.ok("도서 추천 완료");
    }

    // 댓글 추천
    @PostMapping("/comment/{commentId}")
    public ResponseEntity<String> recommendComment(
            @PathVariable Long commentId,
            @RequestParam Long userId
    ) {
        recommendService.recommendComment(commentId, userId);
        return ResponseEntity.ok("댓글 추천 완료");
    }
}
