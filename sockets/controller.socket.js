const TicketControl = require('../models/ticket-control');



const ticketControl = new TicketControl();



const socketController = (socket) => {

    //cuando un cliente se conecta quiero emitir estos eventos:
    socket.emit( 'ultimo-ticket', ticketControl.ultimo );
    socket.emit('atender-ultimos', ticketControl.ultimos4); //apenas se conecte quiero que se muestren mis ultimos 4 tickets
    
    socket.broadcast.emit('atender-pendientes', ticketControl.tickets.length); //muestro los tickets pendientes al conectarse un cliente
    

    socket.on('siguiente-ticket', (payload, callback) => {

        const siguiente = ticketControl.siguienteTicket();
        callback(siguiente);

        //notificar que hay un nuevo ticket pendiente de asignar (cuando se crea)
        socket.broadcast.emit('atender-pendientes', ticketControl.tickets.length);

    })


    socket.on( 'atender-ticket', ( payload, callback ) => {

        //Valido que venga el escritorio
        if(!payload.escritorio){
            return callback({
                ok: false,
                msg: 'El escritorio es obligatorio'
            })
        }

        //atendemos el ticket
        const ticket = ticketControl.atenderTicket( payload.escritorio );

        if(!ticket){
            return callback({
                ok:false,
                msg: 'No hay tickets pendientes'
            })
        } else {
            callback({
                ok: true,
                ticket
            })
        }

        //notifico en mi public.html los ultimos4
        socket.broadcast.emit('atender-ultimos', ticketControl.ultimos4);

        //lo agrego aca tambien porque tengo que disparar el evento del lado del server cuando asigno un nuevo ticket
        socket.emit('atender-pendientes', ticketControl.tickets.length);
        socket.broadcast.emit('atender-pendientes', ticketControl.tickets.length);


    })


}


module.exports = {
    socketController
}