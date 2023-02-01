const wsUri = "wss://echo-ws-service.herokuapp.com";

  const textInput = document.querySelector(".text");
  const sendBtn = document.querySelector(".send");
  const geoBtn = document.querySelector(".geo");
  const chatWindow = document.querySelector(".chat");
  const infoOutput = document.querySelector(".system-info")


  const socket = new WebSocket(wsUri);
  //Сокеты
  socket.onopen = () => {
    infoOutput.innerText = "Соединение установлено";
  };
  socket.onmessage = (event) => {
	 if(socket.readyState == 3)
	 {
		writeToChat("Соединение с сервером закрыто, нет ответа", true);		 
		return;
	 }
	writeToChat(event.data, true);
  };
  socket.onerror = () => {
    infoOutput.innerText = "Произошла ошибка!";
  };
  socket.onclose = () => {
	infoOutput.innerText = "Чат закрылся";
  } 

  //функция,которая записывает текст в чат и добавляет стиль для полученного и отправленного сообщения
  function writeToChat(message, isRecieved) {
    let messageHTML = `<div class="${isRecieved ? "recieved" : "sent" }">
						  ${message}
					   </div>`;
    chatWindow.innerHTML += messageHTML;
  }


 function sendGeolocation() {
    if (!textInput.value) {
      infoOutput.innerText = "пустое сообщение";
      return;
    }
	
    socket.send(textInput.value);   
    //textInput.value === "";
  }

  //функция для отправки текста
  function sendMessage() {
    if (!textInput.value) {
      infoOutput.innerText = "пустое сообщение";
      return;
    }
    socket.send(textInput.value);
    writeToChat(textInput.value, false);
    //textInput.value === "";
  }

  //обработчик для кнопки отправки сообщения
  sendBtn.addEventListener("click", sendMessage);
  geoBtn.addEventListener("click", checkGeolocation);

  // Функция, выводящая текст об ошибке
  const error = () => {
    writeOutput("При получении местоположения произошла ошибка");
  };

  // Функция, срабатывающая при успешном получении геолокации
  const success = (position) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
			 //"https://www.openstreetmap.org/#map=18/" + latitude + "/" + longitude
    let link = `https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`;
    addLink(link);
  };
  
function addLink(link)
{
  let linkHTML = `<a href="${link}"> Гео-локация </a>`;
  writeToChat(linkHTML);
}

//функция для вставки ссылки в чат
function checkGeolocation(){
	
	
	if ("geolocation" in navigator) 
	{
		console.log("Нет доступа к геолокации")  
		navigator.geolocation.getCurrentPosition( (position) => 
		{
			const { coords } = position;
			success(position);
			console.log(coords.latitude, coords.longitude);
		  
		}, (error)=>{
			 writeToChat("Вы запретили просмотр вашей геолокации, включите его в настройках этой страницы в браузере");
			 console.log(error);
		});
	  
	  
	  
	} else {
	 console.log("Есть доступ к геолокации")
	}
}