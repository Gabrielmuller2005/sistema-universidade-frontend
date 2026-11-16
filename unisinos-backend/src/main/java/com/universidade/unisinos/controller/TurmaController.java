package com.universidade.unisinos.controller;

import com.universidade.unisinos.dto.TurmaRequest;
import com.universidade.unisinos.dto.TurmaResponse;
import com.universidade.unisinos.service.TurmaService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/turmas")
@RequiredArgsConstructor
public class TurmaController {

    private final TurmaService turmaService;

    @GetMapping
    public List<TurmaResponse> listar() {
        return turmaService.listar();
    }

    @GetMapping("/{id}")
    public TurmaResponse buscar(@PathVariable Long id) {
        return turmaService.buscar(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TurmaResponse criar(@Valid @RequestBody TurmaRequest request) {
        return turmaService.criar(request);
    }

    @PutMapping("/{id}")
    public TurmaResponse atualizar(@PathVariable Long id, @Valid @RequestBody TurmaRequest request) {
        return turmaService.atualizar(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void remover(@PathVariable Long id) {
        turmaService.remover(id);
    }
}
