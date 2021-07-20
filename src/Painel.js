import React , { useState, useEffect, useRef } from 'react';
import { confirmAlert } from 'react-confirm-alert';
import { useForm } from 'react-hook-form';
import { Redirect, useHistory } from 'react-router-dom';

import 'react-confirm-alert/src/react-confirm-alert.css';
import './fontes/roboto/stylesheet.css';
import './Estilos.css';

import LogoLab3 from "./images/lab3-logo.png";
import Carregando from './Componentes/Carregando';

import {URL, socket} from "./Config";

function Painel() {

  var pagina = "video";

  const history = useHistory();
  const [ Loading, setLoading ] = useState(true);
  const { register, handleSubmit, errors, setValue } = useForm();
  
  const [ Hashtag, setHashtag ] = useState("");
  const [ CorBg, setCorBg ] = useState("");
  const [ CorNome, setCorNome ] = useState("");
  const [ CorTexto, setCorTexto ] = useState("");
  const [ MenuMobAberto, setMenuMobAberto ] = useState("");


  useEffect(() => {
    setTimeout(() => { setLoading(false); }, 1);
    if(!localStorage.getItem("LogadoSymplaLab3")){
      history.push('/login');
    }
  }, []);

  function LogOut() {
    socket.disconnect();
    setLoading(true);
    setTimeout(() => {
      localStorage.removeItem("LogadoSymplaLab3");
      history.push('/login');
    }, 500);
  }



  async function DefinirConfig() {

    socket.on('DefinirConfig', function (data) {
        const Config = JSON.parse(data);
        console.log('Aqui', Config.Hashtag, Config.CorBg, Config.CorNome, Config.CorTexto);
        setHashtag(Config.Hashtag);
        setCorBg(Config.CorBg);
        setCorTexto(Config.CorTexto);
        setCorNome(Config.CorNome);
        console.log('Hashtag:', Hashtag);
    });

  }

  useEffect(() => { DefinirConfig(); }, []);

  useEffect(() => { socket.emit('EnviaHash', Hashtag); }, [Hashtag]);




  function DefineConfig(Hashtag, CorBg, CorTexto, CorNome){    
    // console.log(CorBg, CorTexto, CorNome);
    let ListaCores = JSON.stringify({
        Hashtag: Hashtag,
        CorBg: CorBg,
        CorNome: CorNome,
        CorTexto: CorTexto
    })
    socket.emit('DefineConfig', ListaCores);
  };

  const AlertForm = (TextoAlert) => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className='AlertaJs'>
            {<h1>ATENÇÃO</h1>}
            <p>{TextoAlert}</p>
            <button onClick={() => { onClose(); }}>OK</button>
          </div>
        );
      },
      closeOnEscape: false,
      closeOnClickOutside: false,
    });
  };






  async function PegaConfig() {
    const response = await fetch(URL+'/Config', { method: 'GET', headers: {'Content-Type': 'application/json'} });
    const jsonResult = await response.json();
    setHashtag(jsonResult.c_hashtag);
    setCorBg(jsonResult.c_cor_fundo);
    setCorTexto(jsonResult.c_cor_texto);
    setCorNome(jsonResult.c_cor_nome);
  }

  useEffect(() => { PegaConfig(); }, []);
  useEffect(() => { setValue("c_hashtag", Hashtag); }, [setValue, Hashtag]);
  useEffect(() => { setValue("c_cor_fundo", CorBg); }, [setValue, CorBg]);
  useEffect(() => { setValue("c_cor_texto", CorTexto); }, [setValue, CorTexto]);
  
  
  function AbreMenu() {
    if(MenuMobAberto === true) {
      setMenuMobAberto(false);
    } else {
      setMenuMobAberto(true);
    }
  }





  const onSubmit = async (data, e) => {
    
    if(data.c_cor_fundo == ""){
      AlertForm('O campo COR DO BACKGROUND é de preenchimento obrigatório!');
      setLoading(false);
      e.preventDefault();
    }
    
    if(data.c_cor_texto == ""){
      AlertForm('O campo COR DO TEXTO é de preenchimento obrigatório!');
      setLoading(false);
      e.preventDefault();
    }
    
    if(data.c_hashtag == ""){
      AlertForm('O campo HASHTAG é de preenchimento obrigatório!');
      setLoading(false);
      e.preventDefault();
    }

    if(data.c_hashtag !== "" && data.c_cor_texto !== "" && data.c_cor_fundo !== ""){

      setLoading(true);

      DefineConfig(data.c_hashtag, data.c_cor_fundo, data.c_cor_texto, data.c_cor_texto);

      const response = await fetch(URL+'/EditConfig', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          c_hashtag: data.c_hashtag,
          c_cor_texto: data.c_cor_texto,
          c_cor_fundo: data.c_cor_fundo,
        }),
      });

      const jsonResult = await response.json();
      // console.log(jsonResult);

      if(jsonResult !== null){
        
          var val = jsonResult[0];
          setTimeout(() => {

            AlertForm('Dados gravados!');
            setLoading(false);

          }, 500);

      } else {
        
          AlertForm('Tente novamente!');
          setLoading(false);
        
      }

    }

  };






  const [dataarray, set_dataarray] = useState([]);
  const itemsRef = useRef([]);
  const itemsRef1 = useRef([]);
  const itemsRef2 = useRef([]);

  const [id_tb_twitter, set_id_tb_twitter] = useState('');
  const [id_pagina, set_id_pagina] = useState('');
  const [c_name, set_c_name] = useState('');
  const [c_text, set_c_text] = useState('');
  const [c_img, set_c_img] = useState('');
  const [status, set_status] = useState('');
  const [status2, set_status2] = useState('');
  const [contador, set_contador] = useState(0);


  useEffect(() => {
      itemsRef.current = itemsRef.current.slice(0, dataarray.length);
  }, [dataarray]);


  function BoxEntra(data, pagina){
      set_id_tb_twitter(data.id_tb_twitter);
      set_id_pagina(pagina);
      set_c_name(data.c_name);
      set_c_text(data.c_text);
      set_c_img(data.c_img);
      set_status(data.status);
      set_status2(data.status2);
  };


  function BoxEntraPos(id, page, qrcode){
    socket.emit('recebe_resposta1', 'entrar', id, page, qrcode);
  };


  function BoxSai(p_index, pagina){

    if(id_tb_twitter){
      const updatedArrayx = [...dataarray];
      updatedArrayx.map((tb_twitter, index) => {

        if(p_index == tb_twitter.id_tb_twitter){

          if(pagina == 'video') {
            updatedArrayx[index].status = false;
          } else {
            updatedArrayx[index].status2 = false;
          }

        }

      })
      
      set_id_tb_twitter();
      set_dataarray(updatedArrayx);


      socket.emit('recebe_resposta1', 'sair', id_tb_twitter, pagina);
      set_c_name('');
      set_c_text('');
      set_c_img('');
      set_status();
      set_status2();

      console.log(pagina);
      console.log(dataarray);

    }

  };


  useEffect(() => {

    socket.on('tipo1', function (data) {
      console.log('tipo1:', data);
      pagina = data;
    });

    socket.on('resposta1', function (data) {

      if(pagina == "video") {

          console.log('data:', data, ' - page:', pagina);

          if(data[0].status =='1'){
            BoxEntra(data[0], pagina);
          } else if(data == 'saiu'){
            BoxSai(data[0].id_tb_twitter, pagina);
          }

          if(data[0].status2 =='1'){
            BoxEntra(data[0], pagina);
          } else if(data == 'saiu'){
            BoxSai(data[0].id_tb_twitter, pagina);
          }
    
      }

    });

    socket.on ('envia_resposta1', function (data) {

      if(pagina == "video") {
      // console.log(JSON.parse(data).c_name);
      const updatedArray = JSON.parse(data);
      set_dataarray(dataarray => [...dataarray, updatedArray]);
      //set_contador(p_conta++);
      //meuconta = meuconta++;
      set_contador(contador => contador + 1)


    }
    });

  }, []);


  function LimpaResultados(porcentagem){
    var total = contador;
    var quantos_excluir = 0;
    //alert((total/100*parseInt(porcentagem)));
    if((total/100*porcentagem) > 1){
      quantos_excluir = (total/100*parseInt(porcentagem));
      //aqui exclui os registros
      var p_contador = 0;
      const updatedArrayx = [...dataarray];
      updatedArrayx.map((tb_twitter, index) => {
        if(p_contador < quantos_excluir){
          updatedArrayx[index].status = false;
        }
        p_contador++;
      })
      set_dataarray(updatedArrayx);
    }
  }


  async function LimpaFila(id){



      var p_contador = 0;

      const updatedArrayx = [...dataarray];
      updatedArrayx.map((tb_twitter, index) => {

        if(tb_twitter.id_tb_twitter < id){
          updatedArrayx[index].status = false;
   
        }else{
          p_contador++;
        }
  
      })
      console.log(p_contador)

    
      set_dataarray(updatedArrayx);
      set_contador(p_contador);

    
  }







  if(!localStorage.getItem("LogadoSymplaLab3")){
    return (
      <>
        {Loading === true ? <Carregando /> : null }
      </>
    );

  } else {

    return (
      <>

        {Loading === true ? <Carregando /> : null }

          <div className="TopoFixo">
            <div className="AreaTopoFixo">
              <div><img src={LogoLab3} className="LogoTopo" /></div>
              <div>
                <div className="QntConectado">Mensagens:<span>{contador}</span></div>
                <div><button className="BtLogout" onClick={()=>DefineConfig('Corinthians', '#000000', '#333333', '#888888')}>Cores</button></div>
                <div><button className="BtLogout" onClick={()=>AbreMenu()}>Abre</button></div>
                <div><button className="BtLogout" onClick={()=>LogOut()}>SAIR</button></div>
              </div>
            </div>
          </div>

          <div className={`MenuMob ${MenuMobAberto ? "MenuMobAberto" : ''}`}>
            <div className="AreaMenuMob">

                <form onSubmit={handleSubmit(onSubmit)}>

                  <input ref={register} id="c_hashtag" name="c_hashtag" type="text" placeholder={'Hashtag'} className="CampoForm" />
                  <div className="clear"></div>

                  <input ref={register} id="c_cor_texto" name="c_cor_texto" type="text" placeholder={'Cor do texto'} className="CampoForm" />
                  <div className="clear"></div>

                  <input ref={register} id="c_cor_fundo" name="c_cor_fundo" type="text" placeholder={'Cor do background'} className="CampoForm" />
                  <div className="clear"></div>

                  <button type="submit" className="BotaoAcessar">SALVAR</button>

                </form>

            </div>
          </div>

          <div className="clear"></div>






          <div className="RolagemChat" id="RolagemChat">
            {
              dataarray.map((tb_twitter, index) => {

                return(

                  <>
                    {tb_twitter.status?
                      <div ref={el => itemsRef.current[tb_twitter.id_tb_twitter] = el} key={tb_twitter.id_tb_twitter} id={tb_twitter.id_tb_twitter} >

                      <span> <img src={tb_twitter.c_img} /> </span>
                      <span> <b>@{tb_twitter.c_name}</b> {tb_twitter.text} </span>

                      {/*<span><button onClick={()=>{ LimpaFila(tb_twitter.id_tb_twitter); }}> Limpar anteiores </button></span>*/}

                      <span>
                        {
                          id_tb_twitter == tb_twitter.id_tb_twitter && pagina == 'video' ?
                          <>
                            <button className="BotaoMsg BotaoSair" onClick={()=>{ BoxSai(tb_twitter.id_tb_twitter, 'video'); }}> Sair </button>
                          </>
                          :
                          <>
                            <button className="BotaoMsg BotaoEntrar" onClick={()=>{ BoxEntraPos(tb_twitter.id_tb_twitter, 'video', 'QREsq'); }}> Entrar </button>
                            {/* <button className="BotaoMsg BotaoEntrar" onClick={()=>{ BoxEntraPos(tb_twitter.id_tb_twitter, 'video', 'QRDir'); }}> Entrar ⇢ </button>*/}
                          </>
                        }
                      </span>


                      </div>
                    :
                      null
                    }
                  </>

                );

              })
            }
          </div>




      </>
    );

  }
}

export default Painel;
