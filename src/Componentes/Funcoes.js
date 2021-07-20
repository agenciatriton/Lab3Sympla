import React , { /*useState, useEffect, useRef*/ } from 'react';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import ImgIngresso from "../images/ingresso.jpg";
import ReactHtmlParser from 'react-html-parser';

function DataEventoInicio(data) {

    // 2020-12-31 13:30:00
    var dia = data.substr(8, 2);
    var mes = data.substr(5, 2);
    var ano = data.substr(0, 4);
    var hora = data.substr(11, 5);

    return `${dia}/${mes}/${ano} - Inicío: ${hora}`;
}

const AlertForm = (TextoAlert) => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className='AlertaJs'>
            {/*<h1>ATENÇÃO</h1>*/}
            <p>{TextoAlert}</p>
            <button className="BotaoAcessarBD" onClick={() => { onClose(); }}>OK</button>
          </div>
        );
      },
      closeOnEscape: false,
      closeOnClickOutside: false,
    });
}

function RemoveEspacos(value) {
  return value.replace(' ', '');
}

function maskLoginSympla(value) {
return value
    //.replace(/^(\d\d)(\d)/g,"($1) $2")
    //.replace('a','x')
}

const MostrarIngresso = () => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className='MostraIngresso'>
            <div className="TextoIngresso">Verifique se você recebeu um e-mail do site Sympla com o seu número do ingresso:</div>
            <img src={ImgIngresso} className="ImgIngresso" />
            <div className="TextoIngresso">Copie este número do ingresso e insira no campo para ter acesso ao evento.</div>
            <button className="BtIngresso" onClick={() => { onClose(); }}>OK, entendi.</button>
            <div className="ProblemaIngresso">Se tiver algum problema com o acesso, entre em contato com o nosso suporte.</div>
          </div>
        );
      },
      closeOnEscape: false,
      closeOnClickOutside: false,
    });
}

const MostrarTextoEvento = (TextoEvento) => {
  confirmAlert({
    customUI: ({ onClose }) => {
      return (
        <div className='MostraIngresso'>
          <div className="TextoIngresso">{ReactHtmlParser(TextoEvento)}</div>
          <button className="BtIngresso" onClick={() => { onClose(); }}>OK</button>
        </div>
      );
    },
    closeOnEscape: false,
    closeOnClickOutside: false,
  });
}

function hexToRgbA(hex, alpha){
  var c;
  if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
      c= hex.substring(1).split('');
      if(c.length== 3){
          c= [c[0], c[0], c[1], c[1], c[2], c[2]];
      }
      c= '0x'+c.join('');
      return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+','+alpha+')';
  }
  //throw new Error('Bad Hex');
}

export {
  DataEventoInicio,
  AlertForm,
  MostrarIngresso,
  RemoveEspacos,
  maskLoginSympla,
  hexToRgbA,
  MostrarTextoEvento,
  ReactHtmlParser
};