const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cryptoSchema = new Schema({
	name:{
			type: String,
			required: true
		 },
	units:{
			type: Number,
			unique: true,
			required: true
		  }
});

const Crypto = mongoose.model("Crypto", cryptoSchema);

module.exports = Crypto;