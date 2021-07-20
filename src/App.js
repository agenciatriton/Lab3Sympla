import React , { useState, useEffect } from 'react';
import ReactHtmlParser from 'react-html-parser';
import './App.css';
import './fontes/roboto/stylesheet.css';
import { URLsocket, socket } from "./Componentes/Config";
import { DataEventoInicio } from "./Componentes/Funcoes";

function App() {

  const [ IdEvento, setIdEvento ] = useState("");
  const [ NomeEvento, setNomeEvento ] = useState("");
  const [ ImagemEvento, setImagemEvento ] = useState("");
  const [ URLEvento, setURLEvento ] = useState("");
  const [ DescEvento, setDescEvento ] = useState("");
  const [ ListagemEventos, setListagemEventos ] = useState([]);


  async function ListaEvento(EventoId) {
    const response = await fetch(URLsocket+'/ListaEvento/' + EventoId, { method: 'GET', headers: {'Content-Type': 'application/json'} });
    const jsonResult = await response.json();
    const val = jsonResult.data;
    //console.log('xxxx',jsonResult);
    setIdEvento(val.id);
    setNomeEvento(val.name);
    setImagemEvento(val.image);
    setURLEvento(val.url);
    setDescEvento(val.detail);
  }

  useEffect(() => {
    document.location = "http://www.lab3.tv";
    ListaEvento('1084332');
  }, []);





  async function ListaEventos() {
    const response = await fetch(URLsocket+'/ListaEventos', { method: 'GET', headers: {'Content-Type': 'application/json'} });
    const jsonResult = await response.json();
    const val = jsonResult.data;
    setListagemEventos(val);
    // console.log(val);
  }

  useEffect(() => {
    ListaEventos();
  }, []);






  socket.on('Teste', function (data) {
  //  setTeste(data);
  });
  
  return (
      <>

{/*
        <div>xxx{document.location.pathname.substr(2).toLowerCase().split("/")[1]}</div>
        
        <div>
        {
          ListagemEventos.map((item, index) =>
            <div key={item.id.toString()}>

              <div><img src={item.image} width={200} alt={item.name}/></div>
              <div>{item.id}</div>
              <div>{item.name}</div>
              <div>{item.url}</div>
              <div>{DataEventoInicio(item.start_date)}</div>

              <br />
            </div>
          )
        }
        </div>

        <br />

        <button onClick={()=>ListaEvento('1084332')}>1084332</button>
        <button onClick={()=>ListaEvento('1084542')}>1084542</button>
        <br />

        <div>
          <div><img src={ImagemEvento} width={200} alt={NomeEvento}/></div>
          <div>{IdEvento}</div>
          <div>{NomeEvento}</div>
          <div>{URLEvento}</div>
          <div>{ReactHtmlParser(DescEvento)}</div>
        </div>
*/}


      </>
  );

}

export default App;
