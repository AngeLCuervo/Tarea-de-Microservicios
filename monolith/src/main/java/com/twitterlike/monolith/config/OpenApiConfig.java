package com.twitterlike.monolith.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .components(new Components()
                        .addSecuritySchemes("basicAuth", new SecurityScheme()
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("basic")))
                .info(new Info()
                        .title("AREP - API de Microservicios")
                        .version("1.0")
                        .description("Esta es la documentación de la API para el proyecto AREP 2026-1. " +
                                "Permite la gestión de usuarios y publicaciones en un entorno de microservicios. " +
                                "\n\n### Instrucciones de Uso:\n" +
                                "1. Haz clic en el botón 'Authorize' arriba.\n" +
                                "2. Ingresa un usuario (ej. 'sebastian') y la contraseña ('password123').\n" +
                                "3. Ahora puedes probar los endpoints protegidos como /api/posts.")
                        .contact(new Contact()
                                .name("Sebastian, Angel y Pablo")
                                .url("https://www.escuelaing.edu.co")))
                .servers(List.of(new Server().url("/").description("API Server")));
    }
}
