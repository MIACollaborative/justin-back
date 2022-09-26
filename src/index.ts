import express, { Express, Request, Response } from 'express';
import passport from "passport";
var Strategy = require('passport-http-bearer').Strategy;
//import {Strategy} from "passport-http-bearer";
import dotenv from 'dotenv';
var db = require('./db');

dotenv.config(); 

// Configure the Bearer strategy for use by Passport.
//
// The Bearer strategy requires a `verify` function which receives the
// credentials (`token`) contained in the request.  The function must invoke
// `cb` with a user object, which will be set at `req.user` in route handlers
// after authentication.
passport.use(new Strategy(
  function(token, cb) {
    db.users.findByToken(token, function(err, user) {
      if (err) { return cb(err); }
      if (!user) { return cb(null, false); }
      return cb(null, user);
    });
  }));



const app: Express = express();
const port = process.env.PORT;


// version 2: bearer token
app.get('/',
  passport.authenticate('bearer', { session: false }),
  function(req, res) {
    //console.log(`req: ${JSON.stringify(req, null, 2)}`);
    res.json({ username: req["user"]["username"], email: req["user"]["emails"][0].value });
});

// version 1: no authentication
/*
app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});
*/

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});