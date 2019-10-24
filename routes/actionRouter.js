const express = require('express');
const actionDB = require('../data/helpers/actionModel');
const projectDB = require('../data/helpers/projectModel');

const router = express.Router();

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

router.post('/', validateProjectId, validateAction, (req, res) => {
  actionDB.insert(req.body)
    .then(action => res.status(201).json(action))
    .catch(() => res.status(500).json({ error: "There was an error while saving the action to the database" }))
});

router.put('/:id', validateActionId, validateAction, (req, res) => {
  actionDB.update(req.action.id, req.body)
    .then(action => {
      if (action) res.status(200).json({ error: `The action with the ID ${req.action.id} has been updated.` })
      else res.status(404).json({ error: "The action with the specified ID does not exist." })
    })
    .catch(() => res.status(500).json({ error: "The action information could not be modified." }))
});

router.delete('/:id', validateActionId, (req, res) => {
  actionDB.remove(req.action.id)
    .then(action => {
      if (action) res.status(202).json({ error: `The action with the ID ${req.action.id} has been removed.` })
      else res.status(404).json({ error: "The action with the specified ID does not exist." })
    })
    .catch(() => res.status(500).json({ error: "The action could not be removed" }))
});


// middleware

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

function validateProjectId(req, res, next) {
  const id = req.body.project_id;

  projectDB.get(id)
    .then(project => {
      if (project) {
        next();
      } else res.status(404).json({ message: "invalid project id" })
    })
    .catch(() => res.status(500).json({ error: "The projects information could not be retrieved." }))
};

function validateAction(req, res, next) {
  const {project_id, description, notes } = req.body;

  if (!req.body) res.status(400).json({ message: "missing action data" })
  else if (!project_id || !description || !notes) 
    res.status(400).json({ message: "missing required field: project_id, description, or notes" })
  else next();
};

module.exports = router;