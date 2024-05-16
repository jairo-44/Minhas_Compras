<?php 

include_once('conexao.php');

    
    $query = $pdo->query("SELECT * from bike");

    $res = $query->fetchAll(PDO::FETCH_ASSOC);

        for ($i=0; $i < count($res); $i++) { 
        foreach ($res[$i] as $key => $value) {
        }
            $dados[] = array(
                'idBike' => $res[$i]['idBike'],
                'marca' => $res[$i]['marca'],
                'modelo' => $res[$i]['modelo'],
                'descricao' => $res[$i]['descricao'],       
                'valorHora' => $res[$i]['valorHora'],
            );

            }

            if(count($res) > 0){
                    $result = json_encode(array('success'=>true, 'result'=>$dados));

                }else{
                    $result = json_encode(array('success'=>false, 'result'=>'0'));

                }
                echo $result;

 ?>