package com.universidade.unisinos.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

public record TurmaRequest(
        @NotNull(message = "A disciplina é obrigatória.")
        Long disciplinaId,

        @NotNull(message = "O professor é obrigatório.")
        Long professorId,

        @NotNull(message = "O horário é obrigatório.")
        @Pattern(regexp = "[2-7][1-3]", message = "Horário inválido.")
        String horario,

        @NotNull(message = "O número de vagas é obrigatório.")
        @Min(value = 1, message = "O número de vagas deve ser maior que zero.")
        Integer vagas) {
}
