package com.universidade.unisinos.mapper;

import com.universidade.unisinos.dto.DisciplinaResponse;
import com.universidade.unisinos.entity.Disciplina;

public final class DisciplinaMapper {

    private DisciplinaMapper() {
    }

    public static DisciplinaResponse toResponse(Disciplina disciplina) {
        Disciplina preRequisito = disciplina.getPreRequisito();
        return new DisciplinaResponse(
                disciplina.getId(),
                disciplina.getNome(),
                preRequisito != null ? preRequisito.getId() : null,
                preRequisito != null ? preRequisito.getNome() : null);
    }
}
