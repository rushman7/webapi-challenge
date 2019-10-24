import React, { useState, useEffect } from 'react';
import { Dimmer, Loader, Button } from 'semantic-ui-react'
import { axiosWithAuth } from '../utils/axiosWithAuth';

const Projects = props => {
  const [projects, setProjects] = useState();

  useEffect(() => {
    axiosWithAuth()
      .get('http://localhost:5000/api/projects')
      .then(res => {
        console.log(res.data)
        setProjects(res.data)
      })
      .catch(err => console.log(err));
  }, [])

  if (!projects) {
    return   (
      <div>
        <Dimmer active>
          <Loader>Loading...</Loader>
        </Dimmer>
      </div>
    )
  }
  return (
    <div className="project-cont">
      {projects.map(project => 
        <div className="projects" key={project.id}>
          <h3>{project.name}</h3>
          <p>{project.description}</p>
          <Button 
            className="button-projects"
            secondary
            onClick={() => props.history.push(`/projects/${project.id}`)}
          >Details</Button>
        </div>)}
    </div>
  );
}

export default Projects;
