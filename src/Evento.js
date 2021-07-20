import React , { useState, useEffect } from 'react';
import { /*Redirect,*/ useHistory } from 'react-router-dom';
import ReactHtmlParser from 'react-html-parser';
import { URLsocket, /*socket*/ } from "./Componentes/Config";
import Carregando from './Componentes/Carregando';


function Evento() {

  const history = useHistory();
  const [ Loading, setLoading ] = useState(true);
  const [ IdEvento, setIdEvento ] = useState("");
  const [ NomeEvento, setNomeEvento ] = useState("");
  const [ ImagemEvento, setImagemEvento ] = useState("");
  const [ URLEvento, setURLEvento ] = useState("");
  const [ DescEvento, setDescEvento ] = useState("");
  const [ BgEvento, setBgEvento ] = useState("");


  async function PegaDadosEvento() {
    
    setLoading(true);
    const c_pathname = document.location.pathname.substr(1).toLowerCase();
    const response = await fetch(URLsocket+'/PegaDadosEvento/' + c_pathname, { method: 'GET', headers: {'Content-Type': 'application/json'} });
    const jsonResult = await response.json();

    if(jsonResult !== null) {

      setLoading(false);
      const val1 = jsonResult[0];
      const val2 = jsonResult[1].data;
    //  // console.log('PegaDadosEvento: ', jsonResult);
      setNomeEvento(val1.c_nome);
      setIdEvento(val1.id_sympla);
      setBgEvento(val1.c_bg);
      setURLEvento(val2.url);
      setDescEvento(val2.detail);
      setImagemEvento(val2.image);

    } else {

      setLoading(false);
      history.push('/');
      
    }

  }

  useEffect(() => {
    PegaDadosEvento();
  }, []);
  













  return (
      <>
      <div style={{backgroundColor: BgEvento}}>

        {Loading === true ? <Carregando /> : null }

        <div>{IdEvento}</div>
        <div>{NomeEvento}</div>

        <div><img src={ImagemEvento} width={200} alt={NomeEvento}/></div>
        <div>{URLEvento}</div>
        <div>{ReactHtmlParser(DescEvento)}</div>

      </div>
      </>
  );

}

export default Evento;
