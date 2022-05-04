var Peer = window.SimplePeer;
var socket = io('/screenshare');

var initiateBtn = document.getElementById('initiateBtn');
var stopBtn = document.getElementById('stopBtn');
var initiator = false;

const stunServerConfig = {
  iceServers: [{
      "urls": [
        "turn:13.250.13.83:3478?transport=udp"
      ],
      "username": "YzYNCouZM1mhqhmseWk6",
      "credential": "YzYNCouZM1mhqhmseWk6"
    }]
};

const room = $('#classId').val();
const sender = $('#sender').val();

const params = {
  room: room,
  sender: sender
}

initiateBtn.onclick = (e) => {
  $('#main').addClass('hidden');
  initiator = true;
  console.log("Bheja" + params);
  socket.emit('initiate', params);
}

stopBtn.onclick = (e) => {
  $('#main').removeClass('hidden');
  socket.emit('initiate', params);
}

socket.on('connect', () => {
  socket.emit('join', params);
});

//UsersList TODO
socket.on('usersList', function(users){
  var ol = $('<ol></ol>');

  console.log(users);

  for(var i = 0; i < users.length; i++){
      ol.append('<p>'+'<i class="fa fa-circle online" aria-hidden="true"></i> '+ users[i]+'</p>');
  }

  $('#numValue').text('('+users.length+')');
  $('#users').html(ol);
});


socket.on('initiate', () => {
  $('#main').addClass('hidden');
  startStream();
  initiateBtn.style.display = 'none';
  stopBtn.style.display = 'block';
})

function startStream () {
  if (initiator) {
    // get screen stream
    navigator.mediaDevices.getUserMedia({
      video: {
        mediaSource: "screen",
        width: { max: '2300' },
        height: { max: '640' },
        frameRate: { max: '10' }
      },
      audio: true
    }).then(gotMedia);
  } else {
    gotMedia(null);
  }
}

function gotMedia (stream) {
  if (initiator) {
    var peer = new Peer({
      initiator,
      stream,
      config: stunServerConfig
    });
  } else {
    var peer = new Peer({
      config: stunServerConfig
    });
  }

  peer.on('signal', function (data) {
    $('#main').addClass('hidden');
    socket.emit('offer', { 
      streamData: JSON.stringify(data),
      sender: sender,
      room: room
    });
  });

  socket.on('offer', (data) => {
    peer.signal(JSON.parse(data));
  })

  peer.on('stream', function (stream) {
    // got remote video stream, now let's show it in a video tag
    var video = document.querySelector('video');
    video.srcObject = stream;
    video.play();
  })
}