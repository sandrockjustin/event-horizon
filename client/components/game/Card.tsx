import React, { FC } from 'react';

interface CardType {
  name: string;
  attack: number;
  defense: number;
  description: string;
}

interface CardProps {
  card: CardType;
}

const Card: FC<CardProps> = ({ card }) => {
  return (
    <div className="bg-white border rounded-lg shadow-md p-4 m-2 w-40 h-60 flex flex-col items-center justify-between hover:scale-110">
      <h2 className="text-lg font-bold mb-2 text-center">{card.name}</h2>
      <div className="text-center">
        <div>`IMAGE`</div>
        <p className="text-gray-700 mb-1">
          <strong>Attack:</strong> {card.attack}
        </p>
        <p className="text-gray-700 mb-1">
          <strong>Defense:</strong> {card.defense}
        </p>
      </div>
      <p className="text-gray-600 text-sm text-center">{card.description}</p>
    </div>
  );
}
export default Card;
