 const socket = io('https://stream301.herokuapp.com/');
 //const socket = io('http://localhost:3000');
$('#div-chat').hide();


let customConfig;
$.ajax({
    url: "https://service.xirsys.com/ice",
    data: {
      ident: "hieuminh",
      secret: "2824d926-dd49-11ea-91c9-0242ac150003",
      domain: "hieuminh0609.github.io",
      application: "default",
      room: "default",
      secure: 1
    },
    success: function (data, status) {
      // data.d is where the iceServers object lives
      customConfig = data.d;
      console.log(customConfig);
    },
    async: false
  });


socket.on('DANH_SACH_ONLINE',users =>{
    $('#div-chat').show();
    $('#div-dang-ky').hide();
   var userss = users;
    users.forEach(user => {
        const {ten ,peerId} = user;
        $('#listUser').append(`<li id="${peerId}">${ten}</li>`)
        showAll(users,user)
    });

    socket.on('CO_NGUOI_MOI',user =>{
        const {ten ,peerId} = user;
        $('#listUser').append(`<li id="${peerId}">${ten}</li>`);
        showAll(userss,user);
    })
  
    socket.on('AI_DO_NGAT_KET_NOI',id =>{
        console.log(id);
        console.log(`#${id}`);
        $(`#${id}`).remove();
        $(`#remote${id}`).remove();
     })
});

socket.on('DANG_KY_THAT_BAI',() =>{
    alert('fail!')
})

function showAll(users,user){
   
    if(users.length!==1){
        $('.removeStreamPerson').append('<video style="margin-right:10px" class="col-md-4" id="remote'+user.peerId+'" width="300" controls></video>')
        console.log(user.peerId)
        console.log(users[0].peerId)
        openStream()
        .then(stream => {
            playStream('localStream',stream);
            const call = peer.call(users[0].peerId,stream);
            call.on('stream',remoteStream => playStream("remote"+user.peerId,remoteStream));

            peer.on('call',call => {
                openStream()
                .then(stream => {
                    call.answer(stream);
                    playStream('localStream',stream);
                    call.on('stream',remoteStream => playStream("remote"+user.peerId,remoteStream));
                })
            })
        });
    }
    else{
        peer.on('call',call => {
            openStream()
            .then(stream => {
                call.answer(stream);
                playStream('localStream',stream);
               // call.on('stream',remoteStream => playStream("remote"+user.peerId,remoteStream));
            })
        })
    }
   
}


function openStream(){
    const config = {audio:true,video:true};

    return navigator.mediaDevices.getUserMedia(config);
}

function playStream(idVideoTag,stream){
    const video = document.getElementById(idVideoTag);
    video.srcObject = stream;
    video.play();
}


// openStream()
// .then(stream => playStream('localStream',stream))

//const peer = new Peer();
//const peer = new Peer({key:'peerjs',host:'sream-3005.herokuapp.com',secure:true,port:443});
const peer = new Peer({host:'sream-3005.herokuapp.com',secure:true,port:443,config:customConfig});
peer.on('open',id=>{
    $('#my-peer').append(id)
    $('#btnSignUp').click(() =>{
        const username = $('#txtUsername').val();
        socket.emit('NGUOI_DUNG_DANG_KY',{ten:username,peerId:id});
    })
});

$('#btnCall').click(()=>{
    const id = $('#remoteId').val();
    openStream()
    .then(stream => {
        playStream('localStream',stream);
        const call = peer.call(id,stream);
        call.on('stream',remoteStream => playStream('remoteStream',remoteStream));
    });
})

// peer.on('call',call => {
//     openStream()
//     .then(stream => {
//         call.answer(stream);
//         playStream('localStream',stream);
//         call.on('stream',remoteStream => playStream('remoteStream',remoteStream));
//     })
// })

