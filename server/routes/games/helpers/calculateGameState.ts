import database from "../../../db/index.ts";
import calculateEffects from "./calculateEffects.ts";
import commitAttack from "./commitAttack.ts";
import commitLoad from "./commitLoad.ts";

export default async function calculateGameState(req: any, game: number) {

  try {

    const action_results: any = {};

    // get all actions for the round specified in params
    const allRoundActions = await database.actions.findMany({
      where: { round_id: req.body.data.round_id}
    })

    console.log(`calculateGameState.ts : 13 | Round #${req.body.data.round_id} has #${allRoundActions.length} actions on record.`);

    // initialize results for each user in game
    allRoundActions.forEach((action) => {
      action_results[action.user_id] = {};
      action_results[action.user_id].armor = 0;
      action_results[action.user_id].damage = 0;
      action_results[action.user_id].isBlocking = false;
      console.log(`calculateGameState.ts : 20 | Calculations storage has been initialized for User #${action.user_id}.`);
    })

    console.log(`calculateGameState.ts : 20 | Calculations storage initialization is complete, initial record follows: `, action_results);

    // for every user in action results
    for (const key in action_results) {

      console.log(`calculateGameState.ts : 31 | Searching for active effects belonging to User #${key} on Game #${game}.`);
      // calculate effects
      const effects = await calculateEffects(game, Number(key));
      
      if (effects) {
        console.log(`calculateGameState.ts : 37 | Effects found for User #${key} on Game #${game}.`);
        action_results[key]['damage'] += effects.damage;
        action_results[key]['armor'] += effects.armor;
        console.log(`calculateGameState.ts : 41 | Calculations updated for User #${key} on Game #${game}: `, action_results[key]);
      }
    }

    // for every action on the current round
    for (let i = 0; i < allRoundActions.length; i++){

      const action = allRoundActions[i].action;
      const user = allRoundActions[i].user_id;
      const card = allRoundActions[i].card_id;

      if (action === 'FIRE'){

        const attackDamage = await commitAttack(req, game, allRoundActions[i]); // Attacks always return a damage number value
        console.log(`calculateGameState.ts : 52 | Processing actions for User #${user}, current action is ${action} with calculated damage ${attackDamage}.`);
        action_results[user]['damage'] += attackDamage;
        console.log(`calculateGameState.ts : 55 | Calculations updated for User #${user} on Game #${game}: `, action_results[user]);

      } else if (action === 'LOAD'){

        if (!card) {
          throw new Error (`Invalid LOAD operation; no card specified.`)
        } else {
          console.log(`calculateGameState.ts : 63 | Processing actions for User #${user}, current action is ${action} with Card #${card}.`);
          await commitLoad(req, game, allRoundActions[i]);  // Load never returns anything, so we don't store its result
        }

      } else if (action === 'BLOCK'){
        console.log(`calculateGameState.ts : 68 | Processing actions for User #${user}, current action is ${action}.`);
        action_results[user]['isBlocking'] = true;
        console.log(`calculateGameState.ts : 70 | Calculations updated for User #${user} on Game #${game}: `, action_results[user]);
      } else {
        throw new Error(`Invalid argument for action type; check syntax on request.`)
      }

    }

    return action_results;

  } catch (error) {
    console.error(`Fatal error in calculateGameState: `, error);
    return error;
  }

}