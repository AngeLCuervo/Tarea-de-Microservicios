package com.twitterlike.monolith.controller;

import com.twitterlike.monolith.entity.User;
import com.twitterlike.monolith.repository.PostRepository;
import com.twitterlike.monolith.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class StreamControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    public void publicStreamAccessibleWithoutAuth() throws Exception {
        mockMvc.perform(get("/api/stream"))
               .andExpect(status().isOk());
    }

    @Test
    public void postCreationForbiddenWithoutAuth() throws Exception {
        mockMvc.perform(post("/api/posts")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"content\": \"test\"}"))
               .andExpect(status().isUnauthorized());
    }
}
