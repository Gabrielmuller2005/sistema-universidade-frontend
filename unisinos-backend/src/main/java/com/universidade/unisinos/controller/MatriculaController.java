package com.universidade.unisinos.controller;

import com.universidade.unisinos.dto.MatriculaRequest;
import com.universidade.unisinos.dto.TurmaResponse;
import com.universidade.unisinos.dto.VerificacaoMatriculaResponse;
import com.universidade.unisinos.service.MatriculaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/matriculas")
@RequiredArgsConstructor
public class MatriculaController {

    private final MatriculaService matriculaService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TurmaResponse matricular(@Valid @RequestBody MatriculaRequest request) {
        return matriculaService.matricular(request);
    }

    @DeleteMapping
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void cancelar(@RequestParam Long alunoId, @RequestParam Long turmaId) {
        matriculaService.cancelar(alunoId, turmaId);
    }

    @GetMapping("/verificar")
    public VerificacaoMatriculaResponse verificar(@RequestParam Long alunoId, @RequestParam Long turmaId) {
        return matriculaService.verificar(alunoId, turmaId);
    }
}
