package com.kt_miniproject.demo.dto.comment;

import com.kt_miniproject.demo.domain.comment.Comment;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class CommentResponse {
    private Long id;
    private String title;
    private String content;
    private LocalDateTime createdAt;
    private Integer recommend;

    public CommentResponse(Comment comment) {
        this.id = comment.getId();
        this.title = comment.getTitle();
        this.content = comment.getContent();
        this.createdAt = comment.getCreatedAt();
        this.recommend = comment.getRecommend();

    }
}
