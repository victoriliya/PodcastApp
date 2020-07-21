var express 			= require("express");
var router 				= express.Router(),
passport 				= require("passport"),
localStrategy 			= require("passport-local"),
passportLocalMongoose 	= require("passport-local-mongoose"),
Podcast 				= require("../models/podcast"),
User 					= require("../models/user");


//RESTFULL ROUTES

router.get("/admin/:id", isLoggedIn, function(req, res){
	Podcast.find({}, function(err, podcastData){
		if (err) {
			console.log(err);
		}else{	
			res.render('admin', {podcastData: podcastData});
			/*res.redirect("/podcast/home/" + user.id);*/	
		}
	});

})

router.get("/edit/:id", isLoggedIn, function(req, res){
	Podcast.findById(req.params.id, function(err, podcastData){
		if (err) {
			console.log(err);
		}else{
			res.render("edit", {podcastData: podcastData});
		}
	})
	
})

router.get("/new/:id", isLoggedIn, function(req, res){
	res.render("new");
})

router.post("/edit/:id", function(req, res){
	console.log(req.body);
	Podcast.findByIdAndUpdate(req.params.id, req.body, function(err, podcastData){
		if (err) {
			console.log(err);
		}else{
			req.flash("success", "Update Successfull!");
			Podcast.find({}, function(err, podcastData){
				if (err) {
					console.log(err);
				}else{
					
					res.redirect("/podcast/admin/" + req.params.id);
					/*res.render('admin', {podcastData: podcastData});	*/			
				}
			})
			/*res.render('admin', {podcastData: podcastData});*/		
		}
	})

})


router.post("/new/:id", function(req, res){

	Podcast.create(req.body, function(err, newPodcast){
		if (err) {
			console.log(err);
		}else{
			req.flash("success", "New Podcast Created!");
			Podcast.find({}, function(err, podcastData){
				if (err) {
					console.log(err);
				}else{
					console.log(podcastData);		
					res.redirect("/podcast/admin/" + req.params.id);
					/*res.render('admin', {podcastData: podcastData});*/		
				}
			})
		
		}
	})

})

router.get("/delete/:id", function(req, res){

	Podcast.findByIdAndRemove(req.params.id, function(err, podcast){
		if (err) {
			console.log(err);
		}else{
			req.flash("success", "One Podcast Deleted!");
			Podcast.find({}, function(err, podcastData){
				if (err) {
					console.log(err);
				}else{
					res.redirect("/podcast/admin/" + req.params.id);
					/*res.render('admin', {podcastData: podcastData});*/				
				}
			})
		}
	})

})

function isLoggedIn(req, res, next){
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect("/podcast");
}

module.exports = router;