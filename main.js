 const socket = io('https://stream301.herokuapp.com/');

$('#div-chat').hide();
socket.on('DANH_SACH_ONLINE',users =>{
    $('#div-chat').show();
    $('#div-dang-ky').hide();
   
    users.forEach(user => {
        const {ten ,peerId} = user;
        $('#listUser').append(`<li id="${peerId}">${ten}</li>`)
    });

    socket.on('CO_NGUOI_MOI',user =>{
        const {ten ,peerId} = user;
        $('#listUser').append(`<li id="${peerId}">${ten}</li>`)
    })
 
    socket.on('AI_DO_NGAT_KET_NOI',id =>{
        console.log(id);
        console.log(`#${id}`);
        $(`#${id}`).remove();
     })
});

socket.on('DANG_KY_THAT_BAI',() =>{
    alert('fail!')
})



function openStream(){
    const config = {audio:false,video:true};

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
const peer = new Peer({key:'peerjs',host:'sream-3005.herokuapp.com',secure:true,port:443});
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

peer.on('call',call => {
    openStream()
    .then(stream => {
        call.answer(stream);
        playStream('localStream',stream);
        call.on('stream',remoteStream => playStream('remoteStream',remoteStream));
    })
})

