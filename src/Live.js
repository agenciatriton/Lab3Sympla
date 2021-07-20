import React , { useState, useEffect, useRef } from 'react';
import { Redirect, useHistory, useLocation } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import InputMask from 'react-input-mask';
import Linkify from 'react-linkify';
import io from "socket.io-client";

import 'react-confirm-alert/src/react-confirm-alert.css';
import './fontes/roboto/stylesheet.css';
import './fontes/mulish/stylesheet.css';
import './Estilos.css';

import LogoLab3Rodape from "./images/logo_lab3_branco.png";
import LogoLab3RodapePreto from "./images/logo_lab3_preto.png";
import Carregando from './Componentes/Carregando';
import CabecalhoPagina from "./Componentes/Cabecalho";

import {URLsocket, socket, chat, c_pathname} from "./Componentes/Config";
import { AlertForm, MostrarTextoEvento, hexToRgbA, ReactHtmlParser } from "./Componentes/Funcoes";



// alert(c_pathname);

const messagesEndRef = React.createRef();
var id_tb_user1 = 'xxxx';
// let roomId = localStorage.getItem("id_tb_evento"+c_pathname);
// //const chat = io("http://192.168.1.90:3030", { query: { roomId } });
// const chat = io("https://webaovivo.com.br:3030", { query: { roomId } });


