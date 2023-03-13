const path = require('path');
const fs = require('fs');


class Ticket {

    constructor( numero, escritorio ){

        this.numero = numero;
        this.escritorio = escritorio;

    }

}


class TicketControl {

    constructor(){

        this.ultimo = 0;  //ultimo ticket
        this.hoy = new Date().getDate();
        this.tickets = []; //tickets pendientes
        this.ultimos4 = []; //ultimos 4 tickets para mostrar en la pantalla

        this.init();
    }

    get toJson(){
        
        return {
            ultimo : this.ultimo,
            hoy: this.hoy,
            tickets: this.tickets,
            ultimos4: this.ultimos4
        }

    }


    init(){

        const { ultimo, hoy, tickets, ultimos4 } = require('../db/data.json');  

        if( hoy === this.hoy ){

            this.ultimo = ultimo;
            this.tickets  = tickets;
            this.ultimos4 = ultimos4;

        } else {

            this.guardarDB();

        }

    }


    guardarDB(){

        const pathDB = path.join( __dirname, '../db/data.json' );
        fs.writeFileSync( pathDB, JSON.stringify( this.toJson ) );
    }


    siguienteTicket(){
        
        this.ultimo += 1;

        const ticket = new Ticket( this.ultimo, null );  //el null me indica que nadie esta atendiendo ese ticket
        this.tickets.push( ticket );

        this.guardarDB();
        return "Ticket: " + ticket.numero; 

    }


    atenderTicket( escritorio ){  //recibo el escritorio donde se va a atender el ticket

        //Primero verifico que hayan tickets
        if( this.tickets.length === 0){
            return null;
        }

        //Atiendo el primer ticket
        const ticket = this.tickets[0];
        this.tickets.shift();
        
        ticket.escritorio = escritorio;  //le asigno el escritorio a mi ticket

        //agrego el ticket a mis ultimos4 que se mostraran en la pantalla
        this.ultimos4.unshift( ticket );
        
        //Verificar que en mis ultimos4 siempre sean 4 tickets que son los que se van a mostrar en pantalla
        if( this.ultimos4.length > 4 ){
            this.ultimos4.splice(-1, 1);
        }

        this.guardarDB();

        return ticket;

    }

}




module.exports = TicketControl;