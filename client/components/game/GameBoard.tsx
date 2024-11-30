import React, { FC, act, useState } from 'react';
import Card from './Card';
import ActionSelect from './ActionSelect';
import sampleDeckData from './sampleDeckData';
// import Gameplay from './Gameplay';


interface CardType {
  name: string;
  damage: number;
  armor: number;
  description: string;
}
type GameBoardProp = {
  session: string;
  socket: any
  user: any
  userDecks: any
  deckSelected: any
  endTurn: any
  playerAction: any
  setPlayerAction: any
  handSize: any

  enemyName: any
  enemyAction: any
  enemyLastAction: any
  enemyHitPoints: number
  enemyCard: any
  enemyTurnEnd: any
  enemyArmed: any

  cardToPlay: any
  setCardToPlay: any
  weaponArmed: any
  setWeaponArmed: any
  hitPoints: number
  roundNum: number
  turnEnded: any
  setTurnEnded: any
  activeLoading: any
  setActiveLoading: any
  actionClick: any

  discard: any

}

const GameBoard: FC <GameBoardProp> = ({
  session,
  socket,
  user,
  userDecks,
  deckSelected,
  handSize,

  playerAction,
  setPlayerAction,
  cardToPlay,
  setCardToPlay,
  endTurn,
  turnEnded,
  hitPoints,

  enemyName,
  enemyAction,
  enemyLastAction,
  enemyHitPoints,
  enemyCard,
  enemyTurnEnd,
  enemyArmed,

  weaponArmed,
  setWeaponArmed,
  roundNum,
  setTurnEnded,
  activeLoading,
  setActiveLoading,
  actionClick
}) => {
  

  const shuffle = array =>{
    for (let i = array.length - 1; i > 0; i--){
      let j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array
  }
  //////////////////////////////////
  
  const [playerHand, setPlayerHand] = useState(shuffle(deckSelected).slice(0, 3))


///////////////////////////////////////////////////////

  const opponentCards: CardType[] = [
    {
      name: '',
      damage: 0,
      armor: 0,
      description: ''
    },
    {
      name: '',
      damage: 0,
      armor: 0,
      description: ''
    },
    {
      name: '',
      damage: 0,
      armor: 0,
      description: ''
    },
  ];

///////// default attack card //////////////////////////////////////////////

  const phaserCharge: CardType[] = [{
    name: 'Phaser Charge',
    attack: 10,
    defense: 0,
    description: 'last-resort shield-to-phaser power conversion'
  }]

/////////// discard a card /////////////////////////////////////////
const discard = (cardName: any) =>{

  setPlayerHand(playerHand.filter(card=>card.name!==cardName))
  console.log(sampleDeckData)
  
}
// console.log("PLAYER HAND LENGTH", playerHand.length)

/////// check if out of cards //////////////////////////////////////////

if (playerHand.length < 3 && sampleDeckData.length > 0){
  shuffle(sampleDeckData)
  let nextCard = [sampleDeckData.pop()]
  // console.log("NEXT CARD", nextCard)
  setPlayerHand(playerHand.concat(nextCard))
}

if (playerHand.length === 0){
  setPlayerHand(phaserCharge)
}

// console.log("USER:::", user)

//////////////////////////////////////////////////////
  return (
    <>
    <div className=' z-10 flex-grow flex-col [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]' >
    
      <div className='flex flex-row justify-between p-3'>
        <div>
          <div className='p-2 text-white'>TIME: 00:00 / ROUND {roundNum}</div>
        </div>
        <div className="flex flex-row">
          {opponentCards.map((card, index) => (

          <img src='https://i.imgur.com/y1g83zB.png' className="rounded-lg shadow-md p-0 m-2 w-45 h-60 flex flex-col items-center justify-between "
          key={index}
            />


          ))}
        </div>
        <div>
          <div className='text-red-800 font-bold'>{enemyName}</div>
          <div className='text-red-600 font-bold'> {enemyHitPoints}/50 Hull Integrity</div>
        </div>
      </div>
      <div className='flex flex-row justify-between p-3 h-86'>
        <div>
          <div className='justify-center p-20'><img src='https://i.imgur.com/V6LW3e4.png' className='scale-x-[-.75] scale-y-[.75]'/></div>
        </div>
        <div className='flex flex-row justify-between h-70'>


          <div>
            {enemyArmed?

              <div className='p-20 text-[2rem] text-red-600'>ENEMY STATUS: ARMED</div>

              :

              <div className='p-20 text-[2rem] text-red-600'> ENEMY STATUS: </div>

            }
          </div>


          <div>

            {cardToPlay?

    <div className="bg-white border-8 border-red-600 rounded-lg shadow-md p-4 m-2 w-40 h-60 flex flex-col items-center justify-between hover:scale-110">
      <h2 className="text-lg font-bold mb-2 text-center">{cardToPlay[0]}</h2>
      <div className="text-center">
        <div>`IMAGE`</div>
        <p className="text-gray-700 mb-1">
          <strong>Attack:</strong> {cardToPlay[1]}
        </p>
        <p className="text-gray-700 mb-1">
          <strong>Defense:</strong> {cardToPlay[2]}
        </p>
      </div>
      <p className="text-gray-600 text-sm text-center">{cardToPlay[3]}</p>
    </div>


              :

              <div className='p-20 text-[2rem] text-green-500'> MUNITION STATUS: </div>

          }
          </div>


        </div>
        <div>
          <div className='p-20'> <img src='https://i.imgur.com/4paq921.png' className='scale-x-[.75] scale-y-[.75]'/></div>
        </div>
      </div>
      <div className='flex flex-row justify-between p-3'>
        <div className='flex flex-col p-3'>
          <div className='text-green-600 font-bold'>{user.name}</div>
          <div className='text-blue-600 font-bold'>Hull Integrity: {hitPoints}/50</div>
          <br></br>
          <br></br>

          <ActionSelect 
          playerAction={playerAction}
          enemyLastAction={enemyLastAction}
          cardToPlay={cardToPlay}
          turnEnded={turnEnded}
          activeLoading={activeLoading}
          actionClick={actionClick}
          enemyCard={enemyCard}
          enemyTurnEnd={enemyTurnEnd}
         
          />
        </div>


        <div className="flex flex-row">

              {playerHand
                .map((card, index) => {
                  // console.log("CAAAARD", card)
          return(

            <Card
            // discard={discard}
            key={index}
            card={card}
            setCardToPlay={setCardToPlay}
            playerAction={playerAction}
            setActiveLoading={setActiveLoading}
            playerHand={undefined}                   />
          )
})}

        </div>

        <div className='flex flex-col p-4'>
          <div>
              {

            // !turnEnded || playerAction !== '' ?
            ((playerAction === 'fire' || playerAction === 'block' || (playerAction === 'load' && activeLoading)) && !turnEnded) || (turnEnded && enemyAction)?

            <button className='p-4 flex items-end justify-end bg-emerald-500  hover:bg-emerald-900 text-white font-bold focus:ring-4 focus:ring-emerald-600 '

          onClick={(e)=>{

            console.log("click")

            setTurnEnded(true)

            endTurn()

            if (playerAction === 'fire'){
                discard(cardToPlay[0])
            }

          }}>COMMIT TURN</button>


            :

            <button className='cursor-not-allowed p-4 flex items-end justify-end bg-gray-500  text-white font-bold'
            >COMMIT TURN</button>

            }
          </div>
          <div>
            {enemyAction?
            
              <div className='text-red-600 text-[1rem]' >
                opponent waiting
              </div>
            :
            
            null
          }

          </div>
        </div>

      </div>
    </div>
  </>
  )
};

export default GameBoard;

///////////////////////////////////////////////


// console.log("DECK SELECTED", userDecks)

// let playerCards = userDecks.filter((deck: { deck_name: any; })=>deck.deck_name === deckSelected)

// console.log("PLAYER CARDS", playerCards[0].User_Decks_Cards)

// console.log("DECK SELECTED", playerCards )

// let startingHand: any = []


// const [shuffledDeck, setShuffledDeck] = useState(shuffle(playerCards))
  // const shuffledDeck = shuffle(deckSelected)
// const [startingHand, setStartingHand] = useState(shuffledDeck.slice(0, 3))
  
  
  // console.log("SHUFFLED DECK", shuffledDeck)
  // console.log("startingHand", startingHand)
  
  
  // for (let i = 0; i < handSize; i++){
  //   startingHand.push(shuffledDeck.pop())
  // }
  
  // console.log("STARTINGHAND", startingHand)


  

  // let playerCards: CardType[] = [
  //   {
  //     name: 'Bomba',
  //     attack: 15,
  //     defense: 0,
  //     description: 'Increase Attack Power of your bullet',
  //   },
  //   {
  //     name: 'Rocket',
  //     attack: 20,
  //     defense: 0,
  //     description: 'Explosive attack dealing area damage.',
  //   },
  //   {
  //     name: 'Plasma Shield',
  //     attack: 0,
  //     defense: 15,
  //     description: 'Increase Defense Power of your shield',
  //   },
  // ];

  // const [cardToPlay, setCardToPlay] = useState('')
