package com.universidade.unisinos.controller;

import com.universidade.unisinos.dto.DisciplinaResponse;
import com.universidade.unisinos.service.DisciplinaService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/disciplinas")
@RequiredArgsConstructor
public class DisciplinaController {

    private final DisciplinaService disciplinaService;

    @GetMapping
    public List<DisciplinaResponse> listar() {
        return disciplinaService.listar();
    }
}
