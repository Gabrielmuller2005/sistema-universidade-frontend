package com.universidade.unisinos.mapper;

import com.universidade.unisinos.dto.TurmaResponse;
import com.universidade.unisinos.entity.Turma;
import com.universidade.unisinos.util.Horarios;

public final class TurmaMapper {

    private TurmaMapper() {
    }

    public static TurmaResponse toResponse(Turma turma, long numeroMatriculados) {
        return new TurmaResponse(
                turma.getId(),
                turma.getDisciplina().getId(),
                turma.getDisciplina().getNome(),
                turma.getProfessor().getId(),
                turma.getProfessor().getNome(),
                turma.getHorario(),
                Horarios.descricao(turma.getHorario()),
                turma.getVagas(),
                turma.getVagas() - numeroMatriculados,
                numeroMatriculados);
    }
}