function Live() {

  const { register, handleSubmit, errors, control, setValue } = useForm();
  //const c_pathname = document.location.pathname.substr(1).toLowerCase().split("/")[0];
  //alert(c_pathname);
  const history = useHistory();
  const location = useLocation();
  const [ Loading, setLoading ] = useState(true);

  const [ EstadoSocketIO, setEstadoSocketIO ] = useState(true);

  function TESTEEMIT () {
    //console.log('xxx');
    chat.emit('entra_chat', 'xxxxxxxxx');
  }










  const [ Final, SetFinal ] = useState(true);
  const ref = useRef(Final);

  useEffect(() => {
    setTimeout(() => { ref.current = Final; }, 500);
    // console.log('passou' + Final);
  }, [Final]);

  const [chatMessages, set_chatMessages] = useState([]);


  function DesceChat() {
    try {
      messagesEndRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'end'
      })
    } catch(err) {
    // console.log(err)
    }
  }


  useEffect(() => {

    
    chat.on("CarregaChat", () => {
      console.log('foiiixxxxxi');
    });



    chat.on("entra_chat", () => {
      console.log('foiiii');
      console.log('entra_chat', chat.id);
    });




    chat.on("ExcluirMsgChat", IdMsgDel => {
      console.log('ExcluirMsgChat', IdMsgDel);
      FechaMsg(IdMsgDel);      
    });


    chat.on("chat message", msg => {

      set_chatMessages(chatMessages => [...chatMessages, msg])
      console.log(msg);
      console.log(chatMessages);

      setTimeout(() => {
        if(ref.current === true) {
          //console.log('passou 500');
        }
      }, 400);
      setTimeout(() => {
        if(ref.current === true) {
          DesceChat();
          //console.log('passou 1000');
        }
      }, 800);

    });



    setTimeout(() => {
      if(ref.current === true) {
        DesceChat();
        //console.log('passou 500');
      }
    }, 400);
    setTimeout(() => {
      if(ref.current === true) {
        DesceChat();
        //console.log('passou 800');
      }
    }, 800);



  }, []);


  const handleScroll = (e) => {
    const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if (bottom) {
      SetFinal(true);
    } else{
      SetFinal(false);
    }
  }

  function DataHora(data) {
    const p_data = data.substr(6, 2)+'/'+data.substr(4, 2)+'/'+data.substr(0, 4)+' '+data.substr(8, 2)+':'+data.substr(10, 2);
    return p_data;
  }

  function HoraMsg(data) {
    const p_data = data.substr(8, 2)+':'+data.substr(10, 2);
    return p_data;
  }

  function EnviarMsg(data) {

    chat.emit('chat message', {
      id_tb_evento: localStorage.getItem("id_tb_evento"+c_pathname),
      c_ingresso: localStorage.getItem("IdIngresso"+c_pathname),
      c_nome: localStorage.getItem("NomeCliente"+c_pathname),
      c_email: localStorage.getItem("EmailCliente"+c_pathname),
      msg: 'Teste de msg',
      id_sympla: IdEvento
    });
    
  }























  // client-side
  socket.on("connect", () => {
    // console.log('connect', socket.id);
    if (localStorage.getItem("LogadoToken"+c_pathname) !== null) {
      VerificaUltimoLogin();
    }
    setEstadoSocketIO("Conectado Socket");
  });

  socket.on("disconnect", () => {
    console.log('disconnect', socket.id);
    setEstadoSocketIO("Desconectado Socket");
    //socket.open();    
  });
  

  useEffect(() => {

    if(socket.connect().connected){
      setEstadoSocketIO("Conectado Socket");
    } else {
      setEstadoSocketIO("Desconectado Socket");
      socket.open();
    }

  }, [socket.connect().connected]);



  useEffect(() => {
    //setTimeout(() => { setLoading(false); }, 1);
    if(!localStorage.getItem("LogadoSymplaLab3"+c_pathname)){
      history.push('/' + c_pathname + '/login');
    }
  }, []);

  function LogOut() {
    socket.disconnect();
    setLoading(true);
    setTimeout(() => {

      localStorage.removeItem("LogadoSymplaLab3"+c_pathname);
      localStorage.removeItem("LogadoToken"+c_pathname);
      localStorage.removeItem("NomeCliente"+c_pathname);
      localStorage.removeItem("EmailCliente"+c_pathname);
      localStorage.removeItem("id_tb_evento"+c_pathname);

      history.push('/' + c_pathname + '/login');
      document.location = '/' + c_pathname + '/login';
    }, 500);
  }


  const [ IdEvento, setIdEvento ] = useState("");
  const [ NomeEvento, setNomeEvento ] = useState("");
  const [ BgEvento, setBgEvento ] = useState("");
  const [ BgImgEvento, setBgImgEvento ] = useState(localStorage.getItem("BgImgEvento"+c_pathname));
  const [ LogoEvento, setLogoEvento ] = useState(localStorage.getItem("LogoEvento"+c_pathname));
  const [ MostraVideo, setMostraVideo ] = useState(0);
  const [ BotaoCor, setBotaoCor ] = useState("");
  const [ BotaoBg, setBotaoBg ] = useState("");
  const [ BgForm, setBgForm ] = useState("");
  const [ TextoEvento, setTextoEvento ] = useState("");
  const [ TextoSuporte, setTextoSuporte ] = useState("");
  const [ LogoLab3, setLogoLab3 ] = useState("");
  const [ ChatAtivo, setChatAtivo ] = useState(2);
  const [ PlayerThumb, setPlayerThumb ] = useState("");
  const [ ThumbVideo, setThumbVideo ] = useState("");
  const [ Idiomas, setIdiomas ] = useState("");
  const [ CorTexto, setCorTexto ] = useState("");
  const [ CorTextoSuporte, setCorTextoSuporte ] = useState("");
  const [ CorTextoTopo, setCorTextoTopo ] = useState("");
  const [ TextoPerguntas, setTextoPerguntas ] = useState("");
  const [ TextoIdioma1, setTextoIdioma1 ] = useState("");
  const [ TextoIdioma2, setTextoIdioma2 ] = useState("");

  const [ PlayerEscolhido, setPlayerEscolhido ] = useState("");
  const [ IdVimeo, setIdVimeo ] = useState("");
  const [ IdVimeoEng, setIdVimeoEng ] = useState("");
  const [ IdWowza, setIdWowza ] = useState("");
  const [ IdWowzaEng, setIdWowzaEng ] = useState("");
  const [ IdYouTube, setIdYouTube ] = useState("");
  const [ IdYouTubeEng, setIdYouTubeEng ] = useState("");
  const [ IdDacast, setIdDacast ] = useState("");
  const [ IdDacastEng, setIdDacastEng ] = useState("");

  async function PegaDadosEvento() {
    
    setLoading(true);
    //const c_pathname = document.location.pathname.substr(1).toLowerCase().split("/")[0];

    // alert(c_pathname);
    const response = await fetch(URLsocket+'/PegaDadosEvento/' + c_pathname, { method: 'GET', headers: {'Content-Type': 'application/json'} });
    const jsonResult = await response.json();

    console.log(jsonResult)

    if(jsonResult !== null) {

      setLoading(false);
      const val1 = jsonResult[0];
      const val2 = jsonResult[1].data;
//    console.log('PegaDadosEvento: ', jsonResult);
      setNomeEvento(val1.c_nome);
      setIdEvento(val1.id_sympla);

      setPlayerEscolhido(val1.c_player);
      setIdVimeo(val1.c_vimeo);
      setIdVimeoEng(val1.c_vimeo_eng);
      setIdWowza(val1.c_wowza);
      setIdWowzaEng(val1.c_wowza_eng);
      setIdYouTube(val1.c_youtube);
      setIdYouTubeEng(val1.c_youtube_eng);
      setIdDacast(val1.c_dacast);
      setIdDacastEng(val1.c_dacast_eng);
      
      setTextoEvento(val1.c_texto_evento);
      setTextoSuporte(val1.c_texto_suporte);
      //setBgImgEvento("https://webaovivo.com.br/sympla/upload/bg/" + val1.c_bg_img);
      //setLogoEvento("https://webaovivo.com.br/sympla/upload/logo/" + val1.c_logo);

      localStorage.setItem("BgImgEvento"+c_pathname, "https://livespace.com.br/upload/bg/" + val1.c_bg_img);
      localStorage.setItem("BgImgEventoMob"+c_pathname, "https://livespace.com.br/upload/bg_mob/" + val1.c_bg_img_mob);
      localStorage.setItem("LogoEvento"+c_pathname, "https://livespace.com.br/upload/logo/" + val1.c_logo);

      setMostraVideo(1);
      setBotaoCor(hexToRgbA(val1.c_botao_cor, 0.85));
      setBotaoBg(val1.c_botao_bg);
      setBgForm(hexToRgbA(val1.c_form_bg, 0.85));
      setLogoLab3(val1.c_logo_lab3);
      setChatAtivo(val1.c_chat);
      setPlayerThumb(val1.c_thumb);
      setThumbVideo(val1.c_thumb_imagem);
      setIdiomas(val1.c_idioma);
      setCorTexto(val1.c_texto_cor);

      setCorTextoSuporte(val1.c_texto_cor_suporte);
      setCorTextoTopo(val1.c_texto_cor_topo);
      setTextoPerguntas(val1.c_texto_perguntas);
      setTextoIdioma1(val1.c_idioma1);
      setTextoIdioma2(val1.c_idioma2);

    }

  }

  useEffect(() => { PegaDadosEvento(); }, []);













  useEffect(() => {
      // VerificaLogado();    
  }, []);


  //function VerificaLogado() {
    socket.on('VerificaLogado', function (data) {

      // console.log('Passou VerificaLogado');

      // var val = JSON.parse(data);

      let val = null;
      try {
        val = JSON.parse(data);
      } catch (e) {
        val = data;
      }

      // console.log( 'VerificaLogado', data );
      // console.log( 'VerificaLogado', val );
      // console.log( 'VerificaLogado', val.c_ingresso );
      // console.log( 'VerificaLogado', data[0].c_ingresso );
      // console.log( 'VerificaLogado', data.c_ingresso );
      // console.log( 'VerificaLogado', val.c_ingresso + ' - ' + val.c_evento  + ' - ' + val.c_token );

      if(localStorage.getItem("IdIngresso"+c_pathname) == val.c_ingresso && localStorage.getItem("LogadoToken"+c_pathname) !== val.c_token) {
        localStorage.setItem("LogadoSymplaLab3"+c_pathname, 0);
        LogOut();
      } else {
        
      }
      
    });
  //}

  

