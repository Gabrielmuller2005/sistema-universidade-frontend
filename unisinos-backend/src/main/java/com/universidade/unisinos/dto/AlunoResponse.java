package com.universidade.unisinos.dto;

import java.util.List;

public record AlunoResponse(
        Long id,
        String nome,
        String matricula,
        List<Long> disciplinasAprovadasIds) {
}
