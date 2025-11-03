/*!40014 SET FOREIGN_KEY_CHECKS=0*/;
/*!40101 SET NAMES binary*/;
CREATE TABLE `juego` (
  `id_Juego` varchar(10) COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `nombre` varchar(150) COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`id_Juego`) /*T![clustered_index] CLUSTERED */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
