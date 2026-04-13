package com.twitterlike.monolith.dto;

import com.twitterlike.monolith.entity.Post;
import java.time.LocalDateTime;

public class PostDto {
    private Long id;
    private String content;
    private String username;
    private LocalDateTime createdAt;

    public PostDto(Post post) {
        this.id = post.getId();
        this.content = post.getContent();
        this.username = post.getUser().getUsername();
        this.createdAt = post.getCreatedAt();
    }

    public Long getId() { return id; }
    public String getContent() { return content; }
    public String getUsername() { return username; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
