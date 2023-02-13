
const TIMER = document.getElementsByClassName("current-timer") 
const QUOTE_LIST = document.querySelector(".quotes-ul")
const CURRENT_TIMER = document.querySelector(".current-timer")
const CURRENT_QUOTE = document.querySelector(".current_li")
const QUOTE_PASSED = document.querySelector(".quotes-passed")
const MODEL = document.querySelector(".model-box");
const TABLE_BODY = document.querySelector(".table tbody")
const NUM_OF_QUO = document.querySelector('.form-input')
const START = document.querySelector('.start')
let NUM = 0;

class Quote{
    
    constructor(quote, author, index){
        this.quote = quote;
        this.author = author
        this.input = "";
        this.timer = new Clock()
        this.status = "queued"
        this.result = "pending"
        this.index = index
    }

    getTime(){
        return this.timer.minute + ":" + this.timer.second + ":" + this.timer.millisecond
    }

    start(span){
        this.timer.trigger_clock(span)
        this.status = "running"
    }

    getInput(){
        this.input = document.querySelector(".current_li textarea").value
    }

    end(){
        this.timer.stop()
        this.status = "end"
        this.getInput()
        if (this.quote === this.input){
            this.result = 'correct'
        }else{
            this.result = 'incorrect'
        }
    }

    get_quote_box(){
        return `
        <div class="row quote-box ${this.result} p-2" style="width: 100%;">
            <div class="col-md-8 card quote-info">
                <div class="card-body quote mb-2">
                    <p class="card-text">${this.quote}</p>
                </div>
                <div class="card-body-text-area">
                    <textarea type="textarea" class="card-textarea card-body">${this.input}</textarea>
                </div>
            </div>
            <div class="card col-md-4 quote-info">
                <div class="card-body">
                    <p class="card-li">${this.index}</p>
                    <h6 class="card-status mb-2 text-muted">${this.status}</h6>
                    <h5 class="card-timer">${this.getTime()}</h5>
                    <h5 class="card-status">${this.result}</h5>
                </div>
            </div>
        </div>`
    }

    render(game){
        CURRENT_QUOTE.innerHTML = this.get_quote_box()
        
        CURRENT_QUOTE.querySelector('textarea').classList.add('current-textarea')
        CURRENT_QUOTE.querySelector('.card-timer').classList.add('current-timer')
                
        let span = document.querySelector(".current-timer")
        
        document.querySelector(".current-textarea").addEventListener("keypress", (e)=>{
            if(this.status === "running"){
                if(e.code === "Enter"){
                    this.end()
                    let li = document.createElement('li');
                    li.classList.add('passed_li')
                    li.innerHTML = this.get_quote_box();
                    li.querySelector('textarea').setAttribute('disabled', true)
                    QUOTE_PASSED.appendChild(li);
                    game.enter_quote();
                }
            }
            if(this.status === "queued"){
                this.start(span);
            }
        })
    }

    render_time(){
        CURRENT_TIMER.innerHTML = this.getTime()
    }
}


class Game{

    
    constructor(number_of_quotes=2){
        this.number_of_quotes = number_of_quotes
        this.selected_quotes = []
        this.curret_quote = -1
    }

    initialize_game(){
        let quote = randomArrayElements(this.number_of_quotes);
        this.selected_quotes = quote.map((index, ind) => new Quote(quotes[index]["text"], quotes[index]["author"], `${ind+1}/${this.number_of_quotes}`))
    }

    start_game(){
        this.curret_quote = 0;
        this.enter_quote();
    }

    enter_quote(){
        if(this.curret_quote >= this.number_of_quotes){
            this.end_game();
            return;
        }
        let quote = this.selected_quotes[this.curret_quote]
        quote.render(this)
        this.curret_quote++;
    }

    get_result(correct, cumulative_time, avg_time){
        let old_result = localStorage.getItem('result');
        if(old_result == null){
            old_result = [];
        }else{
            old_result = JSON.parse(old_result)
        }
        let result = {
            index: old_result.length,
            correct,
            cumulative_time, 
            avg_time,
            number_of_quotes: this.number_of_quotes,
        }

        let content = "";   
        let updated_result = [result, ...old_result];
        // console.log(updated_result)
        updated_result.sort((a, b)=>{
            if((a.correct/a.number_of_quotes) > (b.correct/b.number_of_quotes)){
                return -1;
            }else if((a.correct/a.number_of_quotes) == (b.correct/b.number_of_quotes)){
                let time_a = new Clock(a.cumulative_time.hour, a.cumulative_time.minute, a.cumulative_time.second, a.cumulative_time.millisecond)
                let time_b = new Clock(b.cumulative_time.hour, b.cumulative_time.minute, b.cumulative_time.second, b.cumulative_time.millisecond)
                if(time_a.getTime() < time_b.getTime()){
                    return -1;
                }else{
                    return 0;
                }
            }
        })
        // console.log(updated_result)
        for(let i=0; i<updated_result.length; i++){
            content += `
            <tr class="${updated_result[i].index === old_result.length ? 'table-active' : 'table'}">
            <th scopr="row">${i}</th>  
            <td>${updated_result[i].correct}/${updated_result[i].number_of_quotes}</td>
            <td>${updated_result[i].avg_time.minute}:${updated_result[i].avg_time.second}:${updated_result[i].avg_time.millisecond}</td>
            <td>${updated_result[i].cumulative_time.minute}:${updated_result[i].cumulative_time.second}:${updated_result[i].cumulative_time.millisecond}</td>
            </tr>
            `
        }
        TABLE_BODY.innerHTML = content;
        MODEL.classList.add('show-result');
        localStorage.setItem('result', JSON.stringify(updated_result));
    }

    
    end_game(){
        CURRENT_QUOTE.innerHTML = '';
        let cumulative_time = new Clock();
        let correct = 0;
        for(let i=0; i<this.selected_quotes.length; i++){
            cumulative_time.addClock(this.selected_quotes[i].timer)
            if(this.selected_quotes[i].result === 'correct'){
                correct++;
            }
        }
        let avg_time = new Clock(cumulative_time.hour, cumulative_time.minute, cumulative_time.second, cumulative_time.millisecond);
        avg_time.divide(this.number_of_quotes)
        this.get_result(correct, cumulative_time, avg_time)
    }
}

const game = new Game()
game.initialize_game()
game.start_game()

function firstTouchHandler(){
    console.log("hello")
}

function closeModel(){
    MODEL.classList.remove('show-result')
}

START.addEventListener('click', (e)=>{
    let number_of_quotes = NUM_OF_QUO.value;
    QUOTE_PASSED.innerHTML = ''
    const game = new Game(number_of_quotes)
    game.initialize_game()
    game.start_game()
})