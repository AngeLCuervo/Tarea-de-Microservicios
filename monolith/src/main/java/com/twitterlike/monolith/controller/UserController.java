package com.twitterlike.monolith.controller;

import com.twitterlike.monolith.dto.UserDto;
import com.twitterlike.monolith.entity.User;
import com.twitterlike.monolith.repository.UserRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/me")
@Tag(name = "User", description = "Endpoints for user profile and information")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping
    @Operation(
        summary = "Get current user profile", 
        description = "Retrieves the profile information of the currently authenticated user. Requires Basic Auth.",
        security = @SecurityRequirement(name = "basicAuth")
    )
    public UserDto getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
             throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not logged in");
        }
        
        String username = userDetails.getUsername();
        
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        return new UserDto(user);
    }
}
