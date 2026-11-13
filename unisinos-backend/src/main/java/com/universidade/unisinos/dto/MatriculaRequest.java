package com.universidade.unisinos.dto;

import jakarta.validation.constraints.NotNull;

public record MatriculaRequest(
        @NotNull(message = "O aluno é obrigatório.")
        Long alunoId,

        @NotNull(message = "A turma é obrigatória.")
        Long turmaId) {
}
