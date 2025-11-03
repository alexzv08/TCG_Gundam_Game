/*!40014 SET FOREIGN_KEY_CHECKS=0*/;
/*!40101 SET NAMES binary*/;
CREATE TABLE `cartas` (
  `id_juego` varchar(10) COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `id_coleccion` varchar(10) COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `id_carta` varchar(10) COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `card_name` varchar(100) COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `level` int(11) DEFAULT NULL,
  `cost` int(11) DEFAULT NULL,
  `card_type` varchar(50) COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `ap` int(11) DEFAULT NULL,
  `hp` int(11) DEFAULT NULL,
  `color` varchar(50) COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `link` text COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `trait` text COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `zone` varchar(100) COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `alt` varchar(50) COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `translation` text COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `rarity` varchar(10) COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `show_name` varchar(100) COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `subtitle` varchar(255) COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `artist` varchar(255) COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `image_url` varchar(500) COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  PRIMARY KEY (`id_juego`,`id_coleccion`,`id_carta`) /*T![clustered_index] CLUSTERED */,
  UNIQUE KEY `idx_cartas` (`id_carta`,`id_coleccion`,`id_juego`),
  KEY `id_coleccion` (`id_coleccion`),
  CONSTRAINT `cartas_ibfk_1` FOREIGN KEY (`id_coleccion`) REFERENCES `GundamTCG`.`coleccion` (`id_coleccion`) ON DELETE CASCADE,
  CONSTRAINT `cartas_ibfk_2` FOREIGN KEY (`id_juego`) REFERENCES `GundamTCG`.`coleccion` (`id_Juego`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
