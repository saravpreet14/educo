module.exports = function(io, Users){
    const nio = io.of('/groupchat');
    const users = new Users();

    nio.on('connection', (socket) => {

        socket.on('join', (params, callback) => {
            socket.join(params.room);

            users.AddUserData(socket.id, params.name, params.room);

            nio.to(params.room).emit('usersList', users.GetUsersList(params.room));

            callback();
        });

        socket.on('createMessage', (message, callback) => {
            nio.to(message.room).emit('newMessage', {
                text: message.text,
                room: message.room,
                from: message.sender,
                image: message.userPic
            });

            callback();
        });

        socket.on('disconnect', () => {
            var user = users.RemoveUser(socket.id);

            if(user){
                nio.to(user.room).emit('usersList', users.GetUsersList(user.room));
            }
        })
    });
}













