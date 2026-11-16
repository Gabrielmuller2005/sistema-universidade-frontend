package com.universidade.unisinos.dto;

import jakarta.validation.constraints.NotBlank;

public record LoginRequest(
        @NotBlank(message = "O perfil é obrigatório.")
        String perfil,

        @NotBlank(message = "O login é obrigatório.")
        String login,

        @NotBlank(message = "A senha é obrigatória.")
        String senha) {
}
