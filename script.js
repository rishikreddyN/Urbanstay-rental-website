if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}


const express=require("express");
const app=express();
const mongoose=require("mongoose");

const path=require("path");
const methodoverride=require("method-override");
const ejsMate=require("ejs-Mate")

const ExpressError = require("./util/expressError.js");
const listingrouter =require("./routes/listing.js");
const reviewrouter =require("./routes/review.js");
const userrouter=require("./routes/user.js");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const session = require("express-session");
const MongoStore=require("connect-mongo").default;
const flash = require("connect-flash");

const dburl=process.env.ATLASDBURL



const User=require("./models/user.js"); 
async function  main(){
    await mongoose.connect(dburl);
}
main()
.then(()=>{
    console.log("connected to the data base");
})
.catch((err)=>{
    console.log(err);
})


app.set("view engine",'ejs');
app.set("views",path.join(__dirname,"views"));
app.use(express.json()); 
app.use(express.urlencoded({extended:true}));
app.use(methodoverride("_method"));
app.use(express.static(path.join(__dirname,"public")));
app.engine("ejs",ejsMate);

const store = MongoStore.create({
    mongoUrl: dburl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});

const sessionOptions = {
    store,
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};


//root

 app.get("/", (req, res) => {
     res.send("Hi, I am root");
     });
    
    
    app.use(session(sessionOptions))
    app.use(flash());
    
    app.use(passport.initialize());
    app.use(passport.session());
    
    
    
    passport.use(new LocalStrategy(User.authenticate()));
    
    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());
    
    app.use((req,res,next)=>{
        res.locals.success=req.flash("success");
        res.locals.error=req.flash("error");
        res.locals.currUser=req.user;
        next();
    });
    
    
    app.use("/listings/:id/reviews",reviewrouter);
    
    app.use("/listings",listingrouter);
    app.use("/",userrouter);
    
    app.use((req,res,next)=>{
        next(new ExpressError(404,"Page Not Found"));
    }); 
    
    // custom error handler 
    app.use((err,req,res,next)=>{
        let {statusCode=500, message="Something went wrong"} = err;
            console.log(err); 
        res.status(statusCode).send(message);
    });
    
    app.listen(8080,()=>{
        console.log("Server is listening");
    })