import React, { FC, act, useState } from 'react';
import Card from './Card';
import ActionSelect from './ActionSelect';
import FxText from './FxText';
import sampleDeckData from './sampleDeckData';
// import Gameplay from './Gameplay';


interface CardType {
  name: string;
  damage: number;
  armor: number;
  description: string;
  id: number;
}
type GameBoardProp = {
  session: string;
  socket: any
  roundActual: any
  user: any
  userDecks: any
  deckSelected: any
  cardReplacement: any
  setCardReplacement: any
  reloaded: any
  setReloaded: any

  endTurn: any
  playerAction: any
  setPlayerAction: any
  handSize: any
  gameDeck: any
  setGameDeck: any
  playerHand: any
  setPlayerHand: any

  enemyName: any
  enemyAction: any
  enemyWaiting: any
  enemyLastAction: any
  enemyHitPoints: number
  enemyArmor: number
  enemyCard: any
  enemyTurnEnd: any
  enemyArmed: any
  enemyHand: any

  cardToPlay: any
  setCardToPlay: any
  setCardId: any
  weaponArmed: any
  setWeaponArmed: any
  hitPoints: number
  setHitPoints: any
  armor: number

  turnEnded: any
  setTurnEnded: any
  activeLoading: any
  setActiveLoading: any
  actionClick: any

  discard: any
  setSelfDestruct: any
  selfDestruct: any
  forfeit: any

  userRound: any
  enemyRound: any
  myPrevRound: any
  theirPrevRound: any
  shieldBarShake: Boolean
  healthBarShake: Boolean

}

const GameBoard: FC <GameBoardProp> = ({
  session,
  socket,
  roundActual,
  user,
  userDecks,
  deckSelected,
  handSize,
  gameDeck,
  setGameDeck,
  playerHand,
  setPlayerHand,


  playerAction,
  setPlayerAction,
  cardToPlay,
  setCardToPlay,
  setCardId,
  cardReplacement,
  setCardReplacement,
  reloaded,
  setReloaded,

  endTurn,
  turnEnded,
  hitPoints,
  setHitPoints,
  armor,

  enemyName,
  enemyAction,
  enemyWaiting,
  enemyLastAction,
  enemyHitPoints,
  enemyArmor,
  enemyCard,
  enemyTurnEnd,
  enemyArmed,
  enemyHand,

  weaponArmed,
  setWeaponArmed,
  setTurnEnded,
  activeLoading,
  setActiveLoading,
  actionClick,
  setSelfDestruct,
  selfDestruct,
  forfeit,

  userRound,
  enemyRound,
  myPrevRound,
  theirPrevRound,
  healthBarShake,
  shieldBarShake

}) => {




///////// default attack card //////////////////////////////////////////////

  const phaserCharge: CardType[] = [{
    name: 'Phaser Charge',
    damage: 10,
    armor: 0,
    description: 'last-resort shield-to-phaser power conversion',
    id: 5
  }]

/////////// discard a card /////////////////////////////////////////
const discard = (cardName: any) =>{

  setPlayerHand(playerHand.filter(card=>card.name!==cardName))

}
// console.log("PLAYER HAND LENGTH", playerHand.length)

/////// check if out of cards //////////////////////////////////////////

// console.log("CARD TO REPLACE IN GAME DECK", cardReplacement)

if (reloaded && cardReplacement[0].user_id === user.id){
  console.log("RELOADED!")
  setGameDeck(gameDeck.concat(cardReplacement[0].card))
  setReloaded(false)
  setCardReplacement([])
}

// console.log("GAME DECK", gameDeck)


if (playerHand.length < 3 && gameDeck.length > 0){
 
  let nextCard = [gameDeck.pop()]
  // console.log("NEXT CARD", nextCard)
  // setPlayerHand(playerHand.concat(nextCard))
  setPlayerHand(playerHand)
}

if (playerHand.length <= 0){
  setPlayerHand(playerHand.concat(phaserCharge))
}

// console.log("USER:::", user)
// console.log("GAMEBOARD ENEMY HAND", enemyHand)

///////////////////////////////////////////////////////
  return (

    <div className='grid-cols-3 mt-10 p-5 pt-15 min-h-screen w-screen justify-between flex flex-row bg-starfield-light dark:bg-starfield bg-center bg-cover'>
      {/* FIRST COLUMN*/}
      <div className='m-2 flex flex-col justify-between' style={{ width: "25%"}}>
        {/* FIRST COLUMN 1st SECTION */}
        <div className='flex flex-col gap-3' style={{height: "33%"}}>
          <div className='text-text dark:text-darkText text-sm'>Encounter {session} VS {enemyName}</div>
          <div className='text-text dark:text-darkText text-sm'>ROUND : {roundActual}</div>
          {theirPrevRound.length && myPrevRound.length?
            <div>
            <FxText
                enemyName={enemyName}
                cardToPlay={cardToPlay}
                user={user}
                myPrevRound={myPrevRound}
                theirPrevRound={theirPrevRound}
                turnEnded={turnEnded}
            />
            </div>
            :
            // null
            <div className='bg-slate-400 flex flex-col p-1 gap-1 border-4 border-slate-600 rounded-lg shadow-md w-2/3'>LAST ROUND:</div>
            }
        </div>
        {/* FIRST COLUMN 2nd SECTION */}
        <div className='flex ' style={{height: "33%"}}>
          {/* USERS SHIP*/}
          <img src='https://i.imgur.com/V6LW3e4.png' className='aspect-square object-scale-down scale-x-[-.75] scale-y-[.75] max-h-50 outline outline-blue-600 rounded-full animate-outline-pulse'/>
        </div>
        {/* FIRST COLUMN 3rd SECTION */}
        <div className='' style={{height: "33%"}}>
          <div className='text-green-600 font-bold text-center pb-2'>{user.name}</div>
          <div className="w-full bg-gray-200 flex flex-grow flex-col gap-4 justify-items-end">
            <div className={`bg-slate-700 h-5 rounded-full text-center justify-items-center text-white text-sm pt-5 relative ${shieldBarShake ? 'animate-shake transition-all' : ''}`}>
              <div className={`bg-blue-400 h-5 rounded-full text-center justify-items-center text-white text-sm pt-5 absolute inset-y-0 ${shieldBarShake ? 'animate-shake transition-all' : ''}`}
                style={{ width: `${(armor/100) * 100}%` }}>
              </div>
              <div className='pl-4 h-5 justify-items-center flex-1 text-center whitespace-nowrap text-xs sm:text-sm inset-y-0 absolute'>{`Armor: ${armor}`}</div>
            </div>
            <div className={`flex bg-slate-600 h-5 rounded-full text-center relative justify-items-center text-white text-sm ${healthBarShake ? 'animate-shake transition-all' : ''}`}>
              <div className={`bg-error h-5 rounded-full text-center justify-items-end text-white text-sm transition-all ${healthBarShake ? 'animate-shake transition-all' : ''}`}
                style={{ width: `${(hitPoints / 50) * 100}%` }}
              ></div>
              <div className='pl-4 h-4 flex-1 justify-items-center whitespace-nowrap justify-center text-center text-sm inset-y-0 absolute'>{`Hull Integrity: ${hitPoints} / 50`}</div>
            </div>
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
        </div>
      </div>




      {/* 2ND COLUMN CARDS DISPLAY SECTION */}
      <div className="flex-col flex justify-between" style={{minHeight: "33%", width: "50%"}}>
        {/* 2ND COL: 1ST SECT : ENEMY CARDS */}
        <div className='flex flex-row justify-center gap-1 p-2 pt-5' style={{ maxHeight: "33%", maxWidth: "100%" }}>
          {enemyHand.map((card, index) => (
            <img
              src="https://i.imgur.com/Uvf7DCN.png"
              className="border-8 border-slate-600 rounded-lg shadow-md w-42 h-48 flex flex-col items-center justify-between hover:scale-110"
              key={index}
            />
          ))}
        </div>
        {/* 2ND COL: 2ND SECT : PLAYED CARDS STATUS */}
        <div className='flex flex-row justify-between' style={{ minHeight: "33%" }}>




          {/* USER'S SELECTED CARD */}
          <div className='flex flex-col justify-center items-start'>
            {cardToPlay ? (
              <div className="bg-white border-4 border-green-500 rounded-lg shadow-md p-1 m-2 w-36 h-48 flex flex-col hover:scale-110">
                <h2 className="text-md text-black font-bold mb-2 text-center">{cardToPlay[0]}</h2>
                <div className="text-center">
                  <div>`IMAGE`</div>
                  <p className="text-black mb-1 text-sm">
                    <strong>Attack:</strong> {cardToPlay[1]}
                  </p>
                  <p className="text-black mb-1 text-sm">
                    <strong>Defense:</strong> {cardToPlay[2]}
                  </p>
                  <p className="text-black mb-1 text-sm">
                    <strong>Duration:</strong> {cardToPlay[5] ? cardToPlay[5] : 0}
                  </p>
                </div>
                <p className="text-black text-sm text-center">{cardToPlay[3]}</p>
              </div>
            ) : (
              <div className='border-4 border-gray-500 rounded-lg shadow-md p-4 m-2 w-36 h-48 flex flex-col text-[1rem] text-green-500'>
                <div className='pt-15'>MUNITION STATUS:</div>
              </div>
            )}
          </div>






          {/* ENEMY STATUS */}
          <div className='flex flex-col justify-center align-middle items-end'>

            {enemyArmed || (enemyLastAction === 'FIRE' && theirPrevRound[0].card_id) ?

            <div id='card' className='flex h-48 w-36' >
              {/* {console.log("ENEMY CARD =====>>> ??? ", enemyCard)} */}
              {enemyLastAction === 'FIRE' && theirPrevRound[0].card_id ?
              
              <div
              className="cursor-not-allowed bg-white border rounded-lg shadow-md flex flex-col items-center justify-between w-full">
          
                <h2 className="text-md text-black font-bold mb-2 text-center">{theirPrevRound[0].name}</h2>
          
                <div className="text-center">
                  <div>`IMAGE`</div>
                  <p className="text-black mb-1 text-sm">
                    <strong>Damage:</strong> {theirPrevRound[0].damage}
                  </p>
                  <p className="text-black mb-1 text-sm">
            {theirPrevRound[0].duration ?
            <strong>Duration: {theirPrevRound[0].duration  + 1}</strong>
            :
            null}
          </p>
                </div>
                <p className="text-black text-sm text-center">{theirPrevRound[0].description}</p>
              </div>
               :
                <div className=" border-4 border-red-500 rounded-lg shadow-md p-1 m-2 w-36 h-48 flex flex-col justify-between hover:scale-110">
                <img
                  src="https://i.imgur.com/Uvf7DCN.png"
                  className="border-8 border-slate-600 rounded-lg shadow-md w-36 h-48 flex flex-col items-center justify-between hover:scale-110"
                  />
              </div>
              }
              </div>

            : (
              <div className='border-4 border-error rounded-lg shadow-md p-4 m-2 w-36 h-48 flex flex-col text-[1rem] text-error' >
                <div className='pt-15' style={{maxWidth: "25%" }}>ENEMY MUNITION STATUS:</div>
              </div>
            )}

          </div>
        </div>





       {/* 2ND COLUMN: 3RD SECT: USERS CARDS */}
        <div className="flex flex-row justify-center gap-1 p-2 pt-5 w-full h-48" style={{ minHeight: "33%", minWidth: "100%"}}>
          {playerHand.map((card, index) => {
            return (
              <Card
                key={index}
                card={card}
                setCardToPlay={setCardToPlay}
                setCardId={setCardId}
                playerAction={playerAction}
                setActiveLoading={setActiveLoading}
                playerHand={playerHand}
                setPlayerHand={setPlayerHand}
                user={user}
                activeLoading={activeLoading}
              />
            );
          })}
        </div>
      </div>



      {/* 3RD COLUMN */}
      <div className='flex flex-col w-full items-center justify-between pr-5' style={{ maxWidth: "25%"}}>
        {/* 3RD COLUMN: 1ST SECTION */}
        <div className='flex flex-col items-center w-full' style={{ height: "33%"}}>
          <div className='text-error font-bold text-center'>{enemyName || 'No Player'}</div>
          <div className="w-full flex flex-grow flex-col gap-4 justify-items-end">
            <div className={`bg-slate-600 h-5 rounded-full text-center relative justify-items-end text-white text-sm ${healthBarShake ? 'animate-shake transition-all' : ''}`}>
              <div
                className={`bg-error h-5 rounded-full text-center justify-items-end text-white text-sm transition-all ${healthBarShake ? 'animate-shake transition-all' : ''}`}
                style={{ width: `${(enemyHitPoints / 50) * 100}%` }}>
              </div>
              <div className='pl-4 h-5 justify-items-center text-center inset-y-0 absolute'>{`Hull Integrity: ${enemyHitPoints} / 50`}</div>
            </div>
            <div className={`bg-slate-700 h-5 rounded-full text-center justify-items-end justify-end items-end text-white text-sm pt-5 relative ${shieldBarShake ? 'animate-shake transition-all' : ''}`}>
              <div
                className={`bg-blue-400 h-5 rounded-full text-center justify-items-end justify-end items-end text-white text-sm pt-5 absolute inset-y-0 transition-all ${shieldBarShake ? 'animate-shake transition-all' : ''}`}
                  style={{ width: `${(enemyArmor/100) * 100}%` }}>
              </div>
              <div className='pl-4 h-5 justify-items-center text-center inset-y-0 absolute'>{`Armor: ${enemyArmor}`}</div>
            </div>
          </div>
        </div>
        {/* 3RD COLUMN : SECTION 2 SHIP */}
        <div className='flex' style={{height: "33%"}}>
              <img src='https://i.imgur.com/4paq921.png' className='aspect-square object-scale-down scale-x-[.75] scale-y-[.75] max-h-50 outline outline-blue-600 rounded-full animate-outline-pulse'/>
        </div>
        {/* 3RD COLUMN : SECTION 3 */}
        <div className='flex flex-col items-center' style={{height: "33%"}}>
          <div>
               {
             // !turnEnded || playerAction !== '' ?
             ((playerAction === 'FIRE' || playerAction === 'BLOCK' || (playerAction === 'LOAD' && activeLoading)) && !turnEnded) || (turnEnded && enemyAction)?
             <button className='p-4 flex aspect-square text-white font-bold rounded-full text-sm justify-center items-center overflow-hidden text-ellipsis text-center justify-items-end bg-emerald-500  hover:bg-emerald-900 focus:ring-4 focus:ring-emerald-600 '
               onClick={(e)=>{
                 setTurnEnded(true)
                 endTurn()
                 if (playerAction === 'FIRE'){
                     setCardToPlay(null)
                     // discard(cardToPlay[0])
                 }
                 if (playerAction === "LOAD" && cardToPlay[2]){
                   setCardToPlay(null)
                   discard(cardToPlay[0])
                 } else if (playerAction === "LOAD" && cardToPlay[1]){
                   discard(cardToPlay[0])
                 }
               }}>COMMIT TURN</button>
             :
             <button className='cursor-not-allowed p-4 flex bg-gray aspect-square text-white font-bold rounded-full text-sm justify-center items-center overflow-hidden text-ellipsis'
             >COMMIT TURN</button>
               }
           </div>
           <div className='items center flex flex-col pt-10'>
             {enemyWaiting?
               <div className='text-error text-[1rem] text-center animate-pulse' >
                 opponent waiting
               </div>
            :
             null
           }

           <label className="inline-flex items-center cursor-pointer justify-between pb-4">
           <input type="checkbox" value={selfDestruct} className="sr-only peer " onClick={()=>{setSelfDestruct(!selfDestruct)}}/>
             <div className="relative w-11 h-6 pb-4 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 dark:peer-focus:ring-orange-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-orange-600"></div>
             <span className="ms-3 text-sm font-medium text-white dark:text-white">ARM SELF DESTRUCT</span>
           </label>


          <div></div>

          {selfDestruct?
            <button onClick={forfeit} className='p-4 pt-4 flex items-end justify-end bg-orange-500  hover:bg-orange-900 text-white font-bold rounded-md focus:ring-4 focus:ring-orange-600'
            >SELF DESTRUCT<img className='object-contain h-8' src='https://i.imgur.com/mBC4Uh5.png'/>
              </button>
          :
            <button className='cursor-not-allowed p-4 pt-4 flex items-end justify-end bg-gray text-white text-center font-bold rounded-md'
              >SELF DESTRUCT<img className='object-contain h-8' src='https://i.imgur.com/mBC4Uh5.png'/>
            </button>
           }
           </div>
           </div>
      </div>
    </div>
  )
};

export default GameBoard;


