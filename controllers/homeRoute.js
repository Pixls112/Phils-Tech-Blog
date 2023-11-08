const router = require('express').Router();
const { Post, User, Comment } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', async (req, res) => {
  try {
    // Get all post and JOIN with user data
    const pData = await Post.findAll({
      include: [
        {
          model: User,
          attributes: ['name'],
        },
      ],
    });

    // Serialize data so the template can read it
    const post = pData.map((posts) => posts.get({ plain: true }));

    // Pass serialized data and session flag into template
    res.render('homepage', { 
      post, 
      logged_in: req.session.logged_in 
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

//This sets up a get route which will pull a post with the specific ID attach to it and the response will also contain the name associated with the post.
router.get('/post/:id', async (req, res) => {
  try {
    const pData = await Post.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['name'],
        },
      ],
    });

    const post = pData.get({ plain: true });

    res.render('modifyPost', {
      ...post,
      logged_in: req.session.logged_in
    });
  } catch (err) {
    res.status(500).json(err);
  }
});


// This sets up a get route which will pull a post and then a comment with the ID associated with it.
router.get('/post/comments/:id', async (req, res) => {
  try {
    const commentData = await Comment.findAll({
      where: {
        post_id: req.params.id
      },
      include: [{ all: true, nested: true }]
    });

    const comments = commentData.map((comment) => comment.get({ plain: true }));
    // Same as the get route above.
    const postData = await Post.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['name'],
        }
      ],
    });
    const post = postData.get({ plain: true });

    res.render('comment', {
      post,
      comments,
      logged_in: req.session.logged_in
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Use withAuth middleware to prevent access to route
router.get('/profile', withAuth, async (req, res) => {
  try {
    // Find the logged in user based on the session ID
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Post }],
    });

    const user = userData.get({ plain: true });

    res.render('profile', {
      ...user,
      logged_in: true
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/login', (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect('/profile');
    return;
  }

  res.render('login');
});

// Sets up a get route for users to signup, so when the route is accessed it will render the signup page.
router.get('/signUp', async (req, res) => {
  try {
    // Pass serialized data and session flag into template
    res.render('signUp');
  } catch (err) {
    res.status(500).json(err);
  }
});

// In tandem with the one above, This allows the user to create a name and password which the route will give a unique ID to and add to the database.
router.post('/signUp', async (req, res) => {
  try {
    const userData = await User.create(req.body);

    req.session.save(() => {
      req.session.user_name = userData.name;
      req.session.user_id = userData.id;
      req.session.logged_in = true;

      res.status(200).json(userData);
    });
  } catch (err) {
    res.status(400).json(err);
  }
});

router.get('/createPost', async (req, res) => {
  try {
    res.render('addPost', {
      logged_in: req.session.logged_in
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;