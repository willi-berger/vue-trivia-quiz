/**
 * open trivia game 
 */

var app = new Vue({
    el: "#app",

    data: {
        message: "Open Trivia Quiz",
        hasError: false,
        errorMessage: "",
        showLoader: true,
        categoryId: 0,
        level: "",
        categories: [],
        difficulty: "easy",
        difficulties: [
            {id:"easy", name:"Easy"},
            {id:"medium", name:"Medium"},
            {id:"hard", name:"Hard"},
        ],
        currentQuestion: 0,
        questions: [],
        categoryId: 0,
        category: "",
        question: '',
        answers: [],
        answerGiven: false,
        showCheck: false,
        showTimes: false,
        resultMessage: "",
    },

    created: function () {
        // initialize game
        console.log("vue created ...")
        setTimeout(() => {
            this.fetchCategories();
        }, 900);
    
    },
    
    computed: {
        isDisabledNext: function() {
            return !this.answerGiven;
        }
    },
    
    methods: {
        
        startGameClicked: function () {
            
        },
        
        fetchCategories: function () {
            //const url = "https://opentdb.com/api_category.php";
            const url = "./categories.json";  // mock
            
            fetch(url)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                this.categories = data['trivia_categories'];
                this.categoryId =  this.categories[0].id;
                
                // also fetch the initial questions
                this.fetchQuestions();
                this.showLoader = false;
            })
            .catch(error => {
                console.log('error ' + error)
                this.hasError = true;
                this.errorMessage = "Cannot fetch categories: " + error;
                this.showLoader = false;
            });            
            
        },
        
        fetchQuestions:  function() {
            console.debug('fetch questions')
            const URL_QUESTION = "https://opentdb.com/api.php"
            //const URL_QUESTION = "./questions.json"
            
            // ToDo for category and difficulty and consider max count
            this.questionsCount = 5;
            console.log(`going to fetch ${this.questionsCount} questions with difficulty ${this.difficulty} for category ${this.categoryId}`)
            let url = URL_QUESTION + `?amount=${this.questionsCount}&category=${this.categoryId}&difficulty=${this.difficulty}&type=multiple`;
            
            fetch(url)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                if (data['response_code'] !== 0) {
                    throw "unexpected response code: " + data['response_code']
                }                
                this.questions = data['results'];
                this.showCurrentQuestionAndAnswers();
                this.showLoader = false;
            })
            .catch(error => {
                console.log('error ' + error)
                this.hasError = true;
                this.errorMessage = "Cannot fetch questions: " + error;
                this.showLoader = false;
            });            
            
            
        },
        
        showCurrentQuestionAndAnswers: function () {
            let q = this.questions[this.currentQuestion];
            this.category = q['category'];
            this.question = q['question'];
            // answers ...  
            this.answers = []
            let correctSet = false;
            let iWrong = 0;
            for (i = 0; i < 4; i++) {
                if (!correctSet) {
                    if (Math.floor(Math.random()*4) == i || i == 3) {
                        this.answers.push(q['correct_answer'])
                        correctSet = true;
                    } else {
                        this.answers.push(q['incorrect_answers'][iWrong++])
                    }
                } else {
                    this.answers.push(q['incorrect_answers'][iWrong++])
                }
            }            
        },
        
        checkAnswer: function (event) {
            console.log(event.target.textContent)
            this.answerGiven = true;
            let correctAnswer = this.questions[this.currentQuestion]['correct_answer'];
            let givenAnswer = event.target.textContent;
            if (givenAnswer == correctAnswer) {
                this.showCheck = true;
                this.resultMessage = `Yes, '${correctAnswer}' is the correct answer`;
            } else {
                this.showTimes  = true;
                this.resultMessage = `No '${givenAnswer}' is wrong, the correct answer is '${correctAnswer}'`;
            }
        },
        
        nextQuestionClicked: function () {
            this.showLoader   = true;
            this.showCheck = false;
            this.showTimes =false;
            this.answerGiven = false;
            this.resultMessage = "";

            setTimeout(() => {
                if (this.questions.length - 1 > this.currentQuestion) {
                    this.currentQuestion++;
                    this.showCurrentQuestionAndAnswers();
                } else {
                    alert('No more questions')
                }
                this.showLoader = false;
            },  900);
        },
        
        isHighlighted: function (i) {
            console.log('id highlighted ' + i);
            return true;
        }
        
    }
});
