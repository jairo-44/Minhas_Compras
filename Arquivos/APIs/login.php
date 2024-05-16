<?php 

include_once('conexao.php');

$postjson = json_decode(file_get_contents("php://input"), true);

$query_buscar = $pdo->prepare("
    SELECT 'aluno' AS tipo_usuario, 
    idAluno AS id, 
    emailAluno AS email, 
    nomeAluno AS nome
        
    FROM aluno 
    WHERE emailAluno = :email AND senhaAluno = :senha
    UNION ALL
    SELECT 'prof' AS tipo_usuario, 
    id AS id, 
    email AS email, 
    nome AS nome 
    FROM prof 
    WHERE email = :email AND senha = :senha
");
$query_buscar->bindValue(":email", $postjson['email']);
$query_buscar->bindValue(":senha", $postjson['senha']);
$query_buscar->execute();

$dados_buscar = $query_buscar->fetchAll(PDO::FETCH_ASSOC);

if(count($dados_buscar) > 0) {
    $result = json_encode(array('success' => true, 'usuario' => $dados_buscar[0]));
    echo $result;
} else {
    $result = json_encode(array('success' => false));
    echo $result;
}

?>
