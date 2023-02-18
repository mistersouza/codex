import bot from './assets/bot.svg'; 
import user from './assets/user.svg';

const form = document.querySelector('form');
const chat  = document.querySelector('#chat-container');

let loadInterval; // will be used to store the interval

const loader = (element) => {
  element.textContent = ''; 

  loadInterval = setInterval(() => {
    element.textContent += '.';

    if (element.textContent.length === 4) {
      element.textContent = '';
    }; 
  }, 300);
}; 

const typeText = (element, text) => {
  let index = 0

    let interval = setInterval(() => {
        if (index < text.length) {
            element.innerHTML += text.charAt(index)
            index++
        } else {
            clearInterval(interval)
        }
    }, 20)
};

const generateId = () => {
  const timestamp = new Date().getTime();
  const random = Math.random(); 
  const hexString = random.toString(16); 

  return `id-${timestamp}-${hexString}`; 
};

const chatStripe = (isAi, value, id) => {
  return (
    `<div class="wrapper ${isAi && 'ai'}">
            <div class="chat">
                <div class="profile">
                    <img 
                      src=${isAi ? bot : user} 
                      alt="${isAi ? 'bot' : 'user'}" 
                    />
                </div>
                <div class="message" id=${id}>${value}</div>
            </div>
        </div>`);
};


const handleSubmit = async (event) => {
  event.preventDefault();

  const data = new FormData(form);

  // User's message
  chat.innerHTML += chatStripe(false, data.get('prompt'));

  form.reset();

  // Bot's response
  const id = generateId();

  chat.innerHTML += chatStripe(true, ' ', id);

  chat.scrollTop = chat.scrollHeight;

  const textBox = document.getElementById(id)

  loader(textBox);

  const response = await fetch('http://localhost:5000', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
      },
      body: JSON.stringify({ prompt: data.get('prompt') })
  });

  clearInterval(loadInterval);
  textBox.textContent = '';

  if (!response.ok) {
    const error = await response.text()
    alert(error); 
    textBox.textContent = 'Something went wrong. Please try again.';
  } else {
    const { bot } = await response.json(); 
    const text = bot.trim(); 
    typeText(textBox, text);
  }

};

form.addEventListener('submit', handleSubmit);

form.addEventListener('keyup', (event) => {
  if (event.key === 'Enter') {
    handleSubmit(event);
  }
});