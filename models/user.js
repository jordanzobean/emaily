const mongoose = require("mongoose");

const { Schema } = mongoose;

const userSchema = new Schema({
  googleID: String
});

// here we are loading our users model into mongoose. The second arg loads a schema into mongoose
mongoose.model('users', userSchema);