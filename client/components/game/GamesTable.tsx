import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios'

export default function GameTable({

  playHeavyClickSFX,
  userInvites,
  userAcceptedInvs,
  acceptedOutgoingInvs,

  setUserAcceptedInvs,
  setUserInvites,
  socket,

  setSession,
  setRoundNum,
  setDeckSelected,
  setHandProvided,
  setRoundActual,

  setEnemyName,
  setEnemyId,
  setActiveUserGame,
  setRoundInfo,
  deckSelected,
  decl,

  user

}){

  const joinPrivateGame = async (openGame) =>{

    console.log("join this game")

    try {

      const game = await axios.post(`/games/private/join/${openGame.game_id}`, { "user_id": user.id });

      setSession(openGame.game_id);               // we derive the game ID from the invite
      setRoundNum(game.data["Current Round"]);    // all of this data is made available from Axios request
      setDeckSelected(game.data["Current Deck"]);
      setHandProvided(game.data["Current Hand"]);
      setRoundActual(game.data["Current Round Actual"]);

      // we changed the game_id emission here because it was referencing something that didn't exist
      socket.emit("join_session", openGame.game_id, user, game.data["Current Round"]);

      // I don't know if putting an event listener here is an issue
      // this might need to be somewhere else?
      socket.on('session_players', (data: any) => {

        // when we receive emission, see if there is an enemy
        const enemy = data.filter((player) => {
          return (player.user_id !== user.id)
        })

        if (deckSelected){
        }

        // console.log("ON CLICK PLAY ENEMY", enemy)
        // if the filtered array contains an enemy
        if (enemy.length > 0) {
          setEnemyName(enemy[0].name);  // set that enemy's name
          setEnemyId(enemy[0].user_id); // set that enemy's user ID
          setRoundInfo(data)            // set the current round information
          setActiveUserGame(true)          // then trigger Game Board conditional render
        }
      })

    } catch (error) {
      console.error(`Error on connecting to a game session.`)
    }










  }


  const declineInv = async(gameId: number) => {
    try{
      await axios.delete(`/games/private/invites/${gameId}`);
      const retrievedInvites = await axios.get(`/games/private/invites`);
      decl();
      setUserInvites(retrievedInvites.data.Incoming.Pending);
      setUserAcceptedInvs(retrievedInvites.data.Incoming.Accepted);
    } catch(error) {
      console.error('Failed to decline Game Invite');
    }
  }

///////////////// RENDER RETURN //////////////////////////////
  return(
<div className='bg-red-300 w-full'>



<div className="relative overflow-x-auto">






    <table className="text-sm text-left rtl:text-right text-slate-500 dark:text-slate-400 px-2 justify-between">



        <thead className="text-xs text-white uppercase bg-slate-50 dark:bg-slate-700 dark:text-gray-400">
            <tr className='justify-between p-2'>
                <th scope="col" className="px-6 py-3">
                    player name
                </th>
                <th scope="col" className="px-6 py-3">
                    status
                </th>
                <th>select game</th>
                <th className='text-end pr-4'>decline</th>

            </tr>
        </thead>



        <tbody>


        {userInvites.map((invite)=>{

          return(
            <tr className="bg-gray border-b dark:bg-slate-800 dark:border-slate-700">
                <th scope="row" className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap dark:text-white">
                    {invite.invitee.name}
                </th>
                <td className="px-6 py-4">
                    {invite.accepted? <p>accepted</p>: <p>pending</p>}
                </td>
                <td className="px-6 py-4">
                <button onClick={()=>{
                      playHeavyClickSFX()
                      joinPrivateGame(invite)
                    }}
                    className='w-8 h-8 aspect-square bg-success hover:bg-green-900 text-text dark:text-darkText border-slate-600 border-2 font-bold text-xs sm:text-sm md:text-base lg:text-lg rounded-full flex justify-center items-center overflow-hidden text-ellipsis focus:ring-4 focus:ring-success'>✓</button>
                </td>
                <td className="px-6 py-4">
                <button onClick={()=>{
                      playHeavyClickSFX()
                      declineInv(invite.game_id)
                    }}
                    className='w-8 h-8 aspect-square bg-error hover:bg-red-900 text-text dark:text-darkText border-slate-600 border-2 font-bold text-xs sm:text-sm md:text-base lg:text-lg rounded-full flex justify-center items-center overflow-hidden text-ellipsis focus:ring-4 focus:ring-error'>X</button>
                </td>
            </tr>

          )

        })}





        {userAcceptedInvs.map((invite)=>{
          console.log("ACCEPTED INVITES", invite)
          return(
            <tr className="bg-gray border-b dark:bg-slate-800 dark:border-slate-700">
                <th scope="row" className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap dark:text-white">
                    {invite.invitee.name}
                </th>
                <td className="px-6 py-4">
                    {invite.accepted? <p>accepted</p>: <p>pending</p>}
                </td>
                <td className="px-6 py-4">
                <button onClick={()=>{
                      playHeavyClickSFX()
                      joinPrivateGame(invite)

                    }}
                    className='w-8 h-8 aspect-square bg-success hover:bg-green-900 text-text dark:text-darkText border-slate-600 border-2 font-bold text-xs sm:text-sm md:text-base lg:text-lg rounded-full flex justify-center items-center overflow-hidden text-ellipsis focus:ring-4 focus:ring-success'>✓</button>
                </td>
                <td className="px-6 py-4">
              </td>
            </tr>
          )
        })}


         {acceptedOutgoingInvs.map((invite)=>{
          console.log("ACCEPTED INVITES", invite)
          return(
            <tr className="bg-gray border-b dark:bg-slate-800 dark:border-slate-700">
                <th scope="row" className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap dark:text-white">
                    {invite.invitee.name}
                </th>
                <td className="px-6 py-4">
                    {invite.accepted? <p>accepted</p>: <p>pending</p>}
                </td>
                <td className="px-6 py-4">
                <button onClick={()=>{
                      playHeavyClickSFX()
                      joinPrivateGame(invite)

                    }}
                    className='w-8 h-8 aspect-square bg-success hover:bg-green-900 text-text dark:text-darkText border-slate-600 border-2 font-bold text-xs sm:text-sm md:text-base lg:text-lg rounded-full flex justify-center items-center overflow-hidden text-ellipsis focus:ring-4 focus:ring-success'>✓</button>
                </td>
                <td className="px-6 py-4">
              </td>
            </tr>
          )
        })}





        </tbody>



    </table>







</div>


</div>

    


  )


}