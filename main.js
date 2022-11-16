let countSpan = document.querySelector(".count span")
let quizArea  = document.querySelector(".quiz-area")
let answersArea = document.querySelector(".answers-area")
let submitBtn = document.querySelector(".submit-button")
let bulletsContainer = document.querySelector(".bullets .spans");
let countdown = document.querySelector(".bullets .countdown")
let results = document.querySelector(".results")


// base 
let currentIndex = 0;
let rightAnswers = 0;
let duration = 90;

// main function
function getQuestions() {

  let myReq = new XMLHttpRequest();

  myReq.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      let questionsObj = JSON.parse(this.responseText);
      let qcount = questionsObj.length;
      countSpan.innerHTML= qcount

      // create the bullets
      createBullets(qcount)

      // adding Q&A
      addData(questionsObj[currentIndex],qcount)

      // start countdown
      countDown(duration,qcount)

      // clicking on submit button
      submitBtn.onclick = () => {
        //decreasing the question count
        if(countSpan.innerHTML > 0){
          countSpan.innerHTML--
        }

        let theRightAnswer = questionsObj[currentIndex].right_answer;
        currentIndex++

        // check if the answer is right
        checkAnswers(theRightAnswer, qcount)

        // clearing q & a divs
        quizArea.innerHTML = ""
        answersArea.innerHTML = ""

        //adding the next q&a and updating bullets
        addData(questionsObj[currentIndex],qcount)
        updateBullets(qcount)

        // clear previeous interval
        clearInterval(countdownInterval)

        // start new countdown
        countDown(duration,qcount)

        // show results
        showResult(qcount)
      }

    }
  };
  myReq.open("GET", "html_questions.json", true);
  myReq.send();
}

getQuestions();



// ALL FUNCTIONS

function createBullets(qCount) {
  for (let i = 0; i < qCount; i++) {
    let bullet = document.createElement("span");
    if(i == 0){
      bullet.classList.add("on")
    }
    bulletsContainer.appendChild(bullet)
  }
}


function addData (obj, count){
  if( currentIndex < count){
    // build and add the question
  let Div = document.createElement("div")
  let question = document.createElement("h2")
  let questionText = document.createTextNode(obj.title)
  
  question.appendChild(questionText)
  Div.appendChild(question)
  quizArea.appendChild(Div)

  // build and add the answers
  for(let i = 1 ; i <= 4 ; i++){
    // main answers div
    let aDiv = document.createElement("div")
    aDiv.classList.add("answer")

    // radio input
    let radioInput = document.createElement("input")
    radioInput.type = "radio"
    radioInput.name = "question";
    radioInput.id= `answer_${i}`
    radioInput.dataset.answer = obj[`answer_${i}`];

    // check the first 
    if (i === 1) {
      radioInput.checked = true;
    }


    // label contains the answer for each radio
    let label = document.createElement("label")
    let labelText = document.createTextNode(obj[`answer_${i}`])
    label.htmlFor = `answer_${i}`
    

    aDiv.appendChild(radioInput)
    label.appendChild(labelText)
    aDiv.appendChild(label)
    answersArea.appendChild(aDiv)
  }
  }
}


function checkAnswers (rightAnswer , count) {
  if(currentIndex < count){
    let answers = document.getElementsByName("question");
    let theChosenAnswer;
    for(let i= 0 ; i< 4 ; i++){
      if (answers[i].checked) {
        theChosenAnswer = answers[i].dataset.answer
      }
    }
    if(theChosenAnswer == rightAnswer){
      rightAnswers++
    }
  }
}


function updateBullets(count) {
    if(currentIndex < count){
      let arrOfBullets = Array.from(bulletsContainer.children)
        arrOfBullets[currentIndex].classList.add("on")
    }
}


function countDown(duration,count) {
  if(currentIndex < count){
    let minutes, seconds;

    countdownInterval = setInterval(()=>{
      minutes = parseInt(duration / 60)
      seconds = parseInt(duration % 60)
      
      minutes = minutes < 10 ? `0${minutes}`: minutes
      seconds = seconds < 10 ? `0${seconds}`: seconds
      countdown.innerHTML = `${minutes}:${seconds}`

      --duration

      if(duration < 0){
        clearInterval(countdownInterval);
        submitBtn.click()
      }
    },1000)
  }
}


function showResult(count) {
    if(currentIndex === count){
    let resultsSpan = document.createElement("span")
    resultsSpan.innerHTML = `your score is ${rightAnswers} from ${count}`

    results.appendChild(resultsSpan)

    if(rightAnswers > count / 2 && rightAnswers < count){
      resultsSpan.classList.add("good")

    } else if(rightAnswers < count / 2 ){
      resultsSpan.classList.add("bad")
    } else {
      resultsSpan.classList.add("perfect")
    }
    submitBtn.remove()
    bulletsContainer.remove()
    countdown.remove()
  }
}


