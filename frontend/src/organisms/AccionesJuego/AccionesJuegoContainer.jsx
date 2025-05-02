// src/organisms/AccionesJuego/AccionesJuegoContainer.jsx
import AccionesJuego from './AccionesJuego';
import { useGame } from '../../context/GameContext';

export default function AccionesJuegoContainer() {
  const { deck, setDeck, hand, setHand, shields, setShieldArea, myResources, setMyResources, endTurn } = useGame();

  return (
    <AccionesJuego
      deck={deck}
      setDeck={setDeck}
      hand={hand}
      setHand={setHand}
      shield={shields}
      setShieldArea={setShieldArea}
      myResources={myResources}
      setMyResources={setMyResources}
      endTurn={endTurn} 
    />
  );
}
