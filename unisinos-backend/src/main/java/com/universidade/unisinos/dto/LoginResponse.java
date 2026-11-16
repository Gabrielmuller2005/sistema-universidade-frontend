package com.universidade.unisinos.dto;

public record LoginResponse(
        Long id,
        String nome,
        String perfil,
        String matricula,
        String usuario) {
}
