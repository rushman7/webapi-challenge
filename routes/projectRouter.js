const express = require('express');
const projectDB = require('../data/helpers/projectModel');

const router = express.Router();

router.post('/', validateProject, (req, res) => {
  projectDB.insert(req.body)
    .then(project => res.status(201).json(project))
    .catch(() => res.status(500).json({ error: "There was an error while saving the project to the database" }))
});

router.get('/', (req, res) => {
  const sortField = req.query.sortBy || 'id';

  projectDB.get()
    .then(projects => {
      const response = projects.sort((a,b) => a[sortField] < b[sortField] ? -1 : 1)
      res.status(200).json(response)
    })
    .catch(() => res.status(500).json({ error: "The projects information could not be retrieved." }))
});

router.get('/:id', validateProjectId, (req, res) => {
  res.status(200).json(req.project)
});

router.delete('/:id', validateProjectId, (req, res) => {
  projectDB.remove(req.project.id)
    .then(project => {
      if (project) res.status(202).json({ error: `The project with the ID ${req.project.id} has been removed.` })
      else res.status(404).json({ error: "The project with the specified ID does not exist." })
    })
    .catch(() => res.status(500).json({ error: "The project could not be removed" }))
});

router.put('/:id', validateProjectId, validateProject, (req, res) => {
  projectDB.update(req.project.id, req.body)
    .then(project => {
      if (project) res.status(200).json({ error: `The project with the ID ${req.project.id} has been updated.` })
      else res.status(404).json({ error: "The project with the specified ID does not exist." })
    })
    .catch(() => res.status(500).json({ error: "The project information could not be modified." }))
});

// custom middleware

function validateProjectId(req, res, next) {
  const id = req.params.id;

  projectDB.get(id)
    .then(project => {
      if (project) {
        req.project = project;
        next();
      } else res.status(404).json({ message: "invalid project id" })
    })
    .catch(() => res.status(500).json({ error: "The projects information could not be retrieved." }))
};

function validateProject(req, res, next) {
  const { name, description } = req.body;

  if (!req.body) res.status(400).json({ message: "missing project data" })
  else if (!name || !description) res.status(400).json({ message: "missing required field: name or description" })
  else next();
};

module.exports = router;