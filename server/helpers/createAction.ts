import database from "../database/index.ts";

export default async function createAction(req: any){
  
  try {

    const cardSubmission = req.body.data.card_id ? req.body.data.card_id : null;
    
    // new code block checks if player already has an action for this round
    const actionExists = await database.actions.findFirst({
      where: {
        AND: [
          {user_id: req.body.data.user_id},
          {round_id: req.body.data.round_id}
        ]
      }
    })

    // moved outside of code blocks for ease of access
    let newAction;

    if (cardSubmission){

      // this vets and verifies that the player currently possesses the card that they are attempting to play
      const findCardCorrelation = await database.user_cards.findFirst({ 
        where: { id: Number(req.body.data.card_id) },
        include: { card: true }
      })


      // we create and store this action for later calculations
      if (actionExists) {
        console.log(`Updating action #${actionExists.id} for user #${req.body.data.user_id}, action contains a card.`)
        newAction = await database.actions.update({
          where: { id: actionExists.id },
          data: {
            round:  { connect: { id: req.body.data.round_id}},
            user:   { connect: { id: req.body.data.user_id}},
            card:   { connect: { id: findCardCorrelation.card.id }},
            action: req.body.data.action,
            expedite: req.body.data.expedite
          }
        })
        return newAction
      } else if (req.body.data.expedite){
        
        console.log(`Received an expedited request from client; card supplied by client was #${req.body.data.card_id} with no translation required.`)
        newAction = await database.actions.create({
          data: {
            round:  { connect: { id: req.body.data.round_id}},
            user:   { connect: { id: req.body.data.user_id}},
            card:   { connect: { id: req.body.data.card_id }},
            action: req.body.data.action,
            expedite: req.body.data.expedite
          }
        })
        return newAction;

      } else {
        console.log(`Received a normal request from client; card supplied by client was #${req.body.data.card_id} => #${findCardCorrelation.card.id}`)
        newAction = await database.actions.create({
          data: {
            round:  { connect: { id: req.body.data.round_id}},
            user:   { connect: { id: req.body.data.user_id}},
            card:   { connect: { id: findCardCorrelation.card.id }},
            action: req.body.data.action,
          }
        })   
        return newAction;
     
      }
      
    } else {

      if (actionExists) {
        console.log(`Updating action #${actionExists.id} for user #${req.body.data.user_id}; action does not contain a card.`)
        newAction = await database.actions.update({
          where: { id: actionExists.id },
          data: {
            card: { disconnect: true},
            action: req.body.data.action,
            expedite: req.body.data.expedite
          }
        })
        return newAction;

      } else {
        console.log(`Received a normal request from client; no card was supplied by the client.`)
        newAction = await database.actions.create({
          data: {
            round:  { connect: { id: req.body.data.round_id}},
            user:   { connect: { id: req.body.data.user_id}},
            action:   req.body.data.action,
          }
        })
        return newAction;
      }

    }
  } catch (error) {
    throw new Error(error);
  }
}