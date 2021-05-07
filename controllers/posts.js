const cloudinary = require("../middleware/cloudinary");
const Post = require("../models/Post");
const Comment = require("../models/Comment");

module.exports = {
  getProfile: async (req, res) => {
    try {
      const posts = await Post.find({
        user: req.user.id
      });
      res.render("profile.ejs", {
        posts: posts,
        user: req.user
      });
    } catch (err) {
      console.log(err);
    }
  },
  getFeed: async (req, res) => {
    try {
      console.log(`feed ${req}`)
      const posts = await Post.find().sort({
        createdAt: "desc"
      }).lean();
      res.render("feed.ejs", {
        posts: posts
      });
    } catch (err) {
      console.log(err + 'feed');
    }
  },
  getPost: async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      const comment = await Comment.find({ postId: req.params.id});
      res.render("post.ejs", {
        post: post,
        user: req.user,
        comment : comment
      });
      console.log(`Commenter: ${comment[0].commenterId}`)
      console.log(`the url is ${req.originalUrl}`)
      console.log(`This is current user: ${req.user.userName}`)
    } catch (err) {
      console.log(err);
    }
  },
  createPost: async (req, res) => {
    try {
      // Upload image to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);

      await Post.create({
        title: req.body.title,
        image: result.secure_url,
        cloudinaryId: result.public_id,
        caption: req.body.caption,
        likes: 0,
        user: req.user.id,
      });
      console.log("Post has been added!");
      res.redirect("/profile");
    } catch (err) {
      console.log(err);
    }
  },
  addComments: async (req, res) => {
    try {
      await Comment.create({
        postId: req.params.id,
        userId: req.user.id,
        comment: req.body.newComment,
        commenterId: req.user.userName
      });  
      console.log(`comment added ${req.body.newComment}`);
      console.log(`params is: ${req.params}`)
      res.redirect(`/post/${req.params.id}`);
    } catch (err) {
      console.log(err);
    }
  },

  // Delete the comment where id of post is same as params.id and 
  // where the userId of the comment is same as req.user.id.
  // Current error: Deletes ALL the user comments.
  deleteComment: async (req, res) => {
    try {
      let x
      await Comment.deleteOne({
        x = req.params.id,
        // postId: req.params.postId,
        _id: req.params.id
      })
      console.log(`Req.params is: ${req.params.id}`)
      // document.location.reload()
       res.redirect(`/post/${Post.find({id: x})}`)
    } catch (err) {
      console.log(err)
    }
  },// fix this we need to redirect to the current page 

  likePost: async (req, res) => {
    try {
      await Post.findOneAndUpdate({
        _id: req.params.id
      }, {
        $inc: {
          likes: 1
        },
      });
      console.log("Likes +1");
      res.redirect(`/post/${req.params.id}`);
    } catch (err) {
      console.log(err);
    }
  },
  deletePost: async (req, res) => {
    try {
      // Find post by id
      let post = await Post.findById({
        _id: req.params.id
      });
      // Delete image from cloudinary
      await cloudinary.uploader.destroy(post.cloudinaryId);
      // Delete post from db
      await Post.remove({
        _id: req.params.id
      });
      console.log("Deleted Post");
      res.redirect("/profile");
    } catch (err) {
      res.redirect("/profile");
    }
  },
};