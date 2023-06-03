//References HTML

const txtUid = document.querySelector('#txtUid');
const txtMsg = document.querySelector('#txtMsg');
const ulUsers = document.querySelector('#ulUsers');
const ulMsg = document.querySelector('#ulMsg');
const btnExit = document.querySelector('#btnExit');


let user = null;
let socket = null;

//Validar token de localstorage
const validateJWT = async() => {
    const token = localStorage.getItem('token') || '';
    if(token.length <= 10) {
        window.location = 'index.html';
        throw new Error('There is not token in server');
    }

    const resp = await fetch('http://localhost:8080/api/auth', {
        headers: { 'x-token': token }
    });
    const { user: userDb, token: tokenDB } = await resp.json();
    localStorage.setItem('token', tokenDB);
    user = userDb;
    document.title = user.name;

    await connectSocket();

}

const connectSocket = async() => {
    
    socket = io({
        'extraHeaders': {
            'x-token': localStorage.getItem('token')
        }
    });

    socket.on('connect', () => {
        console.log('socket online');
    })

    socket.on('disconnect', () => {
        console.log('socket offline');
    })

    socket.on('get-messages', drawMessages);

    socket.on('users-active', drawUSers);

    socket.on('private-message', (payload) => {
        console.log('privado', payload);
    })
}

const drawUSers = ( users = [] ) => {
    let usersHTML = '';
    users.forEach( ({ name, uid }) => {
        usersHTML += `
            <li>
                <p>
                    <h5 class="text-success">${ name }</h5>
                    <span class="fs-6 text-muted">${ uid }</span>
                </p>
            </li>
        `;
    });

    ulUsers.innerHTML = usersHTML;
}

const drawMessages = ( messages = [] ) => {
    let messagesHTML = '';
    messages.forEach( ({ name, message }) => {
        messagesHTML += `
            <li>
                <p>
                    <span class="text-primary">${ name }</span>
                    <span>${ message }</span>
                </p>
            </li>
        `;
    });

    ulMsg.innerHTML = messagesHTML;
}

txtMsg.addEventListener('keyup', ({ keyCode }) => {
    const msg = txtMsg.value;
    const uid = txtUid.value;
    if(keyCode !== 13) return;
    if(msg.length === 0) return;

    socket.emit('send-message', { msg, uid });
    txtMsg.value = '';
})

const main = async() => {
    await validateJWT();
}

main();
