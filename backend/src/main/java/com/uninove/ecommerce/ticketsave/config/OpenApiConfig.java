package com.uninove.ecommerce.ticketsave.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("TicketSave API")
                        .version("1.0.0")
                        .description("API de Gerenciamento de Tickets de Suporte - TechStore (Projeto UNINOVE)")
                        .contact(new Contact()
                                .name("Grupo 05 - UNINOVE")
                        )
                );
    }
}
