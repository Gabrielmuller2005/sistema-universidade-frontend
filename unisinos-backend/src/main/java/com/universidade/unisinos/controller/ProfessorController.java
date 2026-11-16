package com.universidade.unisinos.controller;

import com.universidade.unisinos.dto.ProfessorResponse;
import com.universidade.unisinos.service.ProfessorService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/professores")
@RequiredArgsConstructor
public class ProfessorController {

    private final ProfessorService professorService;

    @GetMapping
    public List<ProfessorResponse> listar() {
        return professorService.listar();
    }
}
