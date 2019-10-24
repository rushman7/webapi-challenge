const express = require('express');
const cors = require('cors');
const projectRouter = require('./routes/projectRouter');
const actionRouter = require('./routes/actionRouter');

require('dotenv').config();

const server = express();
const port = process.env.PORT;

server.use(express.json())
server.use(cors());

function logger(req, res, next) {
  console.log(
    `[${new Date().toISOString()}] ${req.method} to ${req.url} from ${req.get('Origin')}`
  );
  next();
};

server.use(logger);

server.use((err, req, rest, next) => {
  console.error(err);
  res.status(500).json({ message: 'There was an error performing the required operation', error: err })
})

server.use('/api/projects', projectRouter)
server.use('/api/actions', actionRouter)

server.listen(port, () => console.log(`\n*** Server Running on http://localhost:${port} ***\n`));