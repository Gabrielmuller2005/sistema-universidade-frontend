package com.universidade.unisinos.dto;

public record DisciplinaResponse(
        Long id,
        String nome,
        Long preRequisitoId,
        String preRequisitoNome) {
}
