import React, {} from 'react';
import {Helmet} from "react-helmet";

function CabecalhoPagina(props) {
  return (
    <Helmet>
        <meta charSet="utf-8" />
        <title>{props.NomeEvento}</title>
    </Helmet>  
  );
}

export default CabecalhoPagina;