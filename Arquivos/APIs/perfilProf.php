<?php

include_once('conexao.php');

// Verifica se o ID do profissional foi fornecido na URL
if (isset($_GET['id'])) {
    $id = $_GET['id'];

    // Prepara a consulta para obter os detalhes do perfil do profissional
    $query_perfil = $pdo->prepare("
        SELECT nome, cidade, conselho, area, fotoPerfilProf
        FROM prof 
        WHERE id = :id
    ");

    $query_perfil->bindValue(":id", $id);
    $query_perfil->execute();

    // Obtém os detalhes do perfil do profissional
    $perfil_prof = $query_perfil->fetch(PDO::FETCH_ASSOC);

    // Verifica se o profissional foi encontrado
    if ($perfil_prof) {
        // Retorna os detalhes do perfil do profissional em formato JSON
        echo json_encode($perfil_prof);
    } else {
        // Se o profissional não foi encontrado, retorna uma mensagem de erro
        echo json_encode(array('error' => 'Profissional não encontrado'));
    }
} else {
    // Se o ID do profissional não foi fornecido, retorna uma mensagem de erro
    echo json_encode(array('error' => 'ID do profissional não fornecido'));
}

?>
