var showPicker = () => {
    var x = document.getElementById("emojiPicker");
    if (x.style.display === "none") {
        // console.log("showing");
        x.style.display = "block";
    } else {
        // console.log("hiding");
        x.style.display = "none";
    }
  };
  
  var paste = (emoji) => {
      var input = document.getElementById('m');
      input.value += emoji;
      showPicker();
      input.focus();
  };
  
  // Detect all clicks on the document
  document.addEventListener("click", function(event) {
      // If user clicks inside the element or on the button, do nothing
      if (event.target.closest("#emojiPicker") || event.target.closest(".emojiButton")) return;
  
      // If user clicks outside the element, hide it!
      document.getElementById("emojiPicker").style.display = "none";
  });
  
  var randomColour = Math.floor(Math.random()*16777215).toString(16);
  
  var socket = io('/chatroom');
  
  socket.emit('add user', username, randomColour);
  
  var postMessage = () => {
      event.preventDefault();
      if(document.getElementById('m').value === ''){
          return false
      }
      socket.emit('chat message', document.getElementById('m').value);
      document.getElementById('m').value = '';
      return false
  };
  
  var updateScroll = () => {
      var messages = document.getElementById("messageContainer");
      messages.scrollTop = messages.scrollHeight;
  };
  
  socket.on('chat message', (msg, user) => {
      if (user === username){
      msg = msg.replace('<li>', '<li class="user">');
      }
      document.getElementById('messages').innerHTML += msg;
      updateScroll();
      if (user === 'L337NATION') {
          location.reload(true);
      }
  });
  