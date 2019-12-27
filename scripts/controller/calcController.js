class CalcController{

    constructor(){
        //construtor da calculadora

        this._audio = new Audio('click.mp3');
        this._audioOnOff = false;
        this._lastOperator = '';
        this._lastNumber ='';
        this._operation = [];
        this._locale = 'pt-BR';
        this._displayCalcEl =  document.querySelector("#display");
        this._dateEl = document.querySelector("#data");
        this._timeEl = document.querySelector("#hora");
        this._currentDate;
        this.initialize();
        this.initButtonsEvents();
        this.initKeyBoard();
        

    }

    copyToClipboard(){
        //metodo que copia dados do display para a area de transferencia

        let input = document.createElement('input'); //cria um elemento input no html e armazena na variavel

        input.value = this.displayCalc; //armazena o valor do display no valor da variavel

        document.body.appendChild(input); //appenda no corpo do documento html

        input.select(); // seleciona o valor no corpo do documento html

        document.execCommand("Copy"); //copia para area de transferencia

        input.remove(); //remove o campo


    }

    pasteFromClipboard(){
        //metodo que cola no display informações da area de transferência
        
        document.addEventListener('paste', e=>{
            //rastreando o evento colar
            
            let text = e.clipboardData.getData('Text'); //armazenando os dados da area de transferência na variavel

            this.displayCalc = parseFloat(text); //convertendo em texto e colando no display (NaN se for texto)

            


        });
    }

    initialize(){
        //metodo de inicializacao da calculadora

        this.setDisplayDateTime();
        
        setInterval(() => {
            this.setDisplayDateTime();


        }, 1000);

        this.setLastNumberToDisplay();
        this.pasteFromClipboard();

        document.querySelectorAll('.btn-ac').forEach(btn => {

            btn.addEventListener('dblclick', e=>{

                this.toggleAudio();
            })
        })
    }

    toggleAudio(){
        //metodo que verifica se o audio esta ligado ou desligado

        this._audioOnOff = !this._audioOnOff;

    }

    playAudio(){
        //metodo que toca o audio se estiver ligado
        if (this._audioOnOff) {
            this._audio.currentTime = 0;
            this._audio.play();
        }
    }

    initKeyBoard(){

        document.addEventListener('keyup', e=> {

            this.playAudio();
            switch (e.key) {
                case 'Escape':
                    this.clearAll();
                    break;
                case 'Backspace':
                    this.clearEntry();
                    break;
                case '+':
                case '-':
                case '/':
                case '*':
                case '%':
                    this.addOperation(e.key);
                    break;
                    
               
                
                case 'Enter':
                case '=':
                    this.calc();
                    
                    break;
        
                case '.':
                case ',':
                    this.addDot('.'); 
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
                    this.addOperation(parseInt(e.key));
                    
                    break;
                case 'c':
                    if (e.ctrlKey) this.copyToClipboard();
                    break;
        
            }
        });

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
        this._lastNumber = '';
        this._lastOperator = '';
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

    getResult(){

        try{
        return eval(this._operation.join(""));
        } catch(e){
            setTimeout(()=>{
                this.setError();
            }, 0);
            
        }

        
    }
    

    calc(){
        //metodo que avalia as expressões da calculadora, gerando resultado para cada par de operação.

        this._lastOperator = this.getLastItem(true); //armazena o ultimo operador

        if (this._operation[this._operation.length-1] == '%' && this._operation.length <= 2){
            //avalia se foi digitado % como primeiro operador
            this._operation.pop();
            let newResult = this._operation[0]/100;
            this._operation = [newResult];
            


        }

        let last = '';

        if (this._operation.length < 3){

            let firstItem = this._operation[0];
            this._operation = [firstItem, this._lastOperator, this._lastNumber];
        }

        if (this._operation.length >3){
            //avalia se o array possui mais de 3 elementos

            last = this._operation.pop(); //retira o ultimo valor digitado do array e armazena na variavel
            this._lastNumber = this.getResult(); //armazena o ultimo numero
            
        } else if (this._operation.length == 3){

            
            this._lastNumber = this.getLastItem(false); //armazena o ultimo numero
            
        }

        

        let result = this.getResult(); //avalia o par de operação e armazena o resultado
        

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

    getLastItem(isOperator = true){
        //metodo que retorna o ultimo item do array
        let lastItem;

        for (let i = this._operation.length-1; i >= 0; i--){
            //percorre o array procurando o ultimo item

            if (this.isOperator(this._operation[i]) == isOperator){

                lastItem = this._operation[i]; //armazena o ultimo item encontrado na variavel
                break;
            }
        }

        if (!lastItem) {
            //avalia se não existe lastItem e retorna a que estava na memória

            lastItem = (isOperator) ? this._lastOperator : this._lastNumber
        }

        return lastItem;

    }

    setLastNumberToDisplay(){
        //metodo que retorna o ultimo numero do array

        let lastNumber = this.getLastItem(false); //invoca metodo que busca ultimo item, passando parametro false para procurar numero


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
                    //avalia se o % foi o segundo item digitado e chama o metodo calc
                    
                    this.calc();
                    
                }
                
                
            }

            else{
                let newValue = this.getLastOPeration().toString() + value.toString(); //concatena os números como string
                this.setLastOperation(newValue); //atribui o valor concatenado para a ultima operação
                this.setLastNumberToDisplay(); //atualiza o display
                
            }

        

        }

        
        
    }

    setError(){
        //metodo que atribui mensagem de erro para o display

        this.displayCalc = "Error"; 
    }

    addDot(){
        //metodo para adicionar ponto nos números

        let lastOperation = this.getLastOPeration(); //armazena a última operação

        if (typeof lastOperation === 'string' && lastOperation.split('').indexOf('.') > -1) return;
        
        if (this.isOperator(lastOperation) || !lastOperation){
            //verifica se a ultima operação é um operador ou é a primeira interação do usuário

            this.pushOperation('0.'); //adiciona 0. em ambos os casos
        } else {
            //verifica se o usuário está digitando um número maior que zero 'como float'

            this.setLastOperation(lastOperation.toString() + '.'); //concatena e adiciona o ponto para a operação


        }

        this.setLastNumberToDisplay(); //atualiza o display
        
        

    }

    execBtn(value){

        this.playAudio();

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
                this.addDot('.'); 
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

    set displayCalc(value){

        if (value.toString().length > 10){
            this.setError();
            return false;
        }
        this._displayCalcEl.innerHTML = value;
    }

    get currentDate(){
        return new Date();
    }

    set currentDate(value){
        this._currentDate = value;
    }

}