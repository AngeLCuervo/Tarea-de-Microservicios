package com.twitterlike.monolith.config;

import com.twitterlike.monolith.entity.Post;
import com.twitterlike.monolith.entity.User;
import com.twitterlike.monolith.repository.PostRepository;
import com.twitterlike.monolith.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initData(UserRepository userRepository, PostRepository postRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (userRepository.count() == 0) {
                String commonPassword = passwordEncoder.encode("password123");

                // Create Sebastian
                User sebastian = new User("sebastian", commonPassword, "sebastian@example.com");
                userRepository.save(sebastian);

                // Create Angel
                User angel = new User("angel", commonPassword, "angel@example.com");
                userRepository.save(angel);

                // Create Pablo
                User pablo = new User("pablo", commonPassword, "pablo@example.com");
                userRepository.save(pablo);

                // Create Initial Posts
                postRepository.saveAll(List.of(
                    new Post(sebastian, "Hola a todos! Este es mi primer post en MiniTwitter. #Minimalist"),
                    new Post(angel, "Probando la arquitectura de microservicios con Seguridad Tradicional!"),
                    new Post(pablo, "La seguridad tradicional facilita las pruebas locales."),
                    new Post(sebastian, "¡Qué buena interfaz tiene este proyecto! Muy limpia."),
                    new Post(angel, "Acabo de terminar el despliegue en AWS S3.")
                ));

                System.out.println("✅ Traditional Mock Users and Posts initialized successfully.");
            }
        };
    }
}