/*
  function TesteVerificaLogado() {

    socket.emit('VerificaOutros', {
      c_ingresso: localStorage.getItem("IdIngresso"),
      c_evento: IdEvento,
      c_token: localStorage.getItem("LogadoToken")
    });

  }
*/  





  const [ VerificaLogin, setVerificaLogin ] = useState("");

  async function VerificaUltimoLogin() {

    // console.log('URL: ', URL, '/VerificaUltimoLogin/', localStorage.getItem("IdEvento"+c_pathname) , '/' , localStorage.getItem("IdIngresso"+c_pathname));
    

    // setLoading(true);
    const response = await fetch(URLsocket+'/VerificaUltimoLogin/'+ localStorage.getItem("IdEvento"+c_pathname) + '/' + localStorage.getItem("IdIngresso"+c_pathname), {
      method: 'POST',
      headers: {'Content-Type': 'application/json'}
    });
    const jsonResult = await response.json();

    if(jsonResult !== null) {
      // console.log('VerificaUltimoLogin', jsonResult);
      setLoading(false);
      const val1 = jsonResult[0];
      // console.log(val1.c_data);
      // console.log(val1.token);
      // console.log(jsonResult);

      if(val1.token == localStorage.getItem("LogadoToken"+c_pathname)){
        // console.log("sim");
        setVerificaLogin("sim");
      } else {
        // console.log("nao");
        setVerificaLogin("nao");
        LogOut();
      }

    }

  }

  useEffect(() => {
    setTimeout(() => {

      if (localStorage.getItem("LogadoToken"+c_pathname) !== null) {
        VerificaUltimoLogin();
      }

    }, 5000);
  }, []);

  






  function FechaMsg(IdMsgDel){
    try{ document.getElementById(IdMsgDel).style.display = 'none'; } catch(err){}
  }


  async function PegaChat() {
    //console.log('Passou PegaChat');
    const response = await fetch(URLsocket+'/PegaChat/'+ localStorage.getItem("id_tb_evento"+c_pathname), {
      method: 'GET',
      headers: {'Content-Type': 'application/json'}
    });
    const jsonResult = await response.json();

    if(jsonResult !== null) {
      //console.log('PegaChat', jsonResult);
      set_chatMessages(jsonResult)
    }

    setTimeout(() => {
        DesceChat();
    }, 100);

  }

  useEffect(() => {
    setTimeout(() => {
      PegaChat();
    }, 500);
  }, []);




















