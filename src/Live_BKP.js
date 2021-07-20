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
    console.log('connect', socket.id);
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
  const [ IdVimeo, setIdVimeo ] = useState("");
  const [ IdVimeoEng, setIdVimeoEng ] = useState("");
  const [ MostraVideo, setMostraVideo ] = useState(0);
  const [ BotaoCor, setBotaoCor ] = useState("");
  const [ BotaoBg, setBotaoBg ] = useState("");
  const [ BgForm, setBgForm ] = useState("");
  const [ TextoEvento, setTextoEvento ] = useState("");
  const [ TextoSuporte, setTextoSuporte ] = useState("");
  const [ LogoLab3, setLogoLab3 ] = useState("");
  const [ ChatAtivo, setChatAtivo ] = useState("");
  const [ PlayerThumb, setPlayerThumb ] = useState("");
  const [ ThumbVideo, setThumbVideo ] = useState("");
  const [ Idiomas, setIdiomas ] = useState("");

  async function PegaDadosEvento() {
    
    setLoading(true);
    //const c_pathname = document.location.pathname.substr(1).toLowerCase().split("/")[0];

    // alert(c_pathname);
    const response = await fetch(URLsocket+'/PegaDadosEvento/' + c_pathname, { method: 'GET', headers: {'Content-Type': 'application/json'} });
    const jsonResult = await response.json();

    if(jsonResult !== null) {

      setLoading(false);
      const val1 = jsonResult[0];
      const val2 = jsonResult[1].data;
      // console.log('PegaDadosEvento: ', jsonResult);
      setNomeEvento(val1.c_nome);
      setIdEvento(val1.id_sympla);
      setIdVimeo(val1.c_vimeo);
      setIdVimeoEng(val1.c_vimeo_eng);
      setTextoEvento(val1.c_texto_evento);
      setTextoSuporte(val1.c_texto_suporte);
      //setBgImgEvento("https://webaovivo.com.br/sympla/upload/bg/" + val1.c_bg_img);
      //setLogoEvento("https://webaovivo.com.br/sympla/upload/logo/" + val1.c_logo);

      localStorage.setItem("BgImgEvento"+c_pathname, "https://livespace.com.br/upload/bg/" + val1.c_bg_img);
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

  

  function StyleCSS() {
    return <style>
      body, header { "\ {\ background-image: url("+localStorage.getItem("BgImgEvento"+c_pathname)+");\ }\ " }
      .BotaoAcessarBD { "\ {\ color: "+BotaoCor+" !important; background-color: "+BotaoBg+"\ !important;}\ " }
      .BotaoSuporteBD { "\ {\ color: "+BotaoCor+" !important; background-color: "+BgForm+"\ !important;}\ " }
    </style>
  }





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
    

    console.log(data.c_msg);

    setValue("c_msg", '');

  }

};





function VideoVimeo(IdVimeo){
  console.log("xasdf", IdVimeo);
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


function TrocaVimeo(ID){
  document.getElementById('FrameVideo').src = "https://player.vimeo.com/video/"+ ID +"?autoplay=1";
}



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
              {ReactHtmlParser(NomeEvento)}
              {ReactHtmlParser(TextoEvento)}
              <div><button className="BtLogout BotaoAcessarBD" onClick={()=>LogOut()}>SAIR</button></div>
            </div>
          </header>

          <div className="clear"></div>

          <div className="DivFlexDentro">


            <div className={ChatAtivo == 1 ? "VideoComChat" : "VideoSemChat"}>
              <div className="DivPlayerVideo">

                { PlayerThumb == 0 ?
                <div className="PlayerVideo">
                  <div className="embed-container"> { MostraVideo == 1 ? VideoVimeo(IdVimeo) : null } </div>
                  
                  {
                  Idiomas == 1 ?
                    <div className="BtIdiomas">
                     <a onClick={()=>TrocaVimeo(IdVimeo)} className="BotaoAcessarBD">PORTUGUÊS</a>
                     <a onClick={()=>TrocaVimeo(IdVimeoEng)} className="BotaoAcessarBD">ENGLISH</a>
                    </div>
                  : null
                  }
                  
                  {ReactHtmlParser(TextoSuporte)}
                  

                </div>
                :
                <div className="PlayerVideo">
                  <div className="embed-container"> <img src={'https://livespace.com.br/upload/thumb/'+ThumbVideo} /> </div>
                </div>
                }


                <div className="PoweredByLab3"><a href="http://lab3.tv/" target="_blank"><img src={LogoLab3 == 0 ? LogoLab3Rodape : LogoLab3RodapePreto} /></a></div>


              </div>
            </div>


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

                <div className="DivFormPergunta" style={{backgroundColor: BgForm}}>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <Controller
                      as={InputMask}
                      control={control}
                      ref={register}
                      id="c_msg"
                      name="c_msg"
                      type="text"
                      placeholder={'Faça seu comentário aqui'}
                      className="CampoForm"
                      defaultValue={``}
                    />
                    <div className="clear"></div>
                    <button type="submit" className="BotaoAcessar BotaoAcessarBD">ENVIAR MENSAGEM</button>
                  </form>
                </div>

                <div className="DivFormPergunta" style={{backgroundColor: hexToRgbA(BotaoBg, 0.5)}}>
                  <div className="BotoesSuporte">
                    <button onClick={()=>MostrarTextoEvento(TextoEvento)} className="BotaoAcessar BotaoSuporteBD">SOBRE O EVENTO</button>
                    <button onClick={()=>MostrarTextoEvento(TextoSuporte)} className="BotaoAcessar BotaoSuporteBD">SUPORTE</button>
                  </div>
                </div>

              </div>

              : 
              
              
              
              
              <div className="ChatComentarios">

                
                <div className="DivFormPergunta" style={{backgroundColor: BgForm}}>

                  <div>Envie-nos a sua pergunta e vamos responder ao vivo.</div>
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
                      placeholder={'Faça sua pergunta aqui'}
                      className="CampoForm"
                      defaultValue={``}
                    />
                    <div className="clear"></div>
                    <button type="submit" className="BotaoAcessar BotaoAcessarBD">ENVIAR PERGUNTA</button>
                  </form>
                </div>

              </div>
              
              
              
              }


          </div>


          </div>
        </div>


      </>
    );

}

export default Live;