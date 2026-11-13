package com.universidade.unisinos.service;

import com.universidade.unisinos.dto.ProfessorResponse;
import com.universidade.unisinos.mapper.ProfessorMapper;
import com.universidade.unisinos.repository.ProfessorRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProfessorService {

    private final ProfessorRepository professorRepository;

    @Transactional(readOnly = true)
    public List<ProfessorResponse> listar() {
        log.info("Listando professores");
        return professorRepository.findAll().stream()
                .map(ProfessorMapper::toResponse)
                .toList();
    }
}
