package com.universidade.unisinos.util;

import java.util.Map;

public final class Horarios {

    private static final Map<Character, String> DIAS = Map.of(
            '2', "Segunda",
            '3', "Terça",
            '4', "Quarta",
            '5', "Quinta",
            '6', "Sexta",
            '7', "Sábado");

    private static final Map<Character, String> TURNOS = Map.of(
            '1', "Manhã",
            '2', "Tarde",
            '3', "Noite");

    private Horarios() {
    }

    public static boolean valido(String codigo) {
        return codigo != null
                && codigo.length() == 2
                && DIAS.containsKey(codigo.charAt(0))
                && TURNOS.containsKey(codigo.charAt(1));
    }

    public static String descricao(String codigo) {
        if (!valido(codigo)) {
            return "Horário inválido";
        }
        return DIAS.get(codigo.charAt(0)) + " - " + TURNOS.get(codigo.charAt(1));
    }
}
