const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
//id of post its on
postId:{
  type:String,
  required:true,
},


//id of user who made it
userId:{
  type:String,
  required:true,
},

commenterId:{
  type:String,
  required:true,
},

//content of comment 
comment:{
  type:String,
  required:true,
}
//maybe add the url of the post 
}); 


module.exports = mongoose.model("Comment", CommentSchema);

