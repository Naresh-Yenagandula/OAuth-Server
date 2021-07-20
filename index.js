const express = require("express")
const dotenv = require("dotenv")
const passport = require("passport")
const cors = require("cors")
const session= require("express-session")
const GithubStrategy = require("passport-github").Strategy;
const TwitterStrategy = require("passport-twitter").Strategy;
let user={}
dotenv.config()


const app = express()
app.use(express.json())
app.use(session({
    secret:"secreasdshasdsd",
    resave:true,
    saveUninitialized:true
}))
app.use(cors({origin:"http://localhost:3000",credentials:true}))

passport.serializeUser((user,cb)=>{
    cb(null,user)
})
passport.deserializeUser((user,cb)=>{
    cb(null,user)
})

app.use(passport.initialize())
app.use(passport.session())

//Github Strategy
passport.use(new GithubStrategy({
    clientID:process.env.GITHUB_CLIENT_ID,
    clientSecret:process.env.GITHUB_CLIENT_SECRET,
    callbackURL:"/auth/github/callback"
},
(accessToken,refreshToken,profile,cb)=>{
    user={...profile}
    console.log(profile);
    return cb(null,profile)
}))


//Twitter Strategy
passport.use(new TwitterStrategy({
    consumerKey:process.env.TWITTER_CLIENT_ID,
    consumerSecret:process.env.TWITTER_CLIENT_SECRET,
    callbackURL:"/auth/twitter/callback"
},
(accessToken,refreshToken,profile,cb)=>{
    user={...profile}
    return cb(null,profile)
}))


//Github APIs
app.get("/auth/github",passport.authenticate("github"))
app.get("/auth/github/callback",passport.authenticate('github'),(req,res)=>{
    res.redirect("/")
})

//Twitter APIs
app.get("/auth/twitter",passport.authenticate("twitter"))
app.get("/auth/twitter/callback",passport.authenticate('twitter'),(req,res)=>{
    res.redirect("http://localhost:3000/dashboard")
})


//Data API
app.get("/user",(req,res)=>{
    res.send(user)
})

app.get("/",(req,res)=>{
    res.send("Welcome")
})

app.listen(5000,()=>{console.log("server is up")})