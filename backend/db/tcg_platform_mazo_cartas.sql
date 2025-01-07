-- MySQL dump 10.13  Distrib 8.0.32, for Win64 (x86_64)
--
-- Host: localhost    Database: tcg_platform
-- ------------------------------------------------------
-- Server version	8.0.32

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `mazo_cartas`
--

DROP TABLE IF EXISTS `mazo_cartas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mazo_cartas` (
  `id_mazo` int NOT NULL,
  `id_juego` varchar(10) DEFAULT NULL,
  `id_coleccion` varchar(10) DEFAULT NULL,
  `id_carta` varchar(10) NOT NULL,
  `cantidad` int DEFAULT NULL,
  PRIMARY KEY (`id_mazo`,`id_carta`),
  UNIQUE KEY `unique_mazo_carta` (`id_mazo`,`id_carta`),
  KEY `id_carta` (`id_carta`),
  KEY `id_coleccion` (`id_coleccion`),
  KEY `id_juego` (`id_juego`),
  CONSTRAINT `mazo_cartas_ibfk_1` FOREIGN KEY (`id_mazo`) REFERENCES `mazos` (`id_mazo`) ON DELETE CASCADE,
  CONSTRAINT `mazo_cartas_ibfk_2` FOREIGN KEY (`id_carta`) REFERENCES `cartas` (`id_carta`) ON DELETE CASCADE,
  CONSTRAINT `mazo_cartas_ibfk_3` FOREIGN KEY (`id_coleccion`) REFERENCES `cartas` (`id_coleccion`) ON DELETE CASCADE,
  CONSTRAINT `mazo_cartas_ibfk_4` FOREIGN KEY (`id_juego`) REFERENCES `cartas` (`id_juego`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-01-06 11:22:07
