<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Content-Type: application/json; charset=utf-8');

//dados do banco no servidor local
$banco = 'fitConnect';
$host = 'localhost';
$usuario = 'root';
$senha = '';

try {
    $pdo = new PDO("mysql:dbname=$banco;host=$host", $usuario, $senha);
} catch (Exception $e) {
    echo 'Erro ao conectar com o banco!! ' . $e;
    exit();
}

// Recupera o ID do profissional logado
$idProfLogado = isset($_GET['id']) ? $_GET['id'] : '';

// Preparando e executando a consulta SQL com filtragem por ID do profissional
$consulta = $pdo->prepare("SELECT id, nome, area, comentarioProf, fotoPerfilProf FROM prof WHERE id = ?");
$consulta->execute([$idProfLogado]);

// Recuperando os resultados da consulta
$resultado = $consulta->fetchAll(PDO::FETCH_ASSOC);

// Retornando os dados como JSON
echo json_encode($resultado);
?>
