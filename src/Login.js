import React , { useState, useEffect, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Redirect, useHistory } from 'react-router-dom';
import InputMask from 'react-input-mask';

import './fontes/roboto/stylesheet.css';
import './Estilos.css';

import LogoLab3Rodape from "./images/logo_lab3_branco.png";
import LogoLab3RodapePreto from "./images/logo_lab3_preto.png";
import Carregando from './Componentes/Carregando';
import {URLsocket, socket, c_pathname} from "./Componentes/Config";
import { AlertForm, maskLoginSympla, MostrarIngresso, hexToRgbA } from "./Componentes/Funcoes";
import CabecalhoPagina from "./Componentes/Cabecalho";

function Login() {

  // alert(c_pathname);
  const history = useHistory();
  const [ Loading, setLoading ] = useState(true);
  const { register, handleSubmit, errors, control, setValue } = useForm();

  const [ IdEvento, setIdEvento ] = useState("");
  const [ TokenSympla, setTokenSympla ] = useState("");
  const [ NomeEvento, setNomeEvento ] = useState("");
  const [ BgImgEvento, setBgImgEvento ] = useState(localStorage.getItem("BgImgEvento"+c_pathname));
  const [ LogoEvento, setLogoEvento ] = useState(localStorage.getItem("LogoEvento"+c_pathname));
  const [ TextoEvento1, setTextoEvento1 ] = useState("");
  const [ TextoEvento2, setTextoEvento2 ] = useState("");
  const [ BgForm, setBgForm ] = useState("");
  const [ CorTexto, setCorTexto ] = useState("");
  const [ BotaoCor, setBotaoCor ] = useState("");
  const [ BotaoBg, setBotaoBg ] = useState("");
  const [ LogoLab3, setLogoLab3 ] = useState("");
  const [ IpClient, SetIpClient ] = useState("");
  //const [ ValorLogin, setValorLogin ] = useState("RS2Q-Q8-269H");
  const [ ValorLogin, setValorLogin ] = useState("");


  useEffect(() => {
    fetch(`https://webaovivo.com.br/PegaIP/`).then(res => res.json()).then(json => SetIpClient(json.IPv4));
    PegaDadosEvento();
  }, []);

  async function PegaDadosEvento() {
    
    setLoading(true);
    
    const response = await fetch(URLsocket + '/PegaDadosEvento/' + c_pathname, { method: 'GET', headers: {'Content-Type': 'application/json'} });
    const jsonResult = await response.json();

    if(jsonResult !== null) {

      setLoading(false);
      const val1 = jsonResult[0];
      const val2 = jsonResult[1].data;
      console.log('PegaDadosEvento: ', jsonResult);
      setNomeEvento(val1.c_nome);
      setIdEvento(val1.id_sympla);
      setTokenSympla(val1.token_sympla);

      localStorage.setItem("BgImgEvento"+c_pathname, "https://livespace.com.br/upload/bg/" + val1.c_bg_img);
      localStorage.setItem("BgImgEventoMob"+c_pathname, "https://livespace.com.br/upload/bg_mob/" + val1.c_bg_img_mob);
      localStorage.setItem("LogoEvento"+c_pathname, "https://livespace.com.br/upload/logo/" + val1.c_logo);

      setTextoEvento1(val1.c_texto1);
      setTextoEvento2(val1.c_texto2);
      setBgForm(hexToRgbA(val1.c_form_bg, 0.85));
      setCorTexto(val1.c_texto_cor);
      setBotaoCor(hexToRgbA(val1.c_botao_cor, 0.85));
      setBotaoBg(val1.c_botao_bg);
      setLogoLab3(val1.c_logo_lab3);

    } else {

      console.log('PegaDadosEvento: ', 'xxxxxy');
      setLoading(false);
      history.push('/');
      
    }

  }










  const onSubmit = async (data, e) => {
    // e.preventDefault();
    // console.log(data);
    // console.log(data.c_login);
    // console.log(data.c_senha);
    // console.log(data.c_login);
    // alert(errors);
    // alert(JSON.stringify(data));

    // sending to all clients except sender
    
    
    if(data.c_login == "" || data.c_login == undefined){
      AlertForm('O campo NÚMERO DO INGRESSO é de preenchimento obrigatório!');
      setLoading(false);
      e.preventDefault();
    }

    if(data.c_login !== "" && data.c_login !== undefined){

      setLoading(true);

      const response = await fetch(URLsocket + '/Login/' + IdEvento, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          c_login: data.c_login.toUpperCase(),
          c_ip: IpClient,
          c_token_sympla: TokenSympla,
        }),
      });

      const jsonResult = await response.json();

      console.log(jsonResult);
      console.log(jsonResult.auth);

      //if(jsonResult !== null){
      if(jsonResult.auth == true){

          // socket.emit('VerificaOutros', {
          //   IdIngresso: jsonResult.IdIngresso,
          //   LogadoToken: jsonResult.token
          // });

          VerificaOutros(jsonResult.IdIngresso, jsonResult.token);

          console.log(jsonResult.token);
        
          var val = jsonResult[0];
          setTimeout(() => {

            localStorage.setItem("LogadoSymplaLab3"+c_pathname, 1);
            localStorage.setItem("IdIngresso"+c_pathname, jsonResult.IdIngresso);
            localStorage.setItem("IdEvento"+c_pathname, IdEvento);
            localStorage.setItem("id_tb_evento"+c_pathname, jsonResult.id_tb_evento);
            localStorage.setItem("LogadoToken"+c_pathname, jsonResult.token);
            localStorage.setItem("NomeCliente"+c_pathname, jsonResult.DadosIngresso.first_name+' '+jsonResult.DadosIngresso.last_name);
            localStorage.setItem("EmailCliente"+c_pathname, jsonResult.DadosIngresso.email);
            SetVerifica("SIM");


            history.push({
              pathname: 'live',
              state: {}
            });

            //document.location = 'live';

            setLoading(false);
          }, 1500);

      } else {
        
          AlertForm('Número do ingresso inválido!');
          setLoading(false);
        
      }

    }

  };




  const [ Verifica, SetVerifica ] = useState("NÃO");
  /*
  async function VerificaLogado() {

    socket.on('VerificaLogado', function (data) {
        const VerificaLogado = JSON.parse(data);
        console.log(
          'Aqui',
          VerificaLogado.c_ingresso,
          VerificaLogado.c_evento
        );
    });

  }

  useEffect(() => { VerificaLogado(); }, []);
  */







  let ListaConfig = JSON.stringify({
    c_ingresso: localStorage.getItem("IdIngresso"+c_pathname),
    c_evento: localStorage.getItem("IdEvento"+c_pathname),
    c_token: localStorage.getItem("LogadoToken"+c_pathname)
  });
  
  async function VerificaOutros(ListaConfig) {
    socket.emit('VerificaOutros', ListaConfig);
  }


    



  const [ MostraIngresso, SetMostraIngresso ] = useState(false);

  const NaoSeiIngresso = () => {
    if(MostraIngresso === false){
      SetMostraIngresso(true);
    } else {
      SetMostraIngresso(false);
    }
  }



  



  function StyleCSS() {
    const BgMobile = 'body, header \ {\ background-image: url("'+localStorage.getItem("BgImgEventoMob"+c_pathname)+'");\ }\ ';
    return <style>
    body { "\  {\ background-image: url("+localStorage.getItem("BgImgEvento"+c_pathname)+");\ }\ " }
    .BotaoAcessarBD { "\ {\ color: "+BotaoCor+" !important; background-color: "+BotaoBg+"\ !important;}\ " }
    .NaoSeiIngresso { "\ {\ color: "+CorTexto+" !important; border-color: "+BotaoBg+"\ !important;}\ " }
    @media screen and (max-width: 1000px) { 
      "\ { " +BgMobile+ " \ } " 
    }
    </style>
  }


  return (
    <>


      {StyleCSS()}

      <CabecalhoPagina NomeEvento={NomeEvento} />

      <div className="BgLive">
      {Loading === true ? <Carregando /> : null}

      <div className="DivFlex">

          <div className="LogoPrinc"><img src={localStorage.getItem("LogoEvento"+c_pathname)} /></div>

          <div className="DivLogin">


              <div className="DivLoginDentro TextoDestaque" style={{backgroundColor: BgForm, color: CorTexto}}> {TextoEvento1} <div>{TextoEvento2}</div></div>

              <div className="DivLoginDentro" style={{backgroundColor: BgForm}}>

                  {
                  /*
                  <div onClick={()=>VerificaOutros(ListaConfig)}>VerificaOutros</div>
                  { Verifica }
                  { localStorage.getItem("LogadoSymplaLab3") } {"\n"}
                  { Testezz } {"\n"}
                  { localStorage.getItem("LogadoToken") } {"\n"}
                  { window.localStorage.getItem("LogadoToken") } {"\n"}
                  */
                  }

                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="TextoUtilizeIngresso" style={{color: CorTexto}}>Utilize o código do seu ingresso para entrar no evento:</div>
                    <Controller
                      as={InputMask}
                      control={control}
                      mask="****-**-****"
                      ref={register}
                      id="c_login"
                      name="c_login"
                      type="text"
                      placeholder={'Número do Ingresso'}
                      className="CampoForm CampoFormLogin"
                      defaultValue={ValorLogin}
                    />
                    <div className="clear"></div>
                    <button type="submit" className="BotaoAcessar BotaoAcessarBD">Entrar no Evento</button>
                    <div onClick={()=>MostrarIngresso()} className="NaoSeiIngresso"> Não sei o número do meu ingresso. <span className="BotaoAcessarBD">?</span> </div>
                  </form>

              </div>
          </div>

      </div>

      <div className="PoweredByLab3Login"><a href="http://lab3.tv/" target="_blank"><img src={LogoLab3 == 0 ? LogoLab3Rodape : LogoLab3RodapePreto} /></a></div>
      
      


      </div>
    </>    
  );
}

export default Login;
