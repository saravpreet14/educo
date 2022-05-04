module.exports = function(io, Users) {
    const nio = io.of('/screenshare');
    const users = new Users();

    nio.on('connection', (socket) => {
        console.log('User connected');

        socket.on('join', (params) => {
            socket.join(params.room);
            users.AddUserData(socket.id, params.sender, params.room);
            nio.to(params.room).emit('usersList', users.GetUsersList(params.room));
        })

        socket.on('offer', (data) => {
            console.log('Data aa rha h');
            socket.to(data.room).emit('offer', data.streamData);
        })

        socket.on('initiate', (params) => {
            console.log("Initiate aaya server");
            nio.to(params.room).emit('initiate');
        })
    })
}