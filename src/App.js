import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

const minCellNum = 16, cellNum = 32;
const aspectRatio = window.innerWidth / window.innerHeight;
const cellPrefWidth = 120*aspectRatio;
const cellPrefHeight = 120;
const colNum = Math.floor(window.innerWidth/cellPrefWidth);
const rowNum = Math.floor((cellNum/colNum)*cellPrefHeight > window.innerHeight ? Math.max(minCellNum, window.innerHeight/cellPrefHeight) : cellNum/colNum);
const cellHeight = Math.round(100/rowNum)+'%';
const colorLetters = '0123456789ABCDEF';
var colorTheme = [getRandomThemeColor(), getRandomThemeColor(), getRandomThemeColor()];
const mainDims = [
  [2,1],[3,1],[2,2],[3,3],[3,2],[2,3]
];
const pages = {
  main:[
    {msg:()=>(<h1>Ga Lim</h1>),size:mainDims[Math.floor(Math.random()*mainDims.length)],link:'portfolio'},
    {msg:()=>(<h3>Projects</h3>),size:[1,1],link:'projects'},
    {msg:()=>(<img src={logo} class='App-logo' alt='ReactJS' />),size:[1,1],link:'>portfolio.html'}
  ],
  projects: [
    {msg:()=>(<h3>Letter Bambam</h3>),size:[1,1],link:'>p1.js'}
  ]
}

function getRandomThemeColor(){
  var randLength = (Math.random()*4)+4;
  var randStart = Math.random()*(colorLetters.length-randLength);
  return colorLetters.slice(randStart, randStart+randLength)
}

function getRandomColor() {
  var color = '#';
  for (var i = 0; i < 6; i++) {
    if (i % 2 === 0) var letters = colorTheme[i/2];
    color += letters[Math.floor(Math.random() * letters.length)];
  }
  return color;
}

class App extends Component {
  constructor(){
    super();
    this.state = {
      content:[]
    }
    this.handleClick = this.handleClick.bind(this);
  }
  
  setContents(content){
    let tdata = {};
    for (let i=0;i<content.length;i++){
      let col, row, index
      do {
        col = Math.floor(Math.random()*(colNum-content[i].size[0]+1));
        row = Math.floor(Math.random()*(rowNum-content[i].size[1]+1));
        index = 'X'+col+'Y'+row;
      } while (tdata[index]);
      tdata[index] = content[i];
      for (let vy=0;vy<content[i].size[1];vy++){
        for (let vx=0;vx<content[i].size[0];vx++){
          if (vx !== 0 || vy !== 0){
            for (let ii=0;ii<colNum;ii++){
              let cindex = 'X'+ii+'Y'+(row+vy);
              if (!tdata[cindex]){
                tdata[cindex] = 'X';
                break;
              }
            }
          }
        }
      }
    }
    this.setState({content:tdata});
  }
  
  componentWillMount(){
    this.setContents(pages.main);
  }
  
  handleClick(link){
    link === '' ? this.setState({})
    : link[0] === '>' ? window.location = link.slice(1)
    : this.setContents(pages[link]);
  }
  
  makeCell(x,y){
    let index = 'X'+x+'Y'+y;
    let cellData = this.state.content[index];
    if (cellData !== 'X'){
      let colspan = cellData?cellData.size[0]:1;
      let rowspan = cellData?cellData.size[1]:1;
      let data = cellData?cellData.msg:()=>'';
      let link = cellData?cellData.link:'';
      let style = {background: getRandomColor(), height: cellHeight};
      return (
        <td colSpan={colspan} rowSpan={rowspan} style={style} key={'C'+(y*colNum+x)} ref={index} full={cellData?'1':'0'} onClick={()=>this.handleClick(link)} >
          {data()}
        </td>
      );
    }
  }
  
  makeRow(y){
    let cols = [];
    let x=0;
    for (let i=0;i<colNum;i++){
      cols.push(this.makeCell(x++,y));
    }
    return (
      <tr key={'R'+y} ref={'R'+y}>
        {cols}
      </tr>
    )
  }
  
  render(){
    var rows = [];
    for (let y=0;y<rowNum;y++){
      rows.push(this.makeRow(y));
    }
    return (
      <div>
        <table>
          <tbody>
            {rows}
          </tbody>
        </table>
      </div>
    );
  }
}

export default App;
