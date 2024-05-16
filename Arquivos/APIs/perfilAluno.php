<?php

include_once('conexao.php');

// Verifica se o ID do aluno foi fornecido na URL
if (isset($_GET['id'])) {
    $idAluno = $_GET['id'];

    // Prepara a consulta para obter os detalhes do perfil do aluno
    $query_perfil = $pdo->prepare("
        SELECT nomeAluno, cidadeAluno, idadeAluno, sexoAluno, estadoAluno, idadeAluno, altura, peso, objetivo, praticaAtiv, quantAtiv, problSaude, qualProbl, comentarioAluno, fotoPerfilAluno
        FROM aluno 
        WHERE idAluno = :idAluno
    ");

    $query_perfil->bindValue(":idAluno", $idAluno);
    $query_perfil->execute();

    // Obtém os detalhes do perfil do aluno
    $perfil_aluno = $query_perfil->fetch(PDO::FETCH_ASSOC);

    // Verifica se o aluno foi encontrado
    if ($perfil_aluno) {
        // Retorna os detalhes do perfil do aluno em formato JSON
        echo json_encode($perfil_aluno);
    } else {
        // Se o aluno não foi encontrado, retorna uma mensagem de erro
        echo json_encode(array('error' => 'Aluno não encontrado'));
    }
} else {
    // Se o ID do aluno não foi fornecido, retorna uma mensagem de erro
    echo json_encode(array('error' => 'ID do aluno não fornecido'));
}

?>
