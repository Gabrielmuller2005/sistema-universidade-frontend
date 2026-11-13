package com.universidade.unisinos.service;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class SenhaService {

    private final PasswordEncoder encoder = new BCryptPasswordEncoder();

    public String criptografar(String senha) {
        return encoder.encode(senha);
    }

    public boolean corresponde(String senha, String senhaHash) {
        return encoder.matches(senha, senhaHash);
    }
}
