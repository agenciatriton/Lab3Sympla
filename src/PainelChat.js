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

import Carregando from './Componentes/Carregando';
import CabecalhoPagina from "./Componentes/Cabecalho";

import { URLsocket, socket, chat, c_pathname } from "./Componentes/Config";
import { AlertForm, maskLoginSympla, MostrarIngresso, hexToRgbA } from "./Componentes/Funcoes";


//const c_pathname = document.location.pathname.substr(1).toLowerCase().split("/")[0];



const messagesEndRef = React.createRef();

var url_string = window.location.href;
var url = new URL(url_string);

var id_tb_user1 = url.searchParams.get("id_tb_user1");
//let roomId = url.searchParams.get("roomId");
//let roomId = "600892294c803e0e144b52a2";
//let roomId = localStorage.getItem("id_tb_evento"+c_pathname);
//const chat = io("http://192.168.1.90:3030", { query: { roomId } });
//const chat = io("https://webaovivo.com.br:3030", { query: { roomId } });
//const chat = io("https://webaovivo.com.br:3020", {query: { roomId }, transports: [ 'websocket','polling'], forceNew: true});
//console.log('roomId', roomId);

function Live() {

  const { register, handleSubmit, errors, control, setValue } = useForm();
  //const c_pathname = document.location.pathname.substr(1).toLowerCase().split("/")[0];
  //alert(c_pathname);
  const history = useHistory();
  const location = useLocation();
  const [ Loading, setLoading ] = useState(true);

  const [ EstadoSocketIO, setEstadoSocketIO ] = useState(true);





  const [ Final, SetFinal ] = useState(true);
  const ref = useRef(Final);

  useEffect(() => {
    setTimeout(() => { ref.current = Final; }, 500);
    // console.log('passou' + Final);
  }, [Final]);

  const [chatMessages, set_chatMessages] = useState([
    /*{
      id_tb_user: 'teste',
      c_nome: 'Rafael',
      msg: 'Teste de msg'
    },*/
  ]);
  const [Testexxxyyy, setTestexxxyyy] = useState([
    {id: '111',teste: 'teste111',},
    {id: '222',teste: 'teste222',},
    {id: '333',teste: 'teste333',},
  ]);


  function DesceChat() {
    try {
      messagesEndRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'end'
      })
    } catch(err) {
      console.log(err)
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

    chat.on("chat message", msg => {

      set_chatMessages(chatMessages => [...chatMessages, msg])
      //console.log(msg);
      //console.log(chatMessages);

      setTimeout(() => {
        if(ref.current === true) {
          DesceChat();
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
        //console.log('passou 1000');
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




















  // client-side
  socket.on("connect", () => {
    console.log('connect', socket.id);
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





  const [ IdEvento, setIdEvento ] = useState("");
  const [ NomeEvento, setNomeEvento ] = useState("");
  const [ BgEvento, setBgEvento ] = useState("");
  const [ BgImgEvento, setBgImgEvento ] = useState(localStorage.getItem("BgImgEvento"+c_pathname));
  const [ LogoEvento, setLogoEvento ] = useState(localStorage.getItem("LogoEvento"+c_pathname));
  const [ IdVimeo, setIdVimeo ] = useState("");
  const [ MostraVideo, setMostraVideo ] = useState(0);
  const [ BotaoCor, setBotaoCor ] = useState("");
  const [ BotaoBg, setBotaoBg ] = useState("");
  const [ BgForm, setBgForm ] = useState("");

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
      console.log('PegaDadosEvento: ', jsonResult);
      setNomeEvento(val1.c_nome);
      setIdEvento(val1.id_sympla);
      setIdVimeo(val1.c_vimeo);
      //setBgImgEvento("https://webaovivo.com.br/sympla/upload/bg/" + val1.c_bg_img);
      //setLogoEvento("https://webaovivo.com.br/sympla/upload/logo/" + val1.c_logo);

      localStorage.setItem("BgImgEvento"+c_pathname, "https://livespace.com.br/upload/bg/" + val1.c_bg_img);
      localStorage.setItem("LogoEvento"+c_pathname, "https://livespace.com.br/upload/logo/" + val1.c_logo);
      setMostraVideo(1);
      setBotaoCor(hexToRgbA(val1.c_botao_cor, 0.85));
      setBotaoBg(val1.c_botao_bg);
      setBgForm(hexToRgbA(val1.c_form_bg, 0.85));

    }

  }

  useEffect(() => { PegaDadosEvento(); }, []);













  function StyleCSS() {
    return <style>
      body, header { "\ {\ background-image: url("+BgImgEvento+");\ }\ " }
      .BotaoAcessarBD { "\ {\ color: "+BotaoCor+" !important; background-color: "+BotaoBg+"\ !important;}\ " }
    </style>
  }










  async function PegaChat() {
    //console.log('Passou PegaChat');
    const response = await fetch(URLsocket+'/PegaChat/'+ url.searchParams.get("roomId"), {
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
      id_tb_evento: url.searchParams.get("roomId"),
      c_ingresso: '0000-00-0000',
      c_nome: 'Administrador',
      c_email: 'adm@adm.com',
      msg: data.c_msg,
      id_sympla: IdEvento
    });

    setValue("c_msg", '');
    DesceChat();

  }

};











const ExcluirMsg = (IdMsgDel) => {
    chat.emit('chat message', {
        action:'Excluir',
        IdMsgDel:IdMsgDel
    });
    document.getElementById(IdMsgDel).style.display = 'none';
}





function ImprimeMsg(item, index) {

  //var item = JSON.parse(item);
  var item = item;
  //console.log(item);

  var CorNome = "";
  if(id_tb_user1 == item._id) {
    var CorNome = "#FFFFFF";
  } else {
    var CorNome = "#FFFFFF";
  }

  return <>

    <div id={item._id} key={index} style={{color: CorNome}}>

      <p>
        <Linkify properties={{target: '_blank'}}> {item.msg} </Linkify>
        <span><b>{item.c_nome}</b> <i>{HoraMsg(item.c_data)}</i></span>
      </p>


      <button className="BotaoExcluir" onClick={()=>ExcluirMsg(item._id)}>EXCLUIR</button> 
    </div>
    
  </>

}






















    return (
      <>

        {/*StyleCSS()*/}
        <CabecalhoPagina NomeEvento={NomeEvento} />


          {Loading === true ? <Carregando /> : null }




                <div className="RolagemChat RolagemChatPainel" id="RolagemChat" onScroll={handleScroll} style={{ height: 'calc(100vh - 192px)'}}>
                  {
                  //  chatMessages.length === 0 ?
                  //    <div className="Carregando" id="Carregando"></div>
                  //  :
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
                    <button type="submit" className="BotaoAcessar BotaoEnviarMsgPainel">ENVIAR MENSAGEM</button>
                  </form>
                </div>








      </>
    );

}

export default Live;