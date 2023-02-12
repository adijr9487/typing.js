class Clock{


    constructor(hour=0, minute=0, second=0, millisecond=0){
        this.hour = hour;
        this.minute = minute;
        this.second = second;
        this.millisecond = millisecond
        this.span = ""
        this.timer = ""
    }

    divide(n){
        let time_in_ms = this.millisecond + this.second*1000 + this.minute*60*1000 + this.hour*60*60*1000;
        time_in_ms /= n;
        console.log(time_in_ms)
        this.hour = Math.floor(time_in_ms / (60*60*1000));
        time_in_ms %= 60*60*1000;
        this.minute = Math.floor(time_in_ms / (60*1000));
        time_in_ms %= 60*1000;
        this.second = Math.floor(time_in_ms / 1000);
        time_in_ms %= 1000;
        this.millisecond = time_in_ms;
    }

    addClock(clock){
        this.millisecond += clock.millisecond;

        if(this.millisecond > 999){
            this.millisecond %= 1000;
            this.second++;
        }

        this.second += clock.second;
        
        if(this.second > 59){
            this.second %= 60;
            this.minute++;
        }

        this.minute += clock.minute

        if(this.minutes > 59){
            this.minute %= 60;
            this.hour++;
        }

        this.hour += clock.hour
    }

    trigger_clock(span){
        console.log(span)
        console.log(this.millisecond)
        this.span = span
        this.timer = setInterval(()=>this.start(), 10)
    }

    start(){
        this.millisecond += 10;

        if(this.millisecond >= 999){
            this.millisecond = 0;
            this.second += 1;   
        }

        if(this.second >= 59){
            this.second = 0;
            this.minute += 1;
        }

        if(this.minute >= 59){
            this.minute = 0;
            this.hour += 1;
        }
        this.span.innerText = this.minute + ":" + this.second + ":" + this.millisecond;
    }

    stop(){
        if(this.timer){
            clearInterval(this.timer)
        }else{
            console.log("Timer is not running")
        }
    }


}