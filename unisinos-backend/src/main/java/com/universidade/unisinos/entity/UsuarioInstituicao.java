package com.universidade.unisinos.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "usuarios_instituicao")
@Getter
@Setter
@NoArgsConstructor
public class UsuarioInstituicao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false, unique = true)
    private String usuario;

    @Column(nullable = false)
    private String senhaHash;

    public UsuarioInstituicao(String nome, String usuario, String senhaHash) {
        this.nome = nome;
        this.usuario = usuario;
        this.senhaHash = senhaHash;
    }
}
