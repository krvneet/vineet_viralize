import axios from 'axios';
import './App.css';
import { useState } from 'react';

function App() {

  const [playerId, setPlayerId] = useState("");
  const [playerId1, setPlayerId1] = useState("");
  const [playerData, setPlayerData] = useState(null);
  const [games, setGames] = useState(null);

  return (
    <div className="App">
      <div>
        <input 
          type="text"
          value={playerId}
          onChange={(e) => setPlayerId(e.target.value)}
        />

        <button
          onClick={async() => {
            try{
              console.log(playerId);
              const res = await axios.get(`https://lichess.org/api/user/${playerId}`)
              setPlayerData(res.data);
            }
            catch(err){
              setPlayerData({error: true})
            }
          }}
        >Fetch</button>

        {playerData && !playerData.error &&
          <div>
            <p>name: {playerData.username}</p>
            <p>game played: {playerData.count.all}</p>
            <p>win ration: {playerData.count.win/playerData.count.all}</p>
          </div>
        }
        {playerData && playerData.error && 
          <p>User not found</p>
        }


        <h1>10 latest game</h1>

        <input 
          type="text"
          value={playerId1}
          onChange={(e) => setPlayerId1(e.target.value)}
        />

        <button
          onClick={async() => {
            try{
              console.log(playerId1);
              const res = await axios.get(`https://lichess.org/api/games/user/${playerId1}`)
              let temp = [];

              let temp_obj = {};
              res.data.split('\n').map((d) => {
                if(d[0] === '['){
                  d = d.substr(1, d.length-2);
                  const [key, value] = d.split(' ');
                  temp_obj[key] = value;
                }
                else{
                  if(Object.keys(temp_obj).length !== 0){
                    temp.push(temp_obj);
                    temp_obj = {};
                  }
                }
              })
              
              const val = Math.min(temp.length, 10);
              setGames(temp.slice(0, val));
              console.log(temp)
            }
            catch(err){
              console.log(err);
            }
          }}
        >Fetch top 10</button>
        
        <table>
                <thead>
                    <tr>
                        <th>Opponent name</th>
                        <th>Result</th>
                        <th>Opening name</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {games && games.map((game, index) => (
                        <tr key={index}>
                            <td>{game.Black === "${playerId1}" ? game.White : game.Black}</td>
                            <td>{game.Result === '"1-0"' ? "win" : "loos"}</td>
                            <td>{game.Variant}</td>
                            <td>{game.Date}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        
      </div>
    </div>
  );
}

export default App;