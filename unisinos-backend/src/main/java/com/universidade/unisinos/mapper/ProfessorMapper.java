package com.universidade.unisinos.mapper;

import com.universidade.unisinos.dto.ProfessorResponse;
import com.universidade.unisinos.entity.Professor;

public final class ProfessorMapper {

    private ProfessorMapper() {
    }

    public static ProfessorResponse toResponse(Professor professor) {
        return new ProfessorResponse(professor.getId(), professor.getNome());
    }
}
