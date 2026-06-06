package com.uninove.ecommerce.ticketsave.service;

import com.uninove.ecommerce.ticketsave.dto.CadastroRequestDTO;
import com.uninove.ecommerce.ticketsave.dto.LoginRequestDTO;
import com.uninove.ecommerce.ticketsave.dto.UsuarioResponseDTO;
import com.uninove.ecommerce.ticketsave.entity.Usuario;
import com.uninove.ecommerce.ticketsave.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;

    public UsuarioService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    public UsuarioResponseDTO cadastrar(CadastroRequestDTO dto) {
        if (usuarioRepository.existsByEmail(dto.getEmail())) {
            throw new IllegalArgumentException("Ja existe um usuario com este e-mail");
        }

        Usuario usuario = new Usuario();
        usuario.setNome(dto.getNome());
        usuario.setEmail(dto.getEmail());
        usuario.setSenha(dto.getSenha());

        Usuario salvo = usuarioRepository.save(usuario);
        return UsuarioResponseDTO.fromEntity(salvo);
    }

    public UsuarioResponseDTO login(LoginRequestDTO dto) {
        Usuario usuario = usuarioRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("E-mail ou senha incorretos"));

        if (!usuario.getSenha().equals(dto.getSenha())) {
            throw new IllegalArgumentException("E-mail ou senha incorretos");
        }

        return UsuarioResponseDTO.fromEntity(usuario);
    }
}
