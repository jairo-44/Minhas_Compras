<?php
include_once('conexao.php');

$postjson = json_decode(file_get_contents("php://input"), true);


$query = $pdo->prepare("INSERT INTO prof (id, nome, email, senha, area, cpf, sexo, cidade, estado, conselho, formacao, certFormacao, certEspec1, certEspec2, certEspec3, comentarioProf, atendiOnLine, fotoPerfilProf) VALUES (:id,:nome, :email, :senha, :area, :cpf, :sexo, :cidade, :estado, :conselho, :formacao, :certFormacao, :certEspec1, :certEspec2, :certEspec3, :comentarioProf, :atendiOnLine, :fotoPerfilProf)");

$query->bindValue(":id", $postjson['id']);
$query->bindValue(":nome", $postjson['nome']);
$query->bindValue(":email", $postjson['email']);
$query->bindValue(":senha", $postjson['senha']);
$query->bindValue(":area", $postjson['area']);
$query->bindValue(":cpf", $postjson['cpf']);
$query->bindValue(":sexo", $postjson['sexo']);
$query->bindValue(":cidade", $postjson['cidade']);
$query->bindValue(":estado", $postjson['estado']);
$query->bindValue(":conselho", $postjson['conselho']);
$query->bindValue(":formacao", $postjson['formacao']);
$query->bindValue(":certFormacao", $postjson['certFormacao']);
$query->bindValue(":certEspec1", $postjson['certEspec1']);
$query->bindValue(":certEspec2", $postjson['certEspec2']);
$query->bindValue(":certEspec3", $postjson['certEspec3']);
$query->bindValue(":comentarioProf", $postjson['comentarioProf']);
$query->bindValue(":atendiOnLine", $postjson['atendiOnLine']);
$query->bindValue(":fotoPerfilProf", $postjson['fotoPerfilProf']);

$result = [];

if ($query->execute()) {
    $result = json_encode(array('success' => true));
} else {
    $result = json_encode(array('success' => false, 'error' => 'Erro ao inserir no banco de dados.'));
}

echo $result;

?>
