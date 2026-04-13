package com.twitterlike.monolith.controller;

import com.twitterlike.monolith.dto.PostCreateDto;
import com.twitterlike.monolith.dto.PostDto;
import com.twitterlike.monolith.entity.Post;
import com.twitterlike.monolith.entity.User;
import com.twitterlike.monolith.repository.PostRepository;
import com.twitterlike.monolith.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    private final PostRepository postRepository;
    private final UserRepository userRepository;

    public PostController(PostRepository postRepository, UserRepository userRepository) {
        this.postRepository = postRepository;
        this.userRepository = userRepository;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PostDto createPost(@Valid @RequestBody PostCreateDto dto, @AuthenticationPrincipal Jwt jwt) {
        String auth0Id = jwt.getSubject();
        User user = userRepository.findByAuth0Id(auth0Id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN, "User must fetch /api/me first"));

        Post post = new Post(user, dto.getContent());
        return new PostDto(postRepository.save(post));
    }
}
