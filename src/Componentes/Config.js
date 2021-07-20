import { useEffect, useState } from "react";
import io from "socket.io-client";

const c_pathname = document.location.pathname.substr(1).toLowerCase().split("/")[0];
var url_string = window.location.href;
var url = new URL(url_string);

const socket = io("https://livespace.com.br:3020", {transports: [ 'websocket','polling'], forceNew: true});
const URLsocket = 'https://livespace.com.br:3020';

if (localStorage.getItem("id_tb_evento"+c_pathname) !== null) {
    var roomId = localStorage.getItem("id_tb_evento"+c_pathname);
} else {
    var roomId = url.searchParams.get("roomId");
}

const chat = io("https://livespace.com.br:3030", { query: { roomId } });

export {
    socket,
    URLsocket,
    chat,
    c_pathname
};