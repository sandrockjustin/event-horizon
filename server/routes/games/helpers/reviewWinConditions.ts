import database from "../../../db/index.ts";

export default async function reviewWinConditions(players: any) {

  try {

    let victor = null;

    let userOneHealth = players[0].health;
    let userTwoHealth = players[1].health;

    // if player two reduced player one's health to 0
    if (userOneHealth <= 0 && userTwoHealth > 0) {

      victor = players[1].user_id;

      const findUserOne = await database.user.findFirst({where: { id: players[0].user_id}});
      const findUserTwo = await database.user.findFirst({where: { id: players[1].user_id}});

      await database.user.update({
        where: { id: players[0].user_id},
        data: { score: findUserOne.score + 50}
      })

      await database.user.update({
        where: { id: players[1].user_id},
        data: { score: findUserTwo.score + 100}
      })

    // if player one reduced player two's health to 0
    } else if (userTwoHealth <= 0 && userOneHealth > 0) {

      victor = players[0].user_id;

      const findUserOne = await database.user.findFirst({where: { id: players[0].user_id}});
      const findUserTwo = await database.user.findFirst({where: { id: players[1].user_id}});

      await database.user.update({
        where: { id: players[0].user_id},
        data: { score: findUserOne.score + 100}
      })

      await database.user.update({
        where: { id: players[1].user_id},
        data: { score: findUserTwo.score + 50}
      })

    // if both player's health is below 0
    } else if (userTwoHealth <= 0 && userOneHealth <= 0) {

      victor = (userTwoHealth > userOneHealth) ? players[1].user_id : players[0].user_id;

      const findUserOne = await database.user.findFirst({where: { id: players[0].user_id}});
      const findUserTwo = await database.user.findFirst({where: { id: players[1].user_id}});


      if (victor === players[0].user_id) {
        await database.user.update({
          where: { id: players[0].user_id},
          data: { score: findUserOne.score + 100}
        })
  
        await database.user.update({
          where: { id: players[1].user_id},
          data: { score: findUserTwo.score + 50}
        })
      } else {
        await database.user.update({
          where: { id: players[0].user_id},
          data: { score: findUserOne.score + 50}
        })
  
        await database.user.update({
          where: { id: players[1].user_id},
          data: { score: findUserTwo.score + 100}
        })
      }
    }

    return victor;

  } catch (error) {
    throw new Error(error);
  }

}