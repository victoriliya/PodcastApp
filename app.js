require('dotenv').config()
var express 				= require("express"),
	app 					= express(),
	mongoose 				= require("mongoose"),
	bodyParser 				= require("body-parser"),
	passport				= require("passport"),
	localStrategy			= require("passport-local"),
	User 					= require("./models/user"),
	indexRoutes 			= require("./routes/index"),
	adminRoutes				= require("./routes/admin"),
	flash 					= require("connect-flash"),
	dotenv 					= require("dotenv");

mongoose.connect(process.env.ClOUD_MONGODB, {useNewUrlParser: true, useUnifiedTopology: true}, ()=>{
	console.log("db Connected");
});

dotenv.config();

app.use(flash());
/*mongoose.set('useCreateIndex', true);*/

app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));


app.use(express.json());


app.use(require("express-session")({
	secret: "coolest guy ever liveth",
	resave: false,
	saveUninitialized: false
}));


app.use(bodyParser.urlencoded({extended: true}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
})


// ===============
// Routes
// ===============

app.get("/", function(req, res){
	res.render("index");
});

app.use("/podcast/", indexRoutes);
app.use("/podcast/", adminRoutes);


app.listen(process.env.PORT || 3000, function(){
	console.log("poli server running..");
})



