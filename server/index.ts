import express, { Request, Response } from 'express';
import passport from 'passport';
import session  from 'express-session';
import authRouter from './auth/auth.ts';
import path from 'path';
import dotenv from "dotenv";
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import database from './db/index.ts';

import http from 'http'
import cors from 'cors'
import { Server } from 'socket.io'
import { it } from 'node:test';
import profile from './routes/user/profile.ts';
import friends from './routes/user/friends.ts';
import games from './routes/games/games.ts';
import gameHandler from './gameHandler.ts';

// const {connectedUsers, initializeChoices, userConnected, makeMove, moves, choices} = require('./../utils/players')
// const { sessions, makeSession, joinSession, exitSession } = require('./../utils/sessions')


//configure dotenv
dotenv.config();

//start express instance
const app = express();

const PORT: String = process.env.PORT;
const CLIENT_URL = process.env.CLIENT_URL;

////////// MIDDLEWARE /////////////////
app.use(express.json());
app.use(express.static(path.resolve(__dirname, '../client/dist/')));
app.on('error', (err: any) => console.error('Error', err));
app.use(cors())


////////// PASSPORT //////////////////

app.use(session(
  {
    secret: process.env.SERVER_SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  }
));
app.use(passport.initialize());
app.use(passport.session());
app.use('/', authRouter);
app.use('/profile', profile);
app.use('/friends', friends);
app.use('/games', games)

// Middleware to check if user is authenticated
const isAuthenticated = (req: any, res: any, next: any) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: 'Not authenticated' });
};


app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/dist/index.html'));

});
// app.get('*', (req, res) => {
//   res.sendFile(path.resolve(__dirname, '../client/dist/index.html'))
// })
app.get('/title-menu', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/dist/index.html'));
})
app.get('/instructions', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/dist/index.html'));
})
app.get('/user-profile', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/dist/index.html'));
})
app.get('/friends', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/dist/index.html'));
})

app.get('/api/auth-check', (req, res) => {
  res.json({ isAuthenticated: req.isAuthenticated(), user: req.user });
});
app.get('/game-board', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/dist/index.html'));
})
app.get('/leaderboard', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/dist/index.html'));
})
app.get('/cards', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/dist/index.html'));
})

app.post('/api/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: 'Error logging out' });
    }
    req.session.destroy((error) => {
      if (error) {
        return res.status(500).json({ message: 'Error destroying session' });
      }
      res.status(200).json({ message: 'Logged out!' });
    });
  });
});


////////// ROUTERS //////////////////




//////// WEBSOCKET ///////////////////////////

//makes an http server with the express server
const server = http.createServer(app)

//creates an io server using the http server made with the express server
//I don't know why
const io = new Server(server, {
  //some kind of cors options object, idk
  cors: {
    origin: `${CLIENT_URL}:${PORT}`,
    methods: ["GET", "POST"],
    credentials: true,
  },
})
//............./////////////...........................
//trying some crap out

//............./////////////...........................
server.listen(PORT, () => {
    database.$connect()
        .then((connectionEstablished) => {
            console.log(`Prisma has connected to the database...`);
            console.log("Server listening on Port",CLIENT_URL + ':' + PORT);
        })
        .catch((error) => {
            console.error(`Failure on database connection...`)
        })
});


  let messages : any = [];
  let users: any[] = []
  let sessionNum = 0;
  let players = 0;

  let roundNum = 0
  let gameMoves = []
  let oneUserEndedTurn = true

  //when the server establishes a connection, it shall do the following:


io.on('connection', (socket)=>{



  // console.log(`user connected: ${socket.id}`)
  // console.log("\n \n**********SOCKET:************ \n \n", socket)
  let sockId = socket.id

  users.push(sockId)
  // console.log("USERS:", users)

  players = users.length;
  // console.log("CURRENT PLAYERS CONNECTED:", players)



  //listening for a join room event
  socket.on('join_session', (data, user)=>{
    
    console.log("*** SESSION DATA", data, user)
    console.log("*** SOCKET ID:", sockId)

      socket.join(data)
      socket.to(data.session).emit("receive_opponent", user)



    //connects the socket object to the incoming room data
  })


/////////////////////////////////////////////
  //PLAYER ENDS TURN

  socket.on('end_turn', async (data)=>{


    try{
      const response = await gameHandler(data)

      io.in(data.session).emit('received_rounds_data', response)


    }
    catch(err){
      console.error(err)
    }

  })
////////////////////////////////////////
// PLAYER SELF-DESTRUCTS
  socket.on('game_over', async (data)=>{

    try{

      io.in(data.session).emit('game_over', data)

    }
    catch(err){
      console.error(err)
    }

  })
//////////////////////////////////////////
  //when a user disconnects
  socket.on('disconnect', () => {
    // console.log('user disconnected');

    users = users.filter(user=>user!==sockId)
    // console.log("USERS:", users)

    players = users.length;
    // console.log("CURRENT PLAYERS CONNECTED:", players)

  });

})

///////////////////////////////////////////
