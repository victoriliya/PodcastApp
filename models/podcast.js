var mongoose = require("mongoose");

var podcastSchema = mongoose.Schema({
	title: String,
	tag: String,
	description: String,
	image: String,
	audio: String
})

module.exports = mongoose.model("Podcast", podcastSchema);