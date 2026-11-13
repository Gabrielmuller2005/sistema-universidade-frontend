package com.universidade.unisinos.service;

import com.universidade.unisinos.dto.DisciplinaResponse;
import com.universidade.unisinos.mapper.DisciplinaMapper;
import com.universidade.unisinos.repository.DisciplinaRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class DisciplinaService {

    private final DisciplinaRepository disciplinaRepository;

    @Transactional(readOnly = true)
    public List<DisciplinaResponse> listar() {
        log.info("Listando todas as disciplinas");
        return disciplinaRepository.findAll().stream()
                .map(DisciplinaMapper::toResponse)
                .toList();
    }
}
