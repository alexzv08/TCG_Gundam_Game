// frontend/src/hooks/useEffectSystem.js
import { useCallback } from 'react';
import { parseEffect } from '../utils/effectParser';
import { useGame } from '../context/GameContext';

export const useEffectSystem = () => {
    const {
        hand,
        deck,
        battleCards,
        socket,
        playerId,
        currentPlayer,
        resources,
        shields,
        trash,
        phase,
        drawCard,
        addResourceEx,
        // Más funciones del contexto que necesitemos
    } = useGame();

    // Ejecuta un efecto basado en su tipo y condiciones
    const executeEffect = useCallback((effect, sourceCard, targetCard = null) => {
        if (!effect) return;

        console.log('Executing effect:', effect);

        // Verificar si estamos en el turno del jugador actual
        const isMyTurn = currentPlayer === playerId;

        // Para efectos que requieren que sea tu turno
        if (effect.conditions.includes('YOUR_TURN') && !isMyTurn) {
            return;
        }

        // Ejecutar acción según el tipo
        switch (effect.actions[0]) {
            case 'HEAL':
                // Implementar recuperación de HP
                if (sourceCard && effect.values.healAmount) {
                    console.log(`Healing <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mrow><mi>s</mi><mi>o</mi><mi>u</mi><mi>r</mi><mi>c</mi><mi>e</mi><mi>C</mi><mi>a</mi><mi>r</mi><mi>d</mi><mi mathvariant="normal">.</mi><mi>c</mi><mi>a</mi><mi>r</mi><msub><mi>d</mi><mi>n</mi></msub><mi>a</mi><mi>m</mi><mi>e</mi></mrow><mi>f</mi><mi>o</mi><mi>r</mi></mrow><annotation encoding="application/x-tex">{sourceCard.card_name} for </annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.8889em;vertical-align:-0.1944em;"></span><span class="mord"><span class="mord mathnormal">so</span><span class="mord mathnormal">u</span><span class="mord mathnormal">rce</span><span class="mord mathnormal" style="margin-right:0.07153em;">C</span><span class="mord mathnormal">a</span><span class="mord mathnormal" style="margin-right:0.02778em;">r</span><span class="mord mathnormal">d</span><span class="mord">.</span><span class="mord mathnormal">c</span><span class="mord mathnormal">a</span><span class="mord mathnormal" style="margin-right:0.02778em;">r</span><span class="mord"><span class="mord mathnormal">d</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.1514em;"><span style="top:-2.55em;margin-left:0em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mathnormal mtight">n</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span></span></span></span><span class="mord mathnormal">am</span><span class="mord mathnormal">e</span></span><span class="mord mathnormal" style="margin-right:0.10764em;">f</span><span class="mord mathnormal" style="margin-right:0.02778em;">or</span></span></span></span>{effect.values.healAmount} HP`);
                    const updatedCard = {
                        ...sourceCard,
                        hp: Math.min((sourceCard.hp || 0) + effect.values.healAmount, sourceCard.originalHp || sourceCard.hp)
                    };

                    // Aquí actualizaríamos el estado de la carta y emitiríamos vía socket
                    // updateBattleCard(updatedCard);
                }
                break;

            case 'ADD_EX_RESOURCE':
                // Añadir recurso EX
                if (effect.values.resourceAmount) {
                    console.log(`Adding ${effect.values.resourceAmount} EX resources`);
                    addResourceEx();
                }
                break;

            case 'DRAW':
                // Robar cartas
                if (effect.values.drawAmount) {
                    console.log(`Drawing ${effect.values.drawAmount} cards`);
                    drawCard(effect.values.drawAmount);
                }
                break;

            case 'BOOST_AP':
                // Aumentar AP de unidades
                if (effect.targets.includes('ALL_FRIENDLY_UNITS') && effect.values.apBoost) {
                    console.log(`Boosting all friendly units AP by ${effect.values.apBoost}`);
                    // Aquí implementaríamos la lógica para aumentar AP de todas las unidades
                    // updateBattleCardsAP(effect.values.apBoost);
                }
                break;

            case 'RETURN_TO_HAND':
                // Devolver unidad enemiga a la mano
                if (targetCard && effect.conditions.includes('TARGET_HP_LESS_THAN_OR_EQUAL_4')) {
                    if ((targetCard.hp || 0) <= 4) {
                        console.log(`Returning ${targetCard.card_name} to hand`);
                        // Aquí implementaríamos la lógica para devolver la carta enemiga a la mano
                        // returnCardToHand(targetCard);
                    }
                }
                break;

            // Más casos para otros tipos de efectos

            default:
                console.log('Effect not implemented yet:', effect.actions[0]);
        }
    }, [playerId, currentPlayer, drawCard, addResourceEx]);

    // Procesa una carta para ver si tiene efectos que deban activarse en un momento específico
    const processCardEffectsForTrigger = useCallback((triggerType, card) => {
        if (!card || !card.translation) return;

        const effect = parseEffect(card.translation);
        if (effect && effect.triggerType === triggerType) {
            executeEffect(effect, card);
        }
    }, [executeEffect]);

    // Maneja efectos al jugar una carta
    const handleCardPlay = useCallback((card) => {
        console.log('Card played:', card);
        if (!card) return;

        const effect = parseEffect(card.translation);
        if (effect && effect.triggerType === 'DEPLOY') {
            executeEffect(effect, card);
        }
    }, [executeEffect]);

    // Maneja efectos al final del turno
    const handleEndTurn = useCallback(() => {
        console.log('End turn triggered');

        // Procesamos todas las cartas en el área de batalla para efectos de fin de turno
        battleCards.forEach(card => {
            processCardEffectsForTrigger('END_OF_TURN', card);
        });
    }, [battleCards, processCardEffectsForTrigger]);

    // Maneja efectos al emparejar cartas
    const handleCardPaired = useCallback((pilotCard, unitCard) => {
        console.log('Cards paired:', pilotCard, unitCard);

        // Procesar efecto "When Paired" del piloto
        const pilotEffect = parseEffect(pilotCard?.translation);
        if (pilotEffect && pilotEffect.triggerType === 'WHEN_PAIRED') {
            // Verificar condiciones específicas de emparejamiento
            if (pilotEffect.conditions.includes('PAIRED_WITH_WHITE_BASE_TEAM') &&
                unitCard?.trait?.includes('White Base Team')) {
                executeEffect(pilotEffect, pilotCard);
            }
            else if (pilotEffect.conditions.includes('PAIRED_WITH_LV4_PILOT') &&
                parseInt(unitCard?.level || 0) >= 4) {
                executeEffect(pilotEffect, pilotCard);
            }
        }

        // Activar efectos "During Pair"
        const unitEffect = parseEffect(unitCard?.translation);
        if (unitEffect && unitEffect.triggerType === 'PAIRED') {
            // Este efecto se queda activo mientras las cartas estén emparejadas
            // Podríamos añadirlo a un array de "efectos activos"
        }
    }, [executeEffect]);

    return {
        handleCardPlay,
        handleEndTurn,
        handleCardPaired,
        executeEffect,
    };
};
