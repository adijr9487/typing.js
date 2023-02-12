
const TIMER = document.getElementsByClassName("current-timer") 
const QUOTE_LIST = document.querySelector(".quotes-ul")
const CURRENT_TIMER = document.querySelector(".current-timer")
const CURRENT_QUOTE = document.querySelector(".current_li")
const QUOTE_PASSED = document.querySelector(".quotes-passed")

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
        this.number_of_quotes = number_of_quotes;
        this.selected_quotes = []
        this.curret_quote = -1;
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

    get_result(){

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
        
        console.log("Avg Time:", avg_time)
        console.log("Correct:", correct)
        console.log("Cumulative Time:", cumulative_time)
    }
}

const game = new Game()
game.initialize_game()
game.start_game()

function firstTouchHandler(){
    console.log("hello")
}