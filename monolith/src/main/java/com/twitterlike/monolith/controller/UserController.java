package com.twitterlike.monolith.controller;

import com.twitterlike.monolith.dto.UserDto;
import com.twitterlike.monolith.entity.User;
import com.twitterlike.monolith.repository.UserRepository;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/me")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping
    public UserDto getCurrentUser(@AuthenticationPrincipal Jwt jwt) {
        String auth0Id = jwt.getSubject();
        
        User user = userRepository.findByAuth0Id(auth0Id).orElseGet(() -> {
            // First time login, create basic user from token
            User newUser = new User();
            newUser.setAuth0Id(auth0Id);
            newUser.setUsername(jwt.getClaimAsString("nickname") != null ? jwt.getClaimAsString("nickname") : auth0Id);
            newUser.setEmail(jwt.getClaimAsString("email")); // Requires scope
            return userRepository.save(newUser);
        });

        return new UserDto(user);
    }
}
