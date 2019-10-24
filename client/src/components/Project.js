import React, { useState, useEffect } from 'react';
import { Dimmer, Loader, Button, List } from 'semantic-ui-react'
import { axiosWithAuth } from '../utils/axiosWithAuth';

const Project = props => {
  const [project, setProject] = useState();

  useEffect(() => {
    axiosWithAuth()
      .get(`http://localhost:5000/api/projects/${props.match.params.id}`)
      .then(res => {
        console.log(res.data)
        setProject(res.data)
      })
      .catch(err => console.log(err));
  }, [])

  if (!project) {
    return   (
      <div>
        <Dimmer active>
          <Loader>Loading...</Loader>
        </Dimmer>
      </div>
    )
  }
  return (
    <div className="single-project-div">
      <List className="semantic-list" bulleted>
        <List.Item>Name: {project.name}</List.Item>
        <List.Item>Description: {project.description}</List.Item>
        <List.Item>
          Actions:
          <List.List>
            {project.actions.map(action => 
              <List.List key={action.id}>
                <List.Item>Description: {action.description}</List.Item>
                <List.Item>Notes: {action.notes}</List.Item>
                <List.Item>ID: {action.id}</List.Item>
                <List.Item>ID it belongs to: {action.project_id}</List.Item>
              </List.List>)}
          </List.List>
        </List.Item>
      </List>

      <Button 
        className="button-projects"
        secondary
        onClick={() => props.history.push('/')}
      >Go Back</Button>
    </div>
  );
}

export default Project;