const onSubmit = async (data, e) => {

  if(data.c_msg == "" || data.c_msg == undefined){
    AlertForm('O campo MENSAGEM é de preenchimento obrigatório!');
    setLoading(false);
    e.preventDefault();
  }

  if(data.c_msg !== "" && data.c_msg !== undefined){

    chat.emit('chat message', {
      id_tb_evento: localStorage.getItem("id_tb_evento"+c_pathname),
      c_ingresso: localStorage.getItem("IdIngresso"+c_pathname),
      c_nome: localStorage.getItem("NomeCliente"+c_pathname),
      c_email: localStorage.getItem("EmailCliente"+c_pathname),
      msg: data.c_msg,
      id_sympla: IdEvento
    });

    setValue("c_msg", '');
    DesceChat();

  }

};













function ImprimeMsg(item, index) {

  //var item = JSON.parse(item);
  var item = item;

  var CorNome = "";
  if(localStorage.getItem("EmailCliente"+c_pathname) == item.c_email) {
    var CorNome = "#feb7b1";
  } else {
    var CorNome = "#b1f4fe";
  }

  return <div id={item._id} key={index}>
    <span> <b style={{color: CorNome}}>{item.c_nome}</b> <i>{HoraMsg(item.c_data)}</i> </span>
    <Linkify properties={{target: '_blank'}}> {item.msg} </Linkify>
  </div>

}


















