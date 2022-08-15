const app =new Vue({
    el: '#app',
    data:{
        isGameRunning: false,
        playerPoints: 0,
        dealerPoints: 0,
        playerHand: [],
        dealerHand:[],
        deck: [],
        cardSwitch: []
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
            this.isGameRunning = true;
            for(let i=0;i<2;i++){
                this.playerHand.push(this.dealCard())
                this.dealerHand.push(this.dealCard())
            }
            this.playerPoints = this.checkHandValue(this.playerHand)
            this.dealerPoints = this.checkHandValue(this.dealerHand)

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
            hand.map(h=>{
                let v = parseInt(h.split('_',1)[0]);
                if (v >=10)
                    v=10;
                else if (v==1 && value+11<21)
                    v=11;
                value+=v;
            })
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
        },
        stand(){
            if (this.dealerPoints <17){
                this.dealerHand.push(this.dealCard());
                this.dealerPoints = this.checkHandValue(this.dealerHand)
            }
        },
        getPath(card){
            return "./PNG/"+card+".png";
        }

    }
})