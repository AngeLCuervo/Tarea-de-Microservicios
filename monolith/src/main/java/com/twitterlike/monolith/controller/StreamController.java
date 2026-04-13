package com.twitterlike.monolith.controller;

import com.twitterlike.monolith.dto.PostDto;
import com.twitterlike.monolith.repository.PostRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/stream")
public class StreamController {

    private final PostRepository postRepository;

    public StreamController(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    @GetMapping
    public List<PostDto> getStream() {
        return postRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(PostDto::new)
                .collect(Collectors.toList());
    }
}
