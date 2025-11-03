/*!40014 SET FOREIGN_KEY_CHECKS=0*/;
/*!40101 SET NAMES binary*/;
CREATE TABLE `coleccion` (
  `id_coleccion` varchar(10) COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `nombre` varchar(150) COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `id_Juego` varchar(10) COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `fecha_Salida` date DEFAULT NULL,
  PRIMARY KEY (`id_coleccion`) /*T![clustered_index] CLUSTERED */,
  KEY `id_Juego` (`id_Juego`),
  CONSTRAINT `coleccion_ibfk_1` FOREIGN KEY (`id_Juego`) REFERENCES `GundamTCG`.`juego` (`id_Juego`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
