package com.universidade.unisinos.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import java.util.HashSet;
import java.util.Set;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "alunos")
@Getter
@Setter
@NoArgsConstructor
public class Aluno {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false, unique = true)
    private String matricula;

    @Column(nullable = false)
    private String senhaHash;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "aluno_disciplina_aprovada",
            joinColumns = @JoinColumn(name = "aluno_id"),
            inverseJoinColumns = @JoinColumn(name = "disciplina_id"))
    private Set<Disciplina> disciplinasAprovadas = new HashSet<>();

    public Aluno(String nome, String matricula, String senhaHash, Set<Disciplina> disciplinasAprovadas) {
        this.nome = nome;
        this.matricula = matricula;
        this.senhaHash = senhaHash;
        this.disciplinasAprovadas = new HashSet<>(disciplinasAprovadas);
    }
}