const onSubmitPergunta = async (data, e) => {

  // console.log(data.c_msg);
  if(data.c_msg == "" || data.c_msg == undefined){
    AlertForm('O campo PERGUNTA é de preenchimento obrigatório!');
    setLoading(false);
    e.preventDefault();
  }


  if(data.c_msg !== "" && data.c_msg !== undefined){

    
    chat.emit('EnviaPergunta', {
      id_tb_evento: localStorage.getItem("id_tb_evento"+c_pathname),
      c_ingresso: localStorage.getItem("IdIngresso"+c_pathname),
      c_nome: localStorage.getItem("NomeCliente"+c_pathname),
      c_email: localStorage.getItem("EmailCliente"+c_pathname),
      c_pergunta: data.c_msg,
      id_sympla: IdEvento,
      c_nome_evento: NomeEvento
    });

    AlertForm('Mensagem enviada com sucesso!');
    // console.log(data.c_msg);
    setValue("c_msg", '');

  }
  

};





function VideoVimeo(IdVimeo){
  return <>
    <iframe
      src={"https://player.vimeo.com/video/"+ IdVimeo +"?autoplay=0"}
      title={NomeEvento}
      frameBorder="0"
      webkitallowfullscreen="true"
      mozallowfullscreen="true"
      allowFullScreen
      allow="accelerometer; fullscreen; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      id="FrameVideo"
    />
  </>;  
}



function TrocaIdioma(IdiomaEscolhido){

  if(PlayerEscolhido == 0) { // VIMEO
    if(IdiomaEscolhido == 1) { // PORTUGUÊS
      document.getElementById('FrameVideo').src = "https://player.vimeo.com/video/"+ IdVimeo +"?autoplay=1";
    } else {
      document.getElementById('FrameVideo').src = "https://player.vimeo.com/video/"+ IdVimeoEng +"?autoplay=1";
    }
  }

  if(PlayerEscolhido == 1) { // WOWZA
    if(IdiomaEscolhido == 1) { // PORTUGUÊS
      document.getElementById('FrameVideo').src = "https://livespace.com.br/player_wowza.php?id="+IdWowza;
    } else {
      document.getElementById('FrameVideo').src = "https://livespace.com.br/player_wowza.php?id="+IdWowzaEng;
    }
  }

  if(PlayerEscolhido == 2) { // YOUTUBE
    if(IdiomaEscolhido == 1) { // PORTUGUÊS
      document.getElementById('FrameVideo').src = "https://www.youtube.com/embed/"+IdYouTube+"?autoplay=1";
    } else {
      document.getElementById('FrameVideo').src = "https://www.youtube.com/embed/"+IdYouTubeEng+"?autoplay=1";
    }
  }

  if(PlayerEscolhido == 3) { // DACAST
    if(IdiomaEscolhido == 1) { // PORTUGUÊS
      document.getElementById('FrameVideo').src = "https://iframe.dacast.com/live/"+IdDacast+"?autoplay=1";
    } else {
      document.getElementById('FrameVideo').src = "https://iframe.dacast.com/live/"+IdDacastEng+"?autoplay=1";
    }
  }
  
}



function PlayerVideo(TipoPlayer){
  if( TipoPlayer == 0 ) {
    return <>
      <iframe
        src={"https://player.vimeo.com/video/"+ IdVimeo +"?autoplay=1"}
        id="FrameVideo"
        title={NomeEvento}
        frameBorder="0"
        webkitallowfullscreen="true"
        mozallowfullscreen="true"
        allowFullScreen
        allow="accelerometer; fullscreen; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      />
    </>; 
  }
  if( TipoPlayer == 1 ) {
    return <>
      <iframe src={"https://livespace.com.br/player_wowza.php?id="+IdWowza}
      id="FrameVideo"
      title={NomeEvento}
      scrolling="no"
      frameborder="0"
      allow="autoplay; encrypted-media"
      webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
    </>; 
  }
  if( TipoPlayer == 2 ) {
    return <>
    <iframe
      src={"https://www.youtube.com/embed/"+IdYouTube+"?autoplay=1"}
      id="FrameVideo"
      title={NomeEvento}
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
    />
    </>; 
  }
  if( TipoPlayer == 3 ) {
    return <>
    <iframe
      src={"https://iframe.dacast.com/live/"+IdDacast+"?autoplay=1"}
      id="FrameVideo"
      title={NomeEvento}
      frameborder="0"
      allow="autoplay; allowfullscreen webkitallowfullscreen mozallowfullscreen oallowfullscreen msallowfullscreen"
      allowfullscreen
    />
    </>; 
  }

}


