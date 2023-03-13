const cors = require('cors');
const express = require('express');

const { socketController } = require('../sockets/controller.socket');


class Server{

    constructor(){

        this.app    = express();
        this.port   = process.env.PORT;
        //websockets
        this.server = require('http').createServer(this.app);
        this.io     = require('socket.io')(this.server);

        this.paths = {}

        //Middlewares
        this.middlewares();

        //Rutas de mi app
        this.routes();

        //Sockets
        this.sockets();

    }

    middlewares(){
       
        //CORS
        this.app.use(cors());

        //Directorio publico
        this.app.use( express.static('public') );

    }

    routes(){

        //this.app.use( this.paths.auth, require('../routes/auth'));
    }

    sockets(){
        this.io.on("connection", socketController );
    }

    listen(){

        //le paso el server de mi propiedad de Server. NO el de express
        this.server.listen(this.port, () => {
            console.log(`Example app listening at http://localhost:${this.port}`);
        })
    }


}


module.exports = Server;