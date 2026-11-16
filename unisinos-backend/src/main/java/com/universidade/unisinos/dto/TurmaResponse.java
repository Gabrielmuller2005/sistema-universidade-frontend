package com.universidade.unisinos.dto;

public record TurmaResponse(
        Long id,
        Long disciplinaId,
        String disciplinaNome,
        Long professorId,
        String professorNome,
        String horario,
        String horarioDescricao,
        Integer vagas,
        long vagasLivres,
        long numeroMatriculados) {
}
