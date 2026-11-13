package com.universidade.unisinos.mapper;

import com.universidade.unisinos.dto.AlunoResponse;
import com.universidade.unisinos.entity.Aluno;
import java.util.Comparator;
import java.util.List;

public final class AlunoMapper {

    private AlunoMapper() {
    }

    public static AlunoResponse toResponse(Aluno aluno) {
        List<Long> aprovadas = aluno.getDisciplinasAprovadas().stream()
                .map(disciplina -> disciplina.getId())
                .sorted(Comparator.naturalOrder())
                .toList();
        return new AlunoResponse(aluno.getId(), aluno.getNome(), aluno.getMatricula(), aprovadas);
    }
}
