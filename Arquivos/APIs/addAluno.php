<?php

include_once('conexao.php');

$postjson = json_decode(file_get_contents("php://input"), true);

// Verifique se um arquivo de imagem foi enviado
if(isset($_FILES['fotoAluno'])) {
    $foto_tmp = $_FILES['fotoAluno']['tmp_name'];
    $foto_name = $_FILES['fotoAluno']['name'];
    $foto_type = $_FILES['fotoAluno']['type'];
    $foto_size = $_FILES['fotoAluno']['size'];
  
    // Diretório onde as imagens serão armazenadas
    $upload_dir = 'C:\xampp\htdocs\fitConnect\uploads/';
  
    // Verifique se o diretório de upload existe e tem permissões de escrita
    if(!file_exists($upload_dir)) {
        mkdir($upload_dir, 0777, true);
    }
  
    // Move o arquivo para o diretório de upload
    if(move_uploaded_file($foto_tmp, $upload_dir.$foto_name)) {
        // Adicione $foto_name à sua consulta SQL para inserir o nome do arquivo no banco de dados
        $query = $pdo->prepare("INSERT INTO aluno (..., fotoAluno, ...) VALUES (... , :fotoAluno, ...)");
        $query->bindValue(":fotoAluno", $foto_name);
    } else {
        // Erro ao mover o arquivo
        $result = json_encode(array('success' => false, 'error' => 'Erro ao fazer o upload do arquivo.'));
        echo $result;
        exit;
    }
}

$query = $pdo->prepare("INSERT INTO aluno (idAluno, nomeAluno, emailAluno, senhaAluno, cpfAluno, foneAluno, enderecoAluno, cidadeAluno, estadoAluno, qualProf, objetivo, peso, altura, idadeAluno, sexoAluno, praticaAtiv, quantAtiv, problSaude, qualProbl, comentarioAluno, fotoPerfilAluno) VALUES (:idAluno, :nomeAluno, :emailAluno, :senhaAluno, :cpfAluno, :foneAluno, :enderecoAluno, :cidadeAluno, :estadoAluno, :qualProf, :objetivo, :peso, :altura, :idadeAluno, :sexoAluno, :praticaAtiv, :quantAtiv, :problSaude, :qualProbl, :comentarioAluno, :fotoPerfilAluno)");

// Ligação de parâmetro para evitar injeção de SQL
$query->bindValue(":idAluno", $postjson['idAluno']);
$query->bindValue(":nomeAluno", $postjson['nomeAluno']);
$query->bindValue(":emailAluno", $postjson['emailAluno']);
$query->bindValue(":senhaAluno", $postjson['senhaAluno']);
$query->bindValue(":cpfAluno", $postjson['cpfAluno']);
$query->bindValue(":foneAluno", $postjson['foneAluno']);
$query->bindValue(":enderecoAluno", $postjson['enderecoAluno']);
$query->bindValue(":cidadeAluno", $postjson['cidadeAluno']);
$query->bindValue(":estadoAluno", $postjson['estadoAluno']);
$query->bindValue(":qualProf", $postjson['qualProf']);
$query->bindValue(":objetivo", $postjson['objetivo']);
$query->bindValue(":peso", $postjson['peso']);
$query->bindValue(":altura", $postjson['altura']);
$query->bindValue(":idadeAluno", $postjson['idadeAluno']);
$query->bindValue(":sexoAluno", $postjson['sexoAluno']);
$query->bindValue(":praticaAtiv", $postjson['praticaAtiv']);
$query->bindValue(":quantAtiv", $postjson['quantAtiv']);
$query->bindValue(":problSaude", $postjson['problSaude']);
$query->bindValue(":qualProbl", $postjson['qualProbl']);
$query->bindValue(":comentarioAluno", $postjson['comentarioAluno']);
$query->bindValue(":fotoPerfilAluno", $postjson['fotoPerfilAluno']);

$result = [];

if ($query->execute()) {
    $result = json_encode(array('success' => true));
} else {
    $result = json_encode(array('success' => false, 'error' => 'Erro ao inserir no banco de dados.'));
}

echo $result;

?>
