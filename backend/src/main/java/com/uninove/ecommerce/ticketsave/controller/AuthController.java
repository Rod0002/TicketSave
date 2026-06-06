package com.uninove.ecommerce.ticketsave.controller;

import com.uninove.ecommerce.ticketsave.dto.CadastroRequestDTO;
import com.uninove.ecommerce.ticketsave.dto.LoginRequestDTO;
import com.uninove.ecommerce.ticketsave.dto.UsuarioResponseDTO;
import com.uninove.ecommerce.ticketsave.service.UsuarioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@Tag(name = "Autenticacao", description = "Login e Cadastro de usuarios")
public class AuthController {

    private final UsuarioService usuarioService;

    public AuthController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @PostMapping("/cadastro")
    @Operation(summary = "Cadastrar novo usuario")
    public ResponseEntity<UsuarioResponseDTO> cadastrar(@RequestBody @Valid CadastroRequestDTO dto) {
        UsuarioResponseDTO usuario = usuarioService.cadastrar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(usuario);
    }

    @PostMapping("/login")
    @Operation(summary = "Realizar login")
    public ResponseEntity<UsuarioResponseDTO> login(@RequestBody @Valid LoginRequestDTO dto) {
        UsuarioResponseDTO usuario = usuarioService.login(dto);
        return ResponseEntity.ok(usuario);
    }
}