// function TrocaVimeo(ID){
//   document.getElementById('FrameVideo').src = "https://player.vimeo.com/video/"+ ID +"?autoplay=1";
// }




function StyleCSS() {
  const BgMobile = 'body, header \ {\ background-image: url("'+localStorage.getItem("BgImgEventoMob"+c_pathname)+'");\ }\ ';
  return <style>
    body, header { "\ {\ background-image: url("+localStorage.getItem("BgImgEvento"+c_pathname)+");\ }\ " }
    .BotaoAcessarBD { "\ {\ color: "+BotaoCor+" !important; background-color: "+BotaoBg+"\ !important;}\ " }
    .BotaoSuporteBD { "\ {\ color: "+BotaoCor+" !important; background-color: "+BgForm+"\ !important;}\ " }
    .TextoEnviePergunta { "\ {\ color: "+BotaoCor+" !important;}\ " }
    .TextoSuporteIdiomas { "\ {\ color: "+CorTextoSuporte+" !important;}\ " }
    .TextoTopo { "\ {\ color: "+CorTextoTopo+" !important;}\ " }
    .TextoTopo i { "\ {\ border-color: "+CorTextoTopo+" !important;}\ " }
    .BordaChat { "\ {\ border-color: "+CorTextoTopo+" !important;}\ " }
    @media screen and (max-width: 1000px) { 
      "\ { " +BgMobile+ " \ } " 
    }
  </style>
}



function MostraPowered() {

  if(ChatAtivo == 2){
    return <>
            <span>
            <div className="PoweredByLab3" style={{margin: '5px 0 0 0'}}><a href="http://lab3.tv/" target="_blank"><img src={LogoLab3 == 0 ? LogoLab3Rodape : LogoLab3RodapePreto} /></a></div>
            </span>
           </>
  } 
         
}



function SuporteIdiomas(){

  if(PlayerThumb == 0){
    return <>                
    <div className="TextoSuporteIdiomas">
      <div>{ReactHtmlParser(TextoSuporte)}

      {MostraPowered()}

      </div>
      {
        Idiomas == 1 ?
        <div className="BtIdiomas">
          <a onClick={()=>TrocaIdioma(1)} className="BotaoAcessarBD">{TextoIdioma1}</a>
          <a onClick={()=>TrocaIdioma(2)} className="BotaoAcessarBD">{TextoIdioma2}</a>
        </div>
        : null
      }
    </div>
    </>;
  } else {
    return <>                
    <div className="TextoSuporteIdiomas">
      <div>{ReactHtmlParser(TextoSuporte)}

      {MostraPowered()}

    </div>
    </div>
    </>;
  }

}






