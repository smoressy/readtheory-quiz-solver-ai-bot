chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete" && tab.url.includes("readtheory.com")) {
        chrome.scripting.executeScript({
            target: { tabId: tabId },
            function: myCode
        });
    }
});

function myCode() {
    javascript:(async function(){
      if(window.location.href === "https://readtheory.com/app/student/quiz/results"){
        window.location.href = "https://readtheory.com/app/student/quiz";
        return;
      }
      if(window.location.href !== "https://readtheory.com/app/student/quiz") return;
      async function fetchQuizContent(){
        let question = document.querySelector('.student-quiz-page__question')?.innerText || "Question not found";
        let answers = {};
        let answerElements = document.querySelectorAll('.student-quiz-page__answer');
        answerElements.forEach(el => {
          let option = el.querySelector('.answer-card__alpha')?.innerText.trim();
          let answerText = el.querySelector('.answer-card__body')?.innerText.trim();
          if(option && answerText) answers[option] = answerText;
        });
        let submitButton = document.querySelector('.student-quiz-page__question-buttons .primary-button');
        let correctAnswer = await getAIAnswer(question, answers);
        if(correctAnswer){
          selectAnswer(correctAnswer);
          setTimeout(() => { submitButton?.click(); }, 500);
        }
      }
      async function getAIAnswer(question, answers){
        let keys = [
    "YOUR_GEMINI_KEY_1"
        // if you get RATELIMIT (VERY COMMON!!!!!) its a good idea to add more........
          ];
        let prompt = `The following is a multiple-choice question. Select the correct answer:\n\nQuestion: ${question}\n`;
        for(let key in answers) prompt += `${key}: ${answers[key]}\n`;
        prompt += "Respond with only the letter corresponding to the correct answer in JSON format: ```json\n{\\\"answer\\\": \\\"A\\\"}\n```";
        let payload = {contents:[{parts:[{text:prompt}]}]};
        for(let i=0;i<keys.length;i++){
          let API_KEY = keys[i];
          let API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
          try{
            let response = await fetch(API_URL, {method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(payload)});
            if(!response.ok) continue;
            let data = await response.json();
            let aiResponseText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
            let jsonMatch = aiResponseText.match(/```json\n(.*?)\n```/s);
            if(jsonMatch && jsonMatch[1]){
              let parsedJson = JSON.parse(jsonMatch[1]);
              return parsedJson.answer;
            }
          }catch(e){
            continue;
          }
        }
        return null;
      }
      function selectAnswer(answerChoice){
        let choiceElement = Array.from(document.querySelectorAll('.student-quiz-page__answer')).find(el => {
          return el.querySelector('.answer-card__alpha')?.innerText.trim() === answerChoice;
        });
        if(choiceElement) choiceElement.click();
      }
      function createGUI(){
        const existingGUI = document.getElementById('quizBotGUI');
        if(existingGUI) existingGUI.remove();
        let gui = document.createElement("div");
        gui.id = "quizBotGUI";
        gui.innerHTML = `
          <div id="titleBar">
            <div class="title-content">
              <div class="logo-container">
                <svg class="bot-icon" viewBox="0 0 24 24" width="20" height="20">
                  <path fill="currentColor" d="M12,2A2,2 0 0,1 14,4C14,4.74 13.6,5.39 13,5.73V7H14A7,7 0 0,1 21,14H22A1,1 0 0,1 23,15V18A1,1 0 0,1 22,19H21V20A2,2 0 0,1 19,22H5A2,2 0 0,1 3,20V19H2A1,1 0 0,1 1,18V15A1,1 0 0,1 2,14H3A7,7 0 0,1 10,7H11V5.73C10.4,5.39 10,4.74 10,4A2,2 0 0,1 12,2M7.5,13A2.5,2.5 0 0,0 5,15.5A2.5,2.5 0 0,0 7.5,18A2,2 0 0,0 10,15.5A2.5,2.5 0 0,0 7.5,13M16.5,13A2.5,2.5 0 0,0 14,15.5A2,2 0 0,0 16.5,18A2,2 0 0,0 19,15.5A2.5,2.5 0 0,0 16.5,13Z" />
                </svg>
                <span>Quiz Assistant</span>
              </div>
              <span id="closeBtn">×</span>
            </div>
          </div>
          <div id="content">
            <button id="answerBtn">
              <span class="button-content">
                <svg class="answer-icon" viewBox="0 0 24 24" width="16" height="16">
                  <path fill="currentColor" d="M9,7H13A2,2 0 0,1 15,9V11A2,2 0 0,1 13,13H11V15H15V17H9V13A2,2 0 0,1 11,11H13V9H9V7M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4Z" />
                </svg>
                Answer Question
              </span>
            </button>
            <button id="submitAndNextBtn">
              <span class="button-content">
                <svg class="submit-icon" viewBox="0 0 24 24" width="16" height="16">
                  <path fill="currentColor" d="M5,13H19V11H5V13Z" />
                </svg>
                Submit And Next
              </span>
            </button>
          </div>
        `;
        let guiStyle = document.createElement("style");
        guiStyle.innerHTML = `
          #quizBotGUI {
            position: fixed;
            top: 50px;
            left: 50px;
            width: 280px;
            background: #2E2E2E;
            color: #E0E0E0;
            border-radius: 12px;
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.5);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            user-select: none;
            backdrop-filter: blur(10px);
            border: 1px solid #444;
            z-index: 99999;
            transition: all 0.3s ease;
          }
          #quizBotGUI:hover {
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.7);
          }
          #titleBar {
            background: #1A1A1A;
            color: #E0E0E0;
            padding: 12px 16px;
            font-size: 15px;
            cursor: grab;
            border-top-left-radius: 12px;
            border-top-right-radius: 12px;
            z-index: 99999;
          }
          .title-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .logo-container {
            display: flex;
            align-items: center;
            gap: 8px;
            font-weight: 500;
          }
          .bot-icon {
            animation: pulse 2s infinite;
          }
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
          }
          #closeBtn {
            cursor: pointer;
            font-size: 24px;
            line-height: 1;
            padding: 0 4px;
            transition: opacity 0.2s ease;
          }
          #closeBtn:hover {
            opacity: 0.8;
          }
          #content {
            padding: 20px;
            display: flex;
            flex-direction: column;
            gap: 16px;
          }
          button {
            width: 100%;
            padding: 12px;
            background: #3A3A3A;
            color: #E0E0E0;
            border: none;
            cursor: pointer;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
            transition: all 0.2s ease;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          button:hover {
            background: #4A4A4A;
            transform: translateY(-1px);
          }
          button:active {
            transform: translateY(0);
          }
          .button-content {
            display: flex;
            align-items: center;
            gap: 8px;
          }
          #quizBotGUI.dragging {
            transition: none;
            cursor: grabbing;
          }
          #titleBar.dragging {
            cursor: grabbing;
          }
        `;
        document.head.appendChild(guiStyle);
        document.body.appendChild(gui);
        let offsetX, offsetY, dragging = false;
        let titleBar = document.getElementById("titleBar");
        titleBar.addEventListener("mousedown", e => {
          dragging = true;
          offsetX = e.clientX - gui.offsetLeft;
          offsetY = e.clientY - gui.offsetTop;
          gui.classList.add('dragging');
          titleBar.classList.add('dragging');
        });
        document.addEventListener("mousemove", e => {
          if(dragging){
            gui.style.left = e.clientX - offsetX + "px";
            gui.style.top = e.clientY - offsetY + "px";
          }
        });
        document.addEventListener("mouseup", () => {
          dragging = false;
          gui.classList.remove('dragging');
          titleBar.classList.remove('dragging');
        });
        document.getElementById("closeBtn").addEventListener("click", () => {
          gui.style.opacity = "0";
          gui.style.transform = "scale(0.95)";
          setTimeout(() => gui.remove(), 300);
        });
        document.getElementById("answerBtn").addEventListener("click", () => {
          fetchQuizContent();
        });
        document.getElementById("submitAndNextBtn").addEventListener("click", () => {
          for(let i=0;i<50;i++){
            setTimeout(() => {
              document.querySelector('.student-quiz-page__question-buttons .primary-button')?.click();
              document.querySelector('.student-quiz-page__question-next')?.click();
            }, i*50);
          }
        });
        document.addEventListener("keydown", e => {
          if(e.key === "z"){
            document.getElementById("answerBtn")?.click();
          }
          if(e.key === "x"){
            document.getElementById("submitAndNextBtn")?.click();
          }
        });
      }
      (function(){
        const existingGUI = document.getElementById('quizBotGUI');
        if(existingGUI) existingGUI.remove();
        createGUI();
      })();
      setInterval(() => {
        let continueBtn = document.querySelector('div.primary-button.quiz-result-modal__continue.quiz-tab-item');
        if(continueBtn) continueBtn.click();
      },500);
      (async function autoLoop(){
        while(true){
          setTimeout(() => {
            fetchQuizContent();
          },500);
          setTimeout(() => {
            for(let i=0;i<50;i++){
              setTimeout(() => {
                document.querySelector('.student-quiz-page__question-buttons .primary-button')?.click();
                document.querySelector('.student-quiz-page__question-next')?.click();
              }, i*50);
            }
          },2500);
          await new Promise(r=>setTimeout(r,3000));
        }
      })();
    })();
  }
