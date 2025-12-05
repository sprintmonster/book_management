package com.kt_miniproject.demo.domain.comment;

import com.kt_miniproject.demo.domain.book.Book;
import com.kt_miniproject.demo.domain.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "comment")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "comment_id")
    private Long id;

    @Column(name = "comment_title", length = 200)
    private String title;

    @Column(name = "comment_content", columnDefinition = "TEXT")
    private String content;

    @Column(name = "comment_date")
    private LocalDateTime createdAt;

    @Column(name = "comment_active")
    private Boolean active;

    @Column(name = "comment_recommend")
    private Integer recommend;

    // ====================== FK 관계 ====================== //

    // Comment → User (N:1)
    @ManyToOne
    @JoinColumn(name = "users_user_id")   // ★ FK 이름 맞춰 수정
    private User user;

    // Comment → Book (N:1)
    @ManyToOne
    @JoinColumn(name = "book_book_id")   // ERD FK 이름 그대로
    private Book book;
}
