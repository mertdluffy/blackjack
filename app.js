const app =new Vue({
    el: '#app',
    data:{
        isGameRunning: false,
        isGameEnded: true,
        playerPoints: 0,
        dealerPoints: 0,
        playerHand: [],
        dealerHand:[],
        deck: [],
        middle_text:"Make Your Move",
        cardSwitch: [],
        playerMoney:24,
        playerBet:1,
    },
    beforeMount(){
        this.deck = this.generateCardPool();
        this.cardSwitch = new Array(52).fill(false);
    },
    methods:{
        clearAndStartNewGame(){
            this.quit();
            this.startNewGame();

        },
        startNewGame(){
            if (this.playerMoney-this.playerBet<0){
                this.middle_text = "You Do not Have any money. You can not play anymore."
                return
            }
            this.isGameRunning = true;
            for(let i=0;i<2;i++){
                this.playerHand.push(this.dealCard())
                this.dealerHand.push(this.dealCard())
            }
            this.playerPoints = this.checkHandValue(this.playerHand)
            this.dealerPoints = this.checkHandValue(this.dealerHand)

            this.playerMoney -=this.playerBet;
            this.isGameEnded = false;

        },
        generateCardPool(){
            //create the deck
            const colors = ['clubs','spades','hearts','diamonds'];
            const numbers = ["1","2","3","4","5","6","7","8","9","10","11","12","13"];
            const pool =[];

            colors.map(c => {
                numbers.map( n=>{
                    pool.push(n+'_of_'+c);
                })
            })
            return pool;
        },
        dealCard(){
            let index;
            do{
                index = Math.floor(Math.random()*52);
            }while(this.cardSwitch[index])
            const card = this.deck[index];
            this.cardSwitch[index] = true;
            return card;
        },
        checkHandValue(hand){
            let value = 0;
            let ones_counter =0;
            hand.map(h=> {
                let v = parseInt(h.split('_', 1)[0]);
                if (v >= 10)
                    v = 10;
                else if (v == 1 && value + 11 <= 21) {
                ones_counter +=1;
                v = 11;
                }
                value+=v;
            })
            while(ones_counter>0 && value>21){
                ones_counter-=1;
                value-=10;
            }
            return value;
        },
        quit(){

            this.playerPoints = 0;
            this.dealerPoints= 0;
            this.playerHand= [];
            this.dealerHand= [];
            this.isGameRunning =false;
        },
        hit() {
            this.playerHand.push(this.dealCard());
            this.playerPoints = this.checkHandValue(this.playerHand)
            if(this.playerPoints>21){
                this.isGameEnded = true;
                this.middle_text ="Game Over. You Busted";
            }
        },
        stand(){
            while (this.dealerPoints <17 ){
                this.dealerHand.push(this.dealCard());
                this.dealerPoints = this.checkHandValue(this.dealerHand)
            }
            if(this.dealerPoints >21){
                this.playerMoney += this.playerBet*2;
                this.middle_text = "Game Over, You Win";
            }
            else if(this.playerPoints > this.dealerPoints){
                this.playerMoney += this.playerBet*2;
                this.middle_text = "Game Over, You Win";
            }
            else if (this.dealerPoints > this.playerPoints){

                this.middle_text = "Game Over, You Lost";
            }
            else{
                this.playerMoney += this.playerBet;
                this.middle_text = "DRAW!!!";
            }
            this.isGameEnded = true;

        },
        getPath(card){
            return "./PNG/"+card+".png";
        },
        doubleDown() {
            if (this.playerMoney - this.playerBet * 2 >= 0) {
                this.playerMoney -= this.playerBet;
                this.playerBet *= 2;

                this.hit();
                if(!this.isGameEnded)
                    this.stand();
             }
        },
        increaseBet(){
            if(this.playerMoney -this.playerBet >0) {
                this.playerBet += 1;
            }
        },
        decreaseBet(){
            if(this.playerBet >1) {
                this.playerBet -= 1;
            }
        },

    }
})