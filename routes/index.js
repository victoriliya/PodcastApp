var express 			= require("express");
var router 				= express.Router(),
passport 				= require("passport"),
localStrategy 			= require("passport-local"),
passportLocalMongoose 	= require("passport-local-mongoose"),
Podcast 				= require("../models/podcast"),
User 					= require("../models/user");

//RESTFULL ROUTES

router.get("/", function(req, res){
	res.render("index");
});

router.get("/home/:id", isLoggedIn, function(req, res){
	Podcast.find({}, function(err, podcastData){
		if (err) {
			console.log(err);
		}else{	
			res.render('podcast', {podcastData: podcastData});
			/*res.redirect("/podcast/home/" + user.id);*/	
		}
	});
});

router.post("/register" , function(req, res){
	console.log(req.body);

	var newUser = new User({username: req.body.username});

	User.register( newUser, req.body.password, function(err, user){
		if (err) {
			console.log(err);
			req.flash("error", "User Already Registered");
			res.redirect("/podcast/register/");
		}else{
			passport.authenticate("local")(req, res, function(){
				req.flash("success", "Welcome to CoolPodcast");
				res.redirect("/podcast/home/" + user.id);
			});
			
		}
		
	})

});

router.get("/register", function(req, res){
	res.render("register");
});


router.post("/login",
  passport.authenticate("local", {
		failureRedirect: "/podcast/login"
	}), function(req, res){
  	   User.findById(req.user.id, function(err, user){	
		if(err){
			console.log(err);
		}else{
			if (user.username == "admin@mail.com") {
				/*res.render('admin', {podcastData: podcastData});*/	
				res.redirect("/podcast/admin/" + user.id);
			}else{
				/*res.render('podcast', {podcastData: podcastData});*/
				res.redirect("/podcast/home/" + user.id);
			}
			
		}

	});

});


router.get("/login", function(req, res){
	req.logout();
	res.render("index");
});


router.get("/logout", function(req, res){
	req.logout();
	req.flash("success", "Your Logged Out!");
	res.redirect("/");
});


router.get("/listen/:id", function(req, res){
	Podcast.findById(req.params.id, function(err, podcastData){
		if (err) {
			console.log(err);
		}else{
			console.log(podcastData)
			res.render('home', {podcastData: podcastData});	
		}
	})
})




function isLoggedIn(req, res, next){
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect("/podcast/login");
}




module.exports = router;