ALTER TABLE `tcg_platform`.`usuarios`
    ADD COLUMN `mmr` INT NOT NULL DEFAULT 1000 AFTER `isVerified`,
    ADD COLUMN `victorias` INT NOT NULL DEFAULT 0 AFTER `mmr`,
    ADD COLUMN `derrotas` INT NOT NULL DEFAULT 0 AFTER `victorias`,
    -- Columna calculada para facilitar las consultas
    ADD COLUMN `partidasJugadas` INT GENERATED ALWAYS AS (`victorias` + `derrotas`) STORED AFTER `derrotas`;
    
    
    -- -----------------------------------------------------
-- 2. CREAR la tabla `match_history`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `tcg_platform`.`match_history` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `matchId` VARCHAR(36) NOT NULL UNIQUE,      -- ID único global (UUID de Node.js)
    `timestampFin` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `duracionSegundos` INT NOT NULL,
    
    `ganador_id`  VARCHAR(50) NOT NULL,
    `perdedor_id` VARCHAR(50) NOT NULL,
    
    `mmr_ganador_antes` INT NOT NULL,
    `mmr_perdedor_antes` INT NOT NULL,
    `mmr_ganador_despues` INT NOT NULL,
    `mmr_perdedor_despues` INT NOT NULL,
    `mmr_cambio` INT NOT NULL,                  -- Cambio absoluto de MMR aplicado
    
    -- CLAVE para registro de partidas
    PRIMARY KEY (`id`),
    
    -- CLAVES FORÁNEAS
    FOREIGN KEY (`ganador_id`) REFERENCES `usuarios`(`usuario`),
    FOREIGN KEY (`perdedor_id`) REFERENCES `usuarios`(`usuario`)
);