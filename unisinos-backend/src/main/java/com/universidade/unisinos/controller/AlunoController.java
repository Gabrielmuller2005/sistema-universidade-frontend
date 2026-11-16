package com.universidade.unisinos.controller;

import com.universidade.unisinos.dto.AlunoResponse;
import com.universidade.unisinos.dto.TurmaResponse;
import com.universidade.unisinos.service.AlunoService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/alunos")
@RequiredArgsConstructor
public class AlunoController {

    private final AlunoService alunoService;

    @GetMapping("/{id}")
    public AlunoResponse buscar(@PathVariable Long id) {
        return alunoService.buscar(id);
    }

    @GetMapping("/{id}/turmas")
    public List<TurmaResponse> turmas(@PathVariable Long id) {
        return alunoService.turmasDoAluno(id);
    }
}
