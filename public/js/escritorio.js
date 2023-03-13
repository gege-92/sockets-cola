//Referencias del HTML
const lblEscritorio = document.querySelector('h1'); 
const btnAtender = document.querySelector('button');
const lblSmall = document.querySelector('small');
const divAlert = document.querySelector('.alert') 
const lblPendientes = document.querySelector('#lblPendientes')

//leer valores url 
const searchParams = new URLSearchParams( window.location.search )

if( !searchParams.has('escritorio') ){
    window.location('index.html');
    throw new Error('El escritorio es obligatorio');
}

const escritorio = searchParams.get('escritorio');
lblEscritorio.innerText = escritorio;

divAlert.style.display = 'none';

const socket = io();


socket.on('connect', () => {

    btnAtender.disabled = false;

});

socket.on('disconnect', () => {

    btnAtender.disabled = true;

});


socket.on('atender-pendientes', (ticketsPendientes) => {

    if( !ticketsPendientes ){

        lblPendientes.style.display = 'none';

    } else {

        lblPendientes.style.display = '';
        lblPendientes.innerText = ticketsPendientes;
    }

    
})


btnAtender.addEventListener( 'click', () => {

    socket.emit( 'atender-ticket', { escritorio }, ( respServer ) => {

        //respServer(callback): {ok, msg, ticket}
        console.log( respServer);

        if(!respServer.ok){

            lblSmall.innerText = 'Nadie'
            return divAlert.style.display = '';
        }
            
        lblSmall.innerText = 'Ticket: ' + respServer.ticket.numero;
        
        

    } )

});