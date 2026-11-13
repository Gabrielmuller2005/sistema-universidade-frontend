package com.universidade.unisinos.controller;

import com.universidade.unisinos.service.DadosIniciaisService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dados-iniciais")
@RequiredArgsConstructor
public class DadosIniciaisController {

    private final DadosIniciaisService dadosIniciaisService;

    @PostMapping("/restaurar")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void restaurar() {
        dadosIniciaisService.restaurarTurmasEMatriculas();
    }
}
