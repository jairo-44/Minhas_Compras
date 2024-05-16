<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Content-Type: application/json; charset=utf-8');

// Dados de conexão com o banco de dados
$banco = 'fitConnect';
$host = 'localhost';
$usuario = 'root';
$senha = '';

try {
    // Estabelece a conexão com o banco de dados usando PDO
    $pdo = new PDO("mysql:dbname=$banco;host=$host", $usuario, $senha);
    // Define o modo de erro do PDO para exceção
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    // Em caso de falha na conexão, exibe uma mensagem de erro
    echo json_encode(array("success" => false, "message" => "Erro ao conectar com o banco de dados: " . $e->getMessage()));
    // Termina a execução do script
    exit();
}

// Verifica se a requisição é do tipo POST
if ($_SERVER['REQUEST_METHOD'] == 'POST') {

    // Verifica se foi enviado um arquivo
    if (isset($_FILES['file'])) {

        $uploadDirectory = './uploads/'; // Diretório de upload

        // Extrai o nome original do arquivo
        $originalFileName = $_FILES['file']['name'];

        // Caminho completo para salvar o arquivo mantendo o nome original
        $uploadPath = $uploadDirectory . $originalFileName;

        // Move o arquivo para o diretório de upload
        if (move_uploaded_file($_FILES['file']['tmp_name'], $uploadPath)) {
            // Arquivo movido com sucesso

            // Retorna o nome do arquivo na resposta
            echo json_encode(array("success" => true, "filename" => $originalFileName));
        } else {
            // Falha ao mover o arquivo
            echo json_encode(array("success" => false, "message" => "Falha ao carregar a foto."));
        }
    } else {
        // Nenhum arquivo enviado
        echo json_encode(array("success" => false, "message" => "Nenhuma foto enviada."));
    }
} else {
    // Método de requisição inválido
    echo json_encode(array("success" => false, "message" => "Método de requisição inválido."));
}

?>