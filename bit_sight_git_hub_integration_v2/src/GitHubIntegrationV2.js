import React, { useState, useEffect } from 'react';
import './App.css';



function GitHubIntegrationV2() {


  const [topFiveRepositories, setTopFiveRepositories] = useState({});


  useEffect(() => {
    fetchTopFiveRepositories();
  }, []);

  async function fetchTopFiveRepositories() {
    await fetch(`https://api.github.com/search/repositories?q=stars&sort=stars&order=desc`)
      .then(response => response.json())
      .then(data => setTopFiveRepositories(data))
      .catch(error => console.error("Error message" + error))
  }


  function tableDataForRepositories() {
    return topFiveRepositories.items?.map(rep => {
      const { id, name, description, stargazers_count } = rep
      return (
        <tr>
          <td>{id}</td>
          <td>{name}</td>
          <td>{description}</td>
          <td>{stargazers_count}</td>
        </tr>
      )
    })
  }


  return (
    <div className="App">
      <div className="top_five_repositories_div">
        <button id="hot_repo" onClick={() => fetchTopFiveRepositories()}>Click to refresh repositories table</button>
        <table id='top_five_repositories_table'>
          <thead>        <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Description</th>
            <th>Stars</th>
          </tr></thead>
          <tbody>
            {tableDataForRepositories()}
          </tbody>
        </table>
      </div>
      <div className="top_five_users_div">
        <button >Click to refresh users table</button>
        <table id='g'>
          <thead>        <tr>
            <th>Id</th>
            <th>Login</th>
            <th>Avatar Image</th>
            <th>Nº of followers</th>
          </tr></thead>
          <tbody>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default GitHubIntegrationV2;