useEffect(() => {
  socket.on('AtualizarPagina', function (data) {

    //console.log('Passou AtualizarPagina');
  
    let val = null;
    try {
      val = JSON.parse(data);
    } catch (e) {
      val = data;
    }
  
    //console.log( 'AtualizarPagina', data );
    //console.log( val.c_evento + " - " + localStorage.getItem("id_tb_evento"+c_pathname));

    if(localStorage.getItem("id_tb_evento"+c_pathname) == val.c_evento) {
      console.log("refresh");
      window.location.reload();
    }
    
  });
}, []);
















    return (
      <>

        {StyleCSS()}
        <CabecalhoPagina NomeEvento={NomeEvento} />

        <div className="BgLive">
          <div className="AreaPagina">

          {Loading === true ? <Carregando /> : null }

          <header>            
            <div className="AreaTopo">
              <div className="LogoPrincDentro"><img src={localStorage.getItem("LogoEvento"+c_pathname)} alt={NomeEvento} /></div>

              <div className="DivTextoTopo">
                <div className="TextoTopo">
                  <i></i>
                  <div className="NomeEvento">{ReactHtmlParser(NomeEvento)}</div>
                  <i></i>
                  <div className="TextoEvento">{ReactHtmlParser(TextoEvento)}</div>
                  <i></i>
                </div>
              </div>

              <div className="DivBtSair"><button className="BtLogout BotaoAcessarBD" onClick={()=>LogOut()}>SAIR</button></div>
            </div>
          </header>

          <div className="clear"></div>

          <div className="DivFlexDentro">


            <div className={ChatAtivo == 1 ? "VideoComChat" : "VideoSemChat"}>
              <div className="DivPlayerVideo">


                { PlayerThumb == 0 ?
                <div className="PlayerVideo">
                  <div className="embed-container">  { MostraVideo == 1 ? /*VideoVimeo(IdVimeo)*/ PlayerVideo(PlayerEscolhido) : null } </div>
                  {SuporteIdiomas()}
                </div>
                :
                <div className="PlayerVideo">
                  <div className="embed-container"> <img src={'https://livespace.com.br/upload/thumb/'+ThumbVideo} /> </div>
                  {SuporteIdiomas()}
                </div>
                }

              </div>
            </div>











            <div className="TextoTopo TextoMobile">   
                  <div className="NomeEvento">{ReactHtmlParser(NomeEvento)}</div>
                  <i></i>
                  <div className="TextoEvento">{ReactHtmlParser(TextoEvento)}</div>
            </div>


              {ChatAtivo !== 2 ?

                <div className="DivChatComentarios">
                <div className="BordaChat">






                  


                  
                  {ChatAtivo == 1 ?

                    <div className="ChatComentarios">
                      <div className="RolagemChat" id="RolagemChat" onScroll={handleScroll}>
                        {
                          chatMessages.length === 0 ?
                            /*<div className="Carregando" id="Carregando"></div>*/
                            <div></div>
                          :
                          chatMessages.slice(0).map((item, index) => ImprimeMsg(item, index) )
                        }
                        <span ref={messagesEndRef} ></span>
                      </div>

                      <div className="DivFormPergunta" /*style={{backgroundColor: BgForm}}*/>
                        <form onSubmit={handleSubmit(onSubmit)}>
                          <Controller
                            as={InputMask}
                            control={control}
                            ref={register}
                            id="c_msg"
                            name="c_msg"
                            type="text"
                            placeholder={'Mensagem/Message'}
                            className="CampoForm"
                            defaultValue={``}
                          />
                          <div className="clear"></div>
                          <button type="submit" className="BotaoAcessar BotaoAcessarBD">Enviar/Send</button>
                        </form>
                      </div>
                    </div>

                  : null }


                  {ChatAtivo == 0 ?

                    <div className="ChatComentarios">
                      <div className="DivFormPergunta" style={{backgroundColor: BgForm}}>

                        <div className="TextoEnviePergunta">{TextoPerguntas}</div>
                        <form onSubmit={handleSubmit(onSubmitPergunta)}>
                          <Controller
                            as={InputMask}
                            control={control}
                            ref={register}
                            id="c_nome"
                            name="c_nome"
                            type="text"
                            placeholder={'Faça sua pergunta aqui'}
                            className="CampoForm"
                            defaultValue={localStorage.getItem("NomeCliente"+c_pathname)}
                            readOnly
                          />

                          <Controller
                            as={InputMask}
                            control={control}
                            ref={register}
                            id="c_msg"
                            name="c_msg"
                            type="text"
                            placeholder={'Pergunta/Question'}
                            className="CampoForm"
                            defaultValue={``}
                          />
                          <div className="clear"></div>
                          <button type="submit" className="BotaoAcessar BotaoAcessarBD">Enviar/Send</button>
                        </form>
                      </div>
                    </div>

                  : null }

              </div>
              <div className="PoweredByLab3"><a href="http://lab3.tv/" target="_blank"><img src={LogoLab3 == 0 ? LogoLab3Rodape : LogoLab3RodapePreto} /></a></div>
              </div>

            : null }















          </div>


          </div>
        </div>


      </>
    );

}

export default Live;