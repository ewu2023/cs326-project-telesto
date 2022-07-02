import 'dotenv/config';
import users from "./users.js";
import passport from "passport";
import passportLocal from 'passport-local';
const {Strategy} = passportLocal;

// Create authentication strategy for passport to use
const strategy = new Strategy(async (username, password, done) => {
    const userObj = await users.findUser(username);
    if (!userObj) {
        return done(null, false, {"message": "Incorrect username"});
    }

    const passwordMatches = await users.validatePassword(username, password);
    if (!passwordMatches) {
        return done(null, false, {"message": "Incorrect password"});
    }
    return done(null, userObj);
});

passport.use(strategy);

passport.serializeUser(async (user, done) => {
    const uid = user["_id"];
    done(null, uid);
});

passport.deserializeUser(async (uid, done) => {
    const userObj = await users.findUserById(uid);
    done(null, userObj);
});

export default {
    configure: (app) => {
        app.use(passport.initialize());
        app.use(passport.session());
    },

    authenticate: (domain, where) => {
        return passport.authenticate(domain, where);
    }
};