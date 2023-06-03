import { Socket } from 'socket.io';
import { checkJWT } from '../helpers/index.js';
import { ChatMessages } from '../models/index.js';

const chatMessages = new ChatMessages();

export const socketController = async( socket = new Socket(), io ) => {

    const user = await checkJWT(socket.handshake.headers['x-token']);
    
    if(!user){
        return socket.disconnect();
    }

    //Connec to a special room
    //con esto todo los usuarios estas en una sala con el user.id
    socket.join( user.id ); // global, socket.id, user.id

    //Add connected user
    chatMessages.connectUser(user);
    io.emit('users-active', chatMessages.usersArr);
    socket.emit('get-messages', chatMessages.lastTenMessages);

    //Delete user when disconnect
    socket.on('disconnect', () => {
        chatMessages.disconnectUser(user.id);
        io.emit('users-active', chatMessages.usersArr);
    })

    socket.on('send-message', ({ uid, msg }) => {

        if(uid) {
            //Private message
            socket.to( uid ).emit('private-message', { from: user.name, msg })
        } else {
            //global
            chatMessages.sendMessage(user.id, user.name, msg);
            io.emit('get-messages', chatMessages.lastTenMessages);
        }

    })
}