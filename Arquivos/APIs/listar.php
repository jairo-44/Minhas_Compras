<?php 

include_once('conexao.php');

    
    $query = $pdo->query("SELECT * from prof");

    $res = $query->fetchAll(PDO::FETCH_ASSOC);

        for ($i=0; $i < count($res); $i++) { 
        foreach ($res[$i] as $key => $value) {
        }
            $dados[] = array(
                'id' => $res[$i]['id'],
                'nome' => $res[$i]['nome'],
                'email' => $res[$i]['email'],
                'senha' => $res[$i]['senha'],       
                'area' => $res[$i]['area'],
                'area' => $res[$i]['area'],
                'comentarioProf' => $res[$i]['comentarioProf'],
                'atendiOnLine' => $res[$i]['atendiOnLine'],
                'fotoPerfilProf' => $res[$i]['fotoPerfilProf'],


            );

            }

            if(count($res) > 0){
                    $result = json_encode(array('success'=>true, 'result'=>$dados));

                }else{
                    $result = json_encode(array('success'=>false, 'result'=>'0'));

                }
                echo $result;

 ?>