package com.twitterlike.monolith.controller;

import com.twitterlike.monolith.dto.PostDto;
import com.twitterlike.monolith.repository.PostRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/stream")
@Tag(name = "Stream", description = "Public feed of all posts")
public class StreamController {

    private final PostRepository postRepository;

    public StreamController(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    @GetMapping
    @Operation(summary = "Get global stream", description = "Retrieves a list of all posts in the system ordered by creation date (descending). This endpoint is public.")
    public List<PostDto> getStream() {
        return postRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(PostDto::new)
                .collect(Collectors.toList());
    }
}
