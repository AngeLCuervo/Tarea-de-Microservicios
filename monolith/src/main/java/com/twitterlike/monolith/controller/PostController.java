package com.twitterlike.monolith.controller;

import com.twitterlike.monolith.dto.PostCreateDto;
import com.twitterlike.monolith.dto.PostDto;
import com.twitterlike.monolith.entity.Post;
import com.twitterlike.monolith.entity.User;
import com.twitterlike.monolith.repository.PostRepository;
import com.twitterlike.monolith.repository.UserRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/posts")
@Tag(name = "Posts", description = "Endpoints for creating and managing posts")
public class PostController {

    private final PostRepository postRepository;
    private final UserRepository userRepository;

    public PostController(PostRepository postRepository, UserRepository userRepository) {
        this.postRepository = postRepository;
        this.userRepository = userRepository;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(
        summary = "Create a new post", 
        description = "Creates a new 140-character post for the authenticated user. Requires Basic Auth.",
        security = @SecurityRequirement(name = "basicAuth")
    )
    public PostDto createPost(@Valid @RequestBody PostCreateDto dto, @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not logged in");
        }

        String username = userDetails.getUsername();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN, "User not found"));

        Post post = new Post(user, dto.getContent());
        return new PostDto(postRepository.save(post));
    }
}
