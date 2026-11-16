package com.universidade.unisinos.service;

import com.universidade.unisinos.dto.LoginRequest;
import com.universidade.unisinos.dto.LoginResponse;
import com.universidade.unisinos.entity.Aluno;
import com.universidade.unisinos.entity.UsuarioInstituicao;
import com.universidade.unisinos.exception.RegraDeNegocioException;
import com.universidade.unisinos.repository.AlunoRepository;
import com.universidade.unisinos.repository.UsuarioInstituicaoRepository;
import java.util.Locale;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class AutenticacaoService {

    private static final String CREDENCIAIS_INVALIDAS = "Login ou senha inválidos.";

    private final AlunoRepository alunoRepository;
    private final UsuarioInstituicaoRepository usuarioInstituicaoRepository;
    private final SenhaService senhaService;

    @Transactional(readOnly = true)
    public LoginResponse autenticar(LoginRequest request) {
        log.info("AutenticacaoService autenticar");
        String perfil = request.perfil().toLowerCase(Locale.ROOT);
        return switch (perfil) {
            case "aluno" -> autenticarAluno(request);
            case "instituicao" -> autenticarInstituicao(request);
            default -> throw new RegraDeNegocioException("Perfil inválido. Use 'aluno' ou 'instituicao'.");
        };
    }

    private LoginResponse autenticarAluno(LoginRequest request) {
        log.info("AutenticacaoService autenticarAluno");
        Aluno aluno = alunoRepository.findByMatricula(request.login())
                .filter(encontrado -> senhaService.corresponde(request.senha(), encontrado.getSenhaHash()))
                .orElseThrow(() -> new RegraDeNegocioException(CREDENCIAIS_INVALIDAS));
        return new LoginResponse(aluno.getId(), aluno.getNome(), "aluno", aluno.getMatricula(), null);
    }

    private LoginResponse autenticarInstituicao(LoginRequest request) {
        log.info("AutenticacaoService autenticarInstituicao");
        UsuarioInstituicao usuario = usuarioInstituicaoRepository.findByUsuario(request.login())
                .filter(encontrado -> senhaService.corresponde(request.senha(), encontrado.getSenhaHash()))
                .orElseThrow(() -> new RegraDeNegocioException(CREDENCIAIS_INVALIDAS));
        return new LoginResponse(usuario.getId(), usuario.getNome(), "instituicao", null, usuario.getUsuario());
    }
}
