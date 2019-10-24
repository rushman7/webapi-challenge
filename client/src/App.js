import React from 'react';
import Projects from './components/Projects';
import Project from './components/Project';
import { Route } from "react-router-dom";
import './App.css';

function App() {
  return (
    <div className="App">
      <h2 className="title">Projects and Actions</h2>
      <Route exact path="/" component={Projects}/>
      <Route exact path="/projects/:id" component={Project} />
    </div>
  );
}

export default App;
