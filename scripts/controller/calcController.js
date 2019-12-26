class CalcController{

    constructor(){
        //construtor da calculadora
        this._operation = [];
        this._locale = 'pt-BR';
        this._displayCalcEl =  document.querySelector("#display");
        this._dateEl = document.querySelector("#data");
        this._timeEl = document.querySelector("#hora");
        this._currentDate;
        this.initialize();
        this.initButtonsEvents();

    }

    initialize(){
        //metodo de inicializacao da calculadora

        this.setDisplayDateTime();
        
        setInterval(() => {
            this.setDisplayDateTime();


        }, 1000);

        this.setLastNumberToDisplay();
    }

    addEventListenerAll(element, events, fn){
        //metodo que analisa as informacoes de mais de um evento
        events.split(' ').forEach(event => {

            element.addEventListener(event, fn, false);
        });
    }

    clearAll(){
        //metodo que zera a memoria da calculadora
        this._operation = [];
        this.setLastNumberToDisplay(); //atualiza o display para o ultimo valor digitado

    }

    clearEntry(){
        //metodo que limpa a ultima entrada da calculadora
        this._operation.pop();
        this.setLastNumberToDisplay(); //atualiza o display para o ultimo valor digitado

    }

    getLastOPeration(){
        //retorna qual a ultima posicao do array, podendo ser um numero ou um operador

        return this._operation[this._operation.length-1];
    }

    setLastOperation(value){
        //metodo que substitui o operador, caso o usuario troque de operação matemática

        this._operation[this._operation.length-1] = value;

    }

    isOperator(value){
        //metodo que valida se o ultimo valor digitado é um operador
        return (['+','-','*','%','/'].indexOf(value) > -1);

    }

    getLastOperator(){
        //metodo que verifica o ultimo operador digitado
        return this._operation[this._operation.length-2]
    }

    pushOperation(value){
        //metodo que concatena insere no array os valores digitados na calculadora
       
        this._operation.push(value); //joga o valor digitado para o array
        
        

            if(this._operation.length >3){
                
                this.calc(); //se o array tem mais de 3 posições ele calcula o primeiro par de operação.
                this.setLastNumberToDisplay();    //atualiza o display para o resultado do calculo
                
            }
    } 
    

    calc(){
        //metodo que avalia as expressões da calculadora, gerando resultado para cada par de operação.

        if (this._operation[this._operation.length-1] == '%' && this._operation.length <= 2){
            //avalia se foi digitado % como primeiro operador
            this._operation.pop();
            let newResult = this._operation[0]/100;
            this._operation = [newResult];
            


        }

        let last = '';

        if (this._operation.length >3){
            //avalia se o array possui mais de 3 elementos

            last = this._operation.pop(); //retira o ultimo valor digitado do array e armazena na variavel

        }

        let result = eval(this._operation.join("")); //avalia o par de operação e armazena o resultado
        

        if (last == '%'){
            //verifica se o valor da variavel last é um %

            if (this.getLastOperator() == '+' || this.getLastOperator() == '-'){
                //avalia se trata-se de uma adição ou subtração de porcentagem

                let percentage = this._operation[this._operation.length-1]/100; //divide o valor de percentual por 100 e armazena
                let principalValue = this._operation[this._operation.length-this._operation.length]; //armazena o valor principal para fins de calculo
                let percentageResult = percentage*principalValue; //efetua o valor a ser incrementado ou decrementado

                this._operation[this._operation.length-1] = percentageResult; //atualiza a posição do array correspondente ao valor a ser incrementado ou decrementado



            } else {

            result /= 100; //divide o resultado por cem

            this._operation = [result]; //atualiza o array para o resultado final
            }

        }  else{
            
            this._operation = [result]; //atualiza o array com o resultado e o ultimo operador digitado

            if (last) this._operation.push(last);

        
        }

        this.setLastNumberToDisplay();

    }

    setLastNumberToDisplay(){
        //metodo que atualiza o display com o ultimo numero do array
        let lastNumber;

        for (let i = this._operation.length-1; i >= 0; i--){
            //percorre o array procurando o ultimo numero
            if (!this.isOperator(this._operation[i])){

                lastNumber = this._operation[i]; //armazena o ultimo numero encontrado na variavel
                break;
            }
        }

        if (!lastNumber) lastNumber = 0; //se nao existe ultimo numero, é declarado 0

        this.displayCalc =lastNumber; //atualiza o display para o ultimo numero

    }

    addOperation(value){
        //metodo que adiciona operações ou operadores para a memória da calculadora
       

        if(isNaN(this.getLastOPeration())){
            //avalia se a ultima operação digitada não é um numero
            
             
            if(this.isOperator(value)){
                //avalia se é operador e invoca o metodo armazena ou substitui o ultimo operador
                
                this.setLastOperation(value);
                
                                                
            } else if(isNaN(value)){

                //Outra coisa
                
                console.log('Outra coisa', value);
            }

            else{
                //se não é operator, invoca o metodo que insere no array e atualiza o display (pode ser o 'igual')       
                this.pushOperation(value);
                this.setLastNumberToDisplay();
                
                
            }


        }

        else{
            //avalia se o ultimo valor do array é um numero

            if (this.isOperator(value)){
                //se o proximo valor digitado for um operador invoca o metodo que grava as digitações no array
                
                this.pushOperation(value);
                let operador = this._operation[this._operation.length-1];
                if (operador == '%' && this._operation.length==2){
                    
                    this.calc();
                    
                }
                
                
            }

            else{
                let newValue = this.getLastOPeration().toString() + value.toString();
                this.setLastOperation(parseInt(newValue));
                this.setLastNumberToDisplay();
                
            }

        

        }

        
        
    }

    setError(){
        this.displayCalc = "Error";
    }

    execBtn(value){

        switch (value) {
            case 'ac':
                this.clearAll();
                break;
            case 'ce':
                this.clearEntry();
                break;
            case 'soma':
                this.addOperation('+');
                break;
                
            case 'subtracao':
                this.addOperation('-');
                break;
            
            case 'multiplicacao':
                this.addOperation('*');
                break;
            
            case 'divisao':
                this.addOperation('/');
                break;
            
            case 'porcento':
                this.addOperation('%');
                break;
            
            case 'igual':
                this.calc();
                
                break;
    
            case 'ponto':
                this.addOperation('.'); 
                break;
    
            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                this.addOperation(parseInt(value));
                
                break;
    
            default:
                this.setError();
                break;
        }
    }

   
    initButtonsEvents(){

        let buttons = document.querySelectorAll("#buttons > g, #parts > g");

        buttons.forEach((btn, index)=>{

            this.addEventListenerAll(btn, "click drag", e=> {
                
                let textBtn = btn.className.baseVal.replace("btn-", "");

                this.execBtn(textBtn);
            });

            this.addEventListenerAll(btn, "mouseover mouseup mousedown", e =>{

                btn.style.cursor = "pointer";
            });
        });

        
    }

    setDisplayDateTime(){
        //gerando as informacoes da linha superior do display da calculadora
        this.displayDate = this.currentDate.toLocaleDateString(this._locale, {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
        this.displayTime = this.currentDate.toLocaleTimeString(this._locale);
    }

    get displayDate(){

        this._dateEl.innerHTML
    }
    
    set displayDate(value){

        return this._dateEl.innerHTML = value;
    }

    get displayTime(){

        this._timeEl.innerHTML
    }

    set displayTime(value){

        return this._timeEl.innerHTML = value;
    }

    get displayCalc(){

        return this._displayCalcEl.innerHTML;
    }

    set displayCalc(valor){
        this._displayCalcEl.innerHTML = valor;
    }

    get currentDate(){
        return new Date();
    }

    set currentDate(value){
        this._currentDate = value;
    }

}