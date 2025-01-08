export const GameStates = {
    START_PHASE: {
        name: "START_PHASE",
        phase: {
            INITIAL_DRAW: "INITIAL_DRAW",
            MULLIGAN: "MULLIGAN",
            SHIELD_FORCE: "SHIELD_FORCE",
            TOKEN_BASE: "TOKEN_BASE",
            TOKEN_RESOURCE: "TOKEN_RESOURCE",
        }
    },
    START_TURN: {
        name: "START TURN",
        phase: {
            UNSUSPEND_PHASE: "UNSUSPEND_PHASE",
            DRAW_PHASE: "DRAW_PHASE",
            RESORCE_PHASE: "RESORCE_PHASE",
            MAIN_PHASE: "MAIN_PHASE",
        }
    },
    FINAL_PHASE: {
        name: "FINAL_PHASE",
        phase: {
            ACTION_PHASE: "ACTION_PHASE",
            DISCART_HAND: "DISCART_HAND"
        }
    },
    END_PHASE:  {
        name:"END_PHASE",
        phase: {
            END_PHASE:"END_PHASE"
        }    
    },
};

// Clase Game
class Game {
    constructor() {
        this.currentState = GameStates.START_PHASE.phase.INITIAL_DRAW;
        this.phaseGroups = Object.keys(GameStates);  // Obtenemos todos los grupos de fases
        this.currentGroupIndex = 0;  // Indicador del grupo de fases actual
    }

    isValidPhase(phase) {
        for (const phaseGroup in GameStates) {
            if (typeof GameStates[phaseGroup] === "object" && GameStates[phaseGroup].phase[phase]) {
                return true;
            } else if (GameStates[phaseGroup] === phase) {
                return true;
            }
        }
        return false;
    }

    executePhase() {
        switch (this.currentState) {
            case GameStates.START_PHASE.phase.INITIAL_DRAW:
                this.initialDraw();
                break;
            case GameStates.START_PHASE.phase.MULLIGAN:
                this.mulligan();
                break;
            case GameStates.START_PHASE.phase.SHIELD_FORCE:
                this.endPhase();
            break;
            case GameStates.START_PHASE.phase.TOKEN_BASE:
                this.endPhase();
            break;
            case GameStates.START_PHASE.phase.TOKEN_RESOURCE:
                this.endPhase();
            break;
            case GameStates.START_TURN.phase.UNSUSPEND_PHASE:
                this.unsuspendPhase();
                break;
            case GameStates.START_TURN.phase.DRAW_PHASE:
                this.drawPhase();
                break;
            case GameStates.FINAL_PHASE.phase.RESOURCE_PHASE:
                this.resourcePhase();
                break;
            case GameStates.END_PHASE:
                this.endPhase();
                break;
            default:
                console.log("Fase desconocida.");
        }

        
    }

    // Funciones para avanzar entre las funciones de la partida
    advancePhase() {
        // Verificamos si el grupo actual y las fases existen
        const currentPhaseGroup = GameStates[this.phaseGroups[this.currentGroupIndex]];
    
        if (currentPhaseGroup && currentPhaseGroup.phase) {
            const currentPhases = Object.values(currentPhaseGroup.phase);
            const currentIndex = currentPhases.indexOf(this.currentState);
    
            
    
            if (currentIndex < currentPhases.length - 1) {
                // Avanzamos a la siguiente fase dentro del grupo actual
                const nextPhase = currentPhases[currentIndex + 1];
    
                if (nextPhase === GameStates.END_PHASE.phase.END_PHASE) {
                    console.log("Volviendo a START_TURN.phase.UNSUSPEND_PHASE");
                    this.changePhase(GameStates.START_TURN.phase.UNSUSPEND_PHASE);
                    return;
                }
    
                this.changePhase(nextPhase);
            } else {
                // Si estamos en la última fase del grupo actual
                if (this.currentGroupIndex < this.phaseGroups.length - 1) {
                    this.currentGroupIndex++;
                    const nextPhaseGroup = GameStates[this.phaseGroups[this.currentGroupIndex]];
    
                    if (nextPhaseGroup && nextPhaseGroup.phase) {
                        const firstPhase = Object.values(nextPhaseGroup.phase)[0];
                        this.changePhase(firstPhase);
                    } else {
                        console.error("El siguiente grupo no tiene fases definidas.");
                    }
                } else {
                    // Si estamos en el último grupo y fase, volvemos al inicio
                    console.log("Terminando el turno, reiniciando al inicio.");
                    this.currentGroupIndex = 1; // Reiniciamos al índice del grupo START_TURN
                    this.changePhase(GameStates.START_TURN.phase.UNSUSPEND_PHASE);
                }
            }
        } else {
            console.error("El grupo actual no tiene fases definidas.");
        }

        console.log("La fase actual es:", this.currentState);
    }
    
    
    
    
    
    
    

    changePhase(newState) {
        if (this.isValidPhase(newState)) {
            this.currentState = newState;
        } else {
            console.log("Fase no válida");
        }
    }


    // Aquí van las funciones que quieres ejecutar en cada fase
    initialDraw() {
        console.log("Ejecutando la fase de inicio: DRAW inicial.");
    }

    mulligan() {
        console.log("Ejecutando la fase de mulligan.");
    }

    unsuspendPhase() {
        console.log("Ejecutando la fase de desuspensión.");
    }

    drawPhase() {
        console.log("Ejecutando la fase de robar cartas.");
    }

    resourcePhase() {
        console.log("Ejecutando la fase de recursos.");
    }

    endPhase() {
        console.log("Finalizando la partida.");
    }
}

export default Game;
