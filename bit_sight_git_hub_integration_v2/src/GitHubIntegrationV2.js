import React, { useState, useEffect } from 'react';
import './App.css';

import moment from 'moment';


function GitHubIntegrationV2() {


  const [topFiveRepositories, setTopFiveRepositories] = useState({});
  const [topFiveUsers, setTopFiveUsers] = useState({});
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    fetchTopFiveRepositories();
    fetchTopFiveUsers();

    setInterval(() => {
      fetchTopFiveRepositories();
      fetchTopFiveUsers();
    }, 2000 * 60)

  }, []);

  useEffect(() => {
    getFollowers()
  }, [loading]);

  async function fetchTopFiveRepositories() {
    var lastMonth = moment().subtract(1, 'month').add(1, 'day').format("YYYY-MM-DD");
    await fetch(`https://api.github.com/search/repositories?q=created:">${lastMonth}"&sort=stars&order=desc&per_page=5`)
      .then(response => response.json())
      .then(data => setTopFiveRepositories(data))
      .catch(error => console.error("Error message" + error))
  }

  async function fetchTopFiveUsers() {
    var lastYear = moment().startOf('year').subtract(1, 'year').format("YYYY-MM-DD");
    await fetch(`https://api.github.com/search/users?q=created:">${lastYear}"&sort=followers&order=desc&per_page=5&type=Users`)
      .then(response => response.json())
      .then(data => { setTopFiveUsers(data); setLoading(true) })
      .catch(error => console.error("Error message" + error))
  }



  async function getFollowers() {
    let fiveUsers = { ...topFiveUsers.items }
    return topFiveUsers.items?.forEach(async (user, index) => {
      await fetch(`https:api.github.com/users/${user.login}`)
        .then(response => response.json())
        .then(userData => {
          let modifiedElement = { ...topFiveUsers.items[index], followers: userData.followers }
          fiveUsers.push(modifiedElement)
          setTopFiveUsers(fiveUsers)
        })
        .catch(error => console.error("Error message" + error))
    })
  }

  function tableDataForRepositories() {
    return topFiveRepositories.items?.map(rep => {
      const { id, name, description, stargazers_count } = rep
      return (
        <tr key={id}>
          <td>{id}</td>
          <td>{name}</td>
          <td>{description}</td>
          <td>{stargazers_count}</td>
        </tr>
      )
    })
  }

  function tableDataForUsers() {
    return topFiveUsers.items?.map(rep => {
      const { id, login, avatar_url, followers } = rep
      return (
        <tr key={id}>
          <td>{id}</td>
          <td>{login}</td>
          <td><img src={avatar_url} alt="None" style={{ width: "50px", height: "50px" }} /></td>
          <td>{followers}</td>
        </tr>
      )
    })
  }


  return (
    <div className="App">
      <div className="top_five_repositories_div">
        <button id="hot_repo" onClick={() => fetchTopFiveRepositories()}>Click to refresh table</button>
        <table>
          <thead>
            <tr>
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
        <button id="prolific_users" onClick={() => fetchTopFiveUsers()}>Click to refresh table</button>
        <table>
          <thead>
            <tr>
              <th>Id</th>
              <th>Login</th>
              <th>Avatar Image</th>
              <th>Nº of followers</th>
            </tr></thead>
          <tbody>
            {tableDataForUsers()}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default GitHubIntegrationV2;
