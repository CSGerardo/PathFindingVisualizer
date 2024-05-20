
import { useEffect, useState } from 'react';
import './App.css'

export default function MazeGrid({width=15, height=15}) {

  useEffect(()=>{
    generateMaze(width, height);
  }, []);

  const [maze, setMaze]=useState([]);
  const [timeOutIDs, setTimeOutIDs]=useState([]);

  function bfs(startNode) {
    let queue=[startNode];
    let visited=new Set(`${startNode[0]}, ${startNode[1]}`)

    function makeCellBlue(rowNumber, colNumber){
      setMaze((prevMaze)=>prevMaze.map((row, rowIndex)=>
        row.map((cell, cellIndex)=>{
          if(rowIndex===rowNumber && cellIndex===colNumber){
            return cell==="end" ? "end" : "nextNode"
          };
          return cell
        })
      ));
    };

    function step(){
      if(queue.length===0){
        return;
      }
      if(queue[0]!=startNode){
        makeCellBlue(queue[0][0], queue[0][1])
      }
      const [rowNumber, colNumber]=queue.shift();

      const dirs=[[-1,0], [0,1], [1,0], [0,-1]];

      for (const [upOrDown, leftOrRight] of dirs){
        const nextRow=rowNumber + upOrDown;
        const nextCol=colNumber + leftOrRight;
        if(nextRow>=0 && nextRow<height && nextCol>=0 && nextCol<width && !visited.has(`${nextRow}, ${nextCol}`)){
          visited.add(`${nextRow}, ${nextCol}`);
          if(maze[nextRow][nextCol]==="path"){
            queue.push([nextRow, nextCol]);
          }else if(maze[nextRow][nextCol]==="end"){
              console.log("Path found!");
              return true
            };
        };
      };      
      const timeOut=setTimeout(step, 100);
      setTimeOutIDs((peviousTimeOutIds)=>[...peviousTimeOutIds, timeOut])
    };

    step();
    return false

  };

  function dfs(startNode) {
    let stack=[startNode];
    let visited=new Set(`${startNode[0]}, ${startNode[1]}`)

    function makeCellBlue(rowNumber, colNumber){
      setMaze((prevMaze)=>prevMaze.map((row, rowIndex)=>
        row.map((cell, cellIndex)=>{
          if(rowIndex===rowNumber && cellIndex===colNumber){
            return cell==="end" ? "end" : "nextNode"
          };
          return cell
        })
      ));
    };

    function step(){
      if(stack.length===0){
        return;
      }
      if(stack[0]!=startNode){
        makeCellBlue(stack[stack.length-1][0], stack[stack.length-1][1]);
      }
      const [rowNumber, colNumber]=stack.pop();

      const dirs=[[-1,0], [0,-1], [1,0], [0,1]];

      for (const [upOrDown, leftOrRight] of dirs){
        const nextRow=rowNumber + upOrDown;
        const nextCol=colNumber + leftOrRight;
        if(nextRow>=0 && nextRow<height && nextCol>=0 && nextCol<width && !visited.has(`${nextRow}, ${nextCol}`)){
          visited.add(`${nextRow}, ${nextCol}`);
          if(maze[nextRow][nextCol]==="path"){
            stack.push([nextRow, nextCol]);
          }else if(maze[nextRow][nextCol]==="end"){
              console.log("Path found!");
              return true
            };
        };
      };      
      const timeOut=setTimeout(step, 100);
      setTimeOutIDs((peviousTimeOutIds)=>[...peviousTimeOutIds, timeOut])
    };

    step();
    return false

  };

  function generateMaze(height, width){
    let matrix=[];

    for(let i=0; i<height; i++){
      let row=[];
      for(let j=0; j<width; j++){
        row.push("wall");
      };
      matrix.push(row);
    };

    const dirs=[[-1,0], [0,1], [1,0], [0,-1]];

    function isCellValid(rowNumber, colNumber){
      return rowNumber>=0 && colNumber>=0 && rowNumber<height && colNumber<width && matrix[rowNumber][colNumber]==="wall" 
    }

    function carvePath(rowNumber, colNumber){
      matrix[rowNumber][colNumber]="path"

      const directions=dirs.sort(()=>Math.random()-0.5);

      for (let [upOrDown, leftOrRight] of directions){
        const nextRow=rowNumber + upOrDown*2;
        const nextCol=colNumber + leftOrRight*2;
        if(isCellValid(nextRow, nextCol)){
          matrix[rowNumber+upOrDown][colNumber+leftOrRight]="path";
          carvePath(nextRow, nextCol);
        };
      };
    };

    carvePath(1,1);

    matrix[1][0]="start";
    matrix[height-2][width-1]="end";
    setMaze(matrix);
  };

  function refreshMaze(){
    timeOutIDs.forEach(clearTimeout);
    setTimeOutIDs([]);
    generateMaze(15,15);
  }

  return (
    <div className="maze-grid">
      <div className="controls">
        <button className="maze-button" onClick={refreshMaze}>Refresh Maze</button>
        <button className="maze-button" onClick={()=>bfs([1,0])}>Breadth-First Search</button>
        <button className="maze-button" onClick={()=>dfs([1,0])}>Depth-First Search</button>
      </div>
      <div className="maze">
        {maze.map((row, rowIndex)=>(
          <div key={rowIndex} className="row">
            {row.map((cell, cellIndex)=>(
              <div key={cellIndex} className={`cell ${cell}`}></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

