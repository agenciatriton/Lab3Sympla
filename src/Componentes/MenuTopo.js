import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom'

function MenuTopo(props) {

  return (
      <>
        <nav className="MenuTopo" style={{position: "absolute", right: 0}}>
          {props.NomeItem == "Home" ? <Link to="/" className="MenuAtivo"> Home </Link> : <Link to="/"> Home </Link> }
          {props.NomeItem == "Sobre" ? <Link to="/sobre" className="MenuAtivo"> Sobre </Link> : <Link to="/sobre"> Sobre </Link>}
          {props.NomeItem == "Live" ? <Link to="/live" className="MenuAtivo"> Live </Link> : <Link to="/live"> Live </Link>}
          {props.NomeItem == "Login" ? <Link to="/login" className="MenuAtivo"> Login </Link> : <Link to="/login"> Login </Link> }
          {props.NomeItem == "Cadastro" ? <Link to="/cadastro" className="MenuAtivo"> Cadastro </Link> : <Link to="/cadastro"> Cadastro </Link> }
          {props.NomeItem == "Chat" ? <Link to="/chat" className="MenuAtivo"> Chat </Link> : <Link to="/chat"> Chat </Link> }
        </nav>
      </>
  );
  
}

export default MenuTopo;