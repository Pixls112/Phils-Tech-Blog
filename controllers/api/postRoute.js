const router = require('express').Router();
const { Post } = require('../../models');
const withAuth = require('../../utils/auth');

// Sets up a post route to create a new post in the database and sends the response back.
router.post('/', withAuth, async (req, res) => {
  try {
    const newPost = await Post.create({
      ...req.body,
      user_id: req.session.user_id,
    });

    res.status(200).json(newPost);
  } catch (err) {
    res.status(400).json(err);
  }
});

// Sets up a put route that updates a post with the specific ID from the database
router.put('/:id', async (req, res) => {
  try {
    const update = await Post.update(
    {
      title: req.body.title,
      content: req.body.content,
    },
    {
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json(update);
  } catch (err) {
      res.status(500).json(err);
    };
});

//  This sets up a delete route that deletes a post with a specific ID from the database.
router.delete('/:id', withAuth, async (req, res) => {
  try {
    const postData = await Post.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      },
    });

    if (!postData) {
      res.status(404).json({ message: 'No post found with this id!' });
      return;
    }

    res.status(200).json(postData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;