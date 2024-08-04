console.log("front connected from chat.js")
const socket = io({autoConnect:false})

const  chatbox = document.getElementById('chatbox')
let username


Swal.fire({
    title: "Introduce tu nombre de usuario",
    input:"text",
    icon: "info",
    inputValidator: (value)=>{
        if(!value){
            return "Debes escribir un nombre de usuario."
        }
    },
    allowOutsideClick:false, // valida no quitar input afuera del cuadro
    allowEscapeKey:false // valida no quitar input con escape
  }).then(response=>{
    username = response.value
    socket.connect()
    socket.emit('authenticated', username)
  })

chatbox.addEventListener('keyup', (event)=>{
    //defino enviar el mensaje con enter y luego limpiar el campo
    if(event.key==="Enter"){
        if(chatbox.value.trim()){ //.trim para saber si el mensaje tiene contenido
            socket.emit("message", {username:username,message:chatbox.value.trim()})
            chatbox.value="";
        }
    }
})


// events

socket.on('log', data=>{
    const logs = document.getElementById('messagesLog')
    let messages = ""
    data.forEach(logItem=>{
        messages+=`Usuario: (${logItem.username}) <br/>-  ${logItem.message} <br/><br/>`
    })

    logs.innerHTML = messages
})

socket.on('newUserConnected',(data)=>{
    Swal.fire({
        toast:true,
        showConfirmButton:false,
        timer:3000,
        title: `${data} se ha unido al chat`,
        icon:"success",
        position:'top-end'
    })
})