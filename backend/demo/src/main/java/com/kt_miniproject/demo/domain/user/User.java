package com.kt_miniproject.demo.domain.user;

import com.kt_miniproject.demo.domain.book.Book;
import com.kt_miniproject.demo.domain.comment.Comment;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Integer id;

    @Column(length = 20)
    private String password;

    @Column(length = 30)
    private String email;

    @Column(length = 20)
    private String name;

    @Column(name = "role")
    private Boolean role;          // BIT(1)

    @Column(name = "api_key", length = 100)
    private String apiKey;

    // User : Book = 1 : N
    @OneToMany(mappedBy = "user")
    private List<Book> books = new ArrayList<>();

    // User : Comment = 1 : N
    @OneToMany(mappedBy = "user")
    private List<Comment> comments = new ArrayList<>();

    public User() {}
    // getter/setter or Lombok
}
