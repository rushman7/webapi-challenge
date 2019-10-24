const express = require('express');
const actionDB = require('../data/helpers/actionModel');

const router = express.Router();

// router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
//   postDB.insert(req.body)
//     .then(post => res.status(201).json(post))
//     .catch(() => res.status(500).json({ error: "There was an error while saving the post to the database" }))
// });

// router.get('/:id/posts', validateUserId, (req, res) => {
//   userDB.getUserPosts(req.user.id)
//     .then(posts => {
//       if (posts.length > 0) res.status(200).json(posts)
//       else res.status(404).json({ error: "The posts with the specified user ID does not exist." })
//     })
//     .catch(() => res.status(500).json({ error: "The posts information could not be retrieved." }))
// });

// custom middleware

router.get('/', (req, res) => {
  const sortField = req.query.sortBy || 'id';

  actionDB.get()
    .then(actions => {
      const response = actions.sort((a,b) => a[sortField] < b[sortField] ? -1 : 1)
      res.status(200).json(response)
    })
    .catch(() => res.status(500).json({ error: "The actions information could not be retrieved." }))
});

router.get('/:id', validateActionId, (req, res) => {
  res.status(200).json(req.action)
});


function validateActionId(req, res, next) {
  const id = req.params.id;

  actionDB.get(id)
    .then(action => {
      if (action) {
        req.action = action;
        next();
      } else res.status(404).json({ message: "invalid action id" })
    })
    .catch(() => res.status(500).json({ error: "The actions information could not be retrieved." }))
};

function validateProject(req, res, next) {
  const { name, description } = req.body;

  if (!req.body) res.status(400).json({ message: "missing project data" })
  else if (!name || !description) res.status(400).json({ message: "missing required field: name, description, or completed" })
  else next();
};

function validateAction(req, res, next) {
  const { text } = req.body;

  if (!req.body) res.status(400).json({ message: "missing action data" })
  else if (!text) res.status(404).json({ message: "missing required text field" })
  else next();
};

module.exports = router;