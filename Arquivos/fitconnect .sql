-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 07/05/2024 às 16:53
-- Versão do servidor: 10.4.32-MariaDB
-- Versão do PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `fitconnect`
--

-- --------------------------------------------------------

--
-- Estrutura para tabela `aluguelbike`
--

CREATE TABLE `aluguelbike` (
  `idAlugBike` int(11) NOT NULL,
  `id_do_aluno` int(11) NOT NULL,
  `id_da_bike` int(11) NOT NULL,
  `data_aluguel` date NOT NULL,
  `hora_retirada` time NOT NULL,
  `hora_entrega` time NOT NULL,
  `data_entrega` date NOT NULL,
  `valorTotal` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `aluno`
--

CREATE TABLE `aluno` (
  `idAluno` int(11) NOT NULL,
  `nomeAluno` varchar(50) NOT NULL,
  `emailAluno` varchar(50) NOT NULL,
  `senhaAluno` varchar(15) NOT NULL,
  `cpfAluno` int(11) NOT NULL,
  `sexoAluno` varchar(50) NOT NULL,
  `enderecoAluno` varchar(50) NOT NULL,
  `cidadeAluno` varchar(50) NOT NULL,
  `estadoAluno` varchar(50) NOT NULL,
  `qualProf` varchar(50) NOT NULL,
  `objetivo` varchar(50) NOT NULL,
  `peso` int(11) NOT NULL,
  `altura` int(3) NOT NULL,
  `praticaAtiv` varchar(50) NOT NULL,
  `quantAtiv` varchar(50) NOT NULL,
  `problSaude` varchar(50) NOT NULL,
  `qualProbl` varchar(50) NOT NULL,
  `comentarioAluno` varchar(150) NOT NULL,
  `idadeAluno` int(3) NOT NULL,
  `foneAluno` int(11) NOT NULL,
  `fotoPerfilAluno` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Despejando dados para a tabela `aluno`
--

INSERT INTO `aluno` (`idAluno`, `nomeAluno`, `emailAluno`, `senhaAluno`, `cpfAluno`, `sexoAluno`, `enderecoAluno`, `cidadeAluno`, `estadoAluno`, `qualProf`, `objetivo`, `peso`, `altura`, `praticaAtiv`, `quantAtiv`, `problSaude`, `qualProbl`, `comentarioAluno`, `idadeAluno`, `foneAluno`, `fotoPerfilAluno`) VALUES
(45, 'Jose Damasceno ', 'jose@gmail.com ', '123456', 74849, 'masculino', 'Rua tutu', 'São Paulo ', 'São Paulo ', 'personal', 'ganhoMassa', 90, 177, 'sim', '6', 'nao', 'Nada', 'Teste', 50, 6373, 'dfb5fabf-e14e-485d-9271-f0bf00d517c7.jpeg'),
(64, 'Jairo Santos', 'jairo@gmail.com ', '123', 847383837, 'masculino', 'Rua 876', 'Goiânia ', 'Goiás ', 'personal', 'ganhoMassa', 85, 180, 'sim', '6', 'nao', 'Nenhum', 'Este é um teste importante para o desenvolvimento do aplicativo FitConnect. Um marco na história Fitness.', 45, 937, '4871c5dc-f46e-437c-a0db-b79fecf1d5f5.jpeg'),
(65, 'Kakakakk', 'kaka@gmail.com ', '7383i', 73828, '', 'Uwuuw', 'Uwuw', 'Uwiwu', '', '', 0, 0, '', '', '', '', '', 0, 72, 'f22cefe3-7eb7-4975-b42a-b560d6027bed.jpeg'),
(66, 'Zuzuzuleica', 'zu@gmail.com ', '123', 6282, '', 'Yeuwu', 'Uwywy', 'Ywywy', '', '', 0, 0, '', '', '', '', '', 0, 73838, 'dac058d4-5346-4627-930c-e2ddf564c9ca.jpeg');

-- --------------------------------------------------------

--
-- Estrutura para tabela `bike`
--

CREATE TABLE `bike` (
  `idBike` int(11) NOT NULL,
  `marca` varchar(20) NOT NULL,
  `modelo` varchar(20) NOT NULL,
  `descricao` varchar(255) NOT NULL,
  `valorHora` int(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Despejando dados para a tabela `bike`
--

INSERT INTO `bike` (`idBike`, `marca`, `modelo`, `descricao`, `valorHora`) VALUES
(3, 'SpeedyCycle', 'S1', 'Uma bicicleta leve e ágil, perfeita para ciclistas urbanos que buscam velocidade.', 5),
(4, 'EcoRide', 'E200', 'Uma bicicleta elétrica eco-friendly, ideal para passeios longos e sustentáveis.', 9),
(5, 'MontanhaMaster', 'M3000', 'Uma bicicleta de montanha resistente, projetada para enfrentar trilhas difíceis.', 10),
(6, 'UrbanCruiser', 'U500', 'Uma bicicleta confortável e elegante, perfeita para deslocamentos na cidade.', 7),
(7, 'TrekkingExplorer', 'T700', 'Uma bicicleta versátil, ideal para explorar tanto a cidade quanto o campo.', 7),
(8, 'RetroRider', 'R500', 'Uma bicicleta vintage com estilo clássico e desempenho moderno.', 6),
(9, 'XtremeTrail', 'RX8000', 'Uma bicicleta de trilha robusta, pronta para enfrentar terrenos extremos.', 11),
(10, 'FoldingCommuter', 'F450', 'Uma bicicleta dobrável perfeita para deslocamentos urbanos e fácil armazenamento.', 8),
(11, 'KidsJoy', 'K100', 'Uma bicicleta infantil colorida e segura, para as primeiras aventuras das crianças.', 4),
(12, 'ElectricFatBike', 'EFB600', 'Uma bicicleta elétrica com pneus largos, ideal para terrenos irregulares e trilhas.', 9),
(13, 'CityCruise', 'C300', 'Uma bicicleta urbana resistente, projetada para conforto em longos passeios na cidade.', 7),
(14, 'AeroSpeed', 'A700', 'Uma bicicleta aerodinâmica de alta performance, feita para ciclistas que buscam velocidade máxima.', 12),
(15, 'HybridExplorer', 'H200', 'Uma bicicleta híbrida versátil, perfeita para combinar passeios urbanos e trilhas leves.', 8),
(16, 'CruiserDelight', 'CD250', 'Uma bicicleta cruiser clássica, com estilo retro e conforto excepcional.', 7),
(17, 'AdventureSeeker', 'AS900', 'Uma bicicleta de aventura robusta, pronta para explorar novos caminhos e terrenos desafiadores.\r\n', 11);

-- --------------------------------------------------------

--
-- Estrutura para tabela `cadastrservprof`
--

CREATE TABLE `cadastrservprof` (
  `idCadastrServProv` int(11) NOT NULL,
  `id_do_prof` int(11) NOT NULL,
  `id_do_serv` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `contrat_serv_alunoprof`
--

CREATE TABLE `contrat_serv_alunoprof` (
  `idContrProf` int(11) NOT NULL,
  `id_aluno` int(11) NOT NULL,
  `id_servProf` int(11) NOT NULL,
  `id_do_prof` int(11) NOT NULL,
  `qtd` int(11) NOT NULL,
  `formPag` varchar(20) NOT NULL,
  `qtdVezes` int(2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `prof`
--

CREATE TABLE `prof` (
  `id` int(11) NOT NULL,
  `nome` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `senha` varchar(15) NOT NULL,
  `area` varchar(50) NOT NULL,
  `cpf` int(11) NOT NULL,
  `sexo` varchar(20) NOT NULL,
  `cidade` varchar(50) NOT NULL,
  `estado` varchar(50) NOT NULL,
  `conselho` int(11) NOT NULL,
  `formacao` varchar(50) NOT NULL,
  `certFormacao` varchar(200) NOT NULL,
  `certEspec1` varchar(200) NOT NULL,
  `certEspec2` varchar(50) NOT NULL,
  `certEspec3` varchar(50) NOT NULL,
  `comentarioProf` varchar(150) NOT NULL,
  `atendiOnLine` varchar(50) NOT NULL,
  `fotoPerfilProf` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Despejando dados para a tabela `prof`
--

INSERT INTO `prof` (`id`, `nome`, `email`, `senha`, `area`, `cpf`, `sexo`, `cidade`, `estado`, `conselho`, `formacao`, `certFormacao`, `certEspec1`, `certEspec2`, `certEspec3`, `comentarioProf`, `atendiOnLine`, `fotoPerfilProf`) VALUES
(81, 'Rafael Silva', 'rafa@gmail.com ', '123', 'Ed Fisica', 72728, 'masculino', 'Yeuwu', 'Ywywy', 0, 'Hwhwh', '', '', '', '', 'Teste', 'sim', 'c3f5a632-2711-4ad0-9a76-49e073a96efc.jpeg'),
(82, 'Nilce Pereira ', 'nilce@gmail.com ', '123', 'Ed Fisica', 73939, 'feminino', 'São Paulo ', 'São Paulo ', 7383838, 'Ed Física ', '', '', '', '', 'Nada nada não ', 'sim', 'f2a95779-4d67-4503-ba4d-37527a091288.jpeg'),
(84, 'Maria Francisca', 'franm@gmail.com ', '123', 'Nutricao', 83939, 'feminino', 'Goiânia ', 'Goiás ', 84938, 'Ed Física ', '', '', '', '', 'Vamos lá ', 'sim', '0d6d3502-5c39-4b41-9694-709cf15b5ae3.jpeg'),
(85, 'Madona', 'mad@gmail.com ', '123', 'Educação Física', 738399, 'masculino', 'Goiânia ', 'Goiás 84949', 0, '74849', '', '', '', '', 'Madoooooooona', 'sim', '746c3481-acd7-4f78-bec6-0141df72cf55.jpeg');

-- --------------------------------------------------------

--
-- Estrutura para tabela `serv_prof`
--

CREATE TABLE `serv_prof` (
  `idServProf` int(11) NOT NULL,
  `id_do_prof` int(11) NOT NULL,
  `servico` varchar(20) NOT NULL,
  `valor` int(5) NOT NULL,
  `descri_serv` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `aluguelbike`
--
ALTER TABLE `aluguelbike`
  ADD PRIMARY KEY (`idAlugBike`),
  ADD KEY `alugBike2` (`id_da_bike`),
  ADD KEY `alugBike1` (`id_do_aluno`);

--
-- Índices de tabela `aluno`
--
ALTER TABLE `aluno`
  ADD PRIMARY KEY (`idAluno`);

--
-- Índices de tabela `bike`
--
ALTER TABLE `bike`
  ADD PRIMARY KEY (`idBike`);

--
-- Índices de tabela `cadastrservprof`
--
ALTER TABLE `cadastrservprof`
  ADD PRIMARY KEY (`idCadastrServProv`),
  ADD KEY `cadServProf1` (`id_do_prof`),
  ADD KEY `cadServProf2` (`id_do_serv`);

--
-- Índices de tabela `contrat_serv_alunoprof`
--
ALTER TABLE `contrat_serv_alunoprof`
  ADD PRIMARY KEY (`idContrProf`),
  ADD KEY `contratProf` (`id_aluno`),
  ADD KEY `ContratProf2` (`id_servProf`),
  ADD KEY `contratProf3` (`id_do_prof`);

--
-- Índices de tabela `prof`
--
ALTER TABLE `prof`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `serv_prof`
--
ALTER TABLE `serv_prof`
  ADD PRIMARY KEY (`idServProf`),
  ADD KEY `servProf1` (`id_do_prof`);

--
-- AUTO_INCREMENT para tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `aluguelbike`
--
ALTER TABLE `aluguelbike`
  MODIFY `idAlugBike` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de tabela `aluno`
--
ALTER TABLE `aluno`
  MODIFY `idAluno` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=67;

--
-- AUTO_INCREMENT de tabela `bike`
--
ALTER TABLE `bike`
  MODIFY `idBike` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT de tabela `cadastrservprof`
--
ALTER TABLE `cadastrservprof`
  MODIFY `idCadastrServProv` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `contrat_serv_alunoprof`
--
ALTER TABLE `contrat_serv_alunoprof`
  MODIFY `idContrProf` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `prof`
--
ALTER TABLE `prof`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=86;

--
-- AUTO_INCREMENT de tabela `serv_prof`
--
ALTER TABLE `serv_prof`
  MODIFY `idServProf` int(11) NOT NULL AUTO_INCREMENT;

--
-- Restrições para tabelas despejadas
--

--
-- Restrições para tabelas `aluguelbike`
--
ALTER TABLE `aluguelbike`
  ADD CONSTRAINT `alugBike1` FOREIGN KEY (`id_do_aluno`) REFERENCES `aluno` (`idAluno`),
  ADD CONSTRAINT `alugBike2` FOREIGN KEY (`id_da_bike`) REFERENCES `bike` (`idBike`);

--
-- Restrições para tabelas `cadastrservprof`
--
ALTER TABLE `cadastrservprof`
  ADD CONSTRAINT `cadServProf1` FOREIGN KEY (`id_do_prof`) REFERENCES `prof` (`id`),
  ADD CONSTRAINT `cadServProf2` FOREIGN KEY (`id_do_serv`) REFERENCES `serv_prof` (`idServProf`);

--
-- Restrições para tabelas `contrat_serv_alunoprof`
--
ALTER TABLE `contrat_serv_alunoprof`
  ADD CONSTRAINT `ContratProf2` FOREIGN KEY (`id_servProf`) REFERENCES `serv_prof` (`idServProf`),
  ADD CONSTRAINT `contratProf` FOREIGN KEY (`id_aluno`) REFERENCES `aluno` (`idAluno`),
  ADD CONSTRAINT `contratProf3` FOREIGN KEY (`id_do_prof`) REFERENCES `prof` (`id`);

--
-- Restrições para tabelas `serv_prof`
--
ALTER TABLE `serv_prof`
  ADD CONSTRAINT `servProf1` FOREIGN KEY (`id_do_prof`) REFERENCES `prof` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
