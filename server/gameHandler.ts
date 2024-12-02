import express, { Request, Response } from 'express';
import database from './db/index.ts';
import createAction from './routes/games/helpers/createAction.ts';
import calculateGameState from './routes/games/helpers/calculateGameState.ts';
import calculatePlayerState from './routes/games/helpers/calculatePlayerState.ts';
import generateResponse from './routes/games/helpers/generateResponse.ts';

export default async function gameHandler(req: any) {


  /*

  { 
    body: {
      "data": {
        "round_id": 1,
        "user_id": 1,
        "action": "FIRE" || "LOAD" || "BLOCK",
        "card_id": 1,
      }
    }
  }
  */

  try {

    // get the current Round and peripherals
    const currentRound = await database.rounds.findFirst({
      where: { id: Number(req.body.data.round_id)},
      include: {
        Round_Effects: true,
        Round_Player_Info: true,
        Actions: true,
        Actions_Loaded: true,
      }
    })

    // if this is the first action submitted for a round
    if (currentRound.Actions.length === 0){

      await createAction(req);
      return {
        "Successful": true,
        "Message": `Action #1 created for User #${req.body.data.user_id} in Game #${currentRound.game_id} - Round #${currentRound.id}.`
      }

    // else if this is the second (and last) action submitted for a round
    } else if (currentRound.Actions.length > 0){

      // create the action for this user
      await createAction(req);

      // then attempt to perform calculations, and store the results
      const updateState = await calculateGameState(req, currentRound.game_id);

      console.log(updateState);

      // acquire the current player information
      let updatePlayers = currentRound.Round_Player_Info.slice();

      console.log(`Current player information to be used in calculations is: `, updatePlayers)

      // end the current round
      await database.rounds.update({ 
        where: { id: req.body.data.round_id},
        data: { end_date: new Date() }
      })

      // create a new round for the game only after all calculations have succeeded
      const newRound = await database.rounds.create({
        data: { game_id: currentRound.game_id}
      })

      // returns an array of new players after updates
      updatePlayers = calculatePlayerState(updatePlayers, updateState, newRound.id);

      for (let i = 0; i < updatePlayers.length; i++){
        const newPlayerInfo = await database.round_Player_Info.create({
          data: updatePlayers[i]
        })
      }

      const formattedResponse = await generateResponse(newRound.id, currentRound.id);

      return (formattedResponse);

    }


  } catch (error) {
    console.error(`Fatal error encountered within Rounds router (rounds.ts), error message follows: `, error);
    return {
      "Success": false,
      "Message": `Error on client in processing turn submission.`
    }
  }

};