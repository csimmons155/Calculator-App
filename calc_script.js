var placeholder = "";
var dotOn = 0;
//hist contains the previous entered equation
var hist = [];

var ans = 0;

//update the hist array
//actually does the displaying of hist and placeholder
// on the calculator
var update = function() {
    
    //replaces the zero with the current placeholder
    $('#current').text(placeholder);
    
    //if there is hist expression
    if (hist.length > 1) {
        var textOut = "";
        
        for (var i = 0; i < hist.length; i++) {
            textOut += hist[i];
            textOut += " ";
            $('#history').text(textOut);
        }//end for
        
    } else {
        //if no history, then display nothing
        $('#history').text(hist);
    }
    
};//end update


//called when number button is pressed
var checkNumber = function(id){
    //slice(-1) gets the last number in id
    //Number()  returns number version of the sliced id
    var isNum = Number(id.slice(-1));
    
    //if isNum is a number, append to placeholder
    if(typeof isNum === 'number'){
        //add number to the placeholder
        placeholder += id;
    }
    
};

//adding the math operators to the hist array
var checkOperator = function(id){
    
    //operator is always added with a number
    if(placeholder !== ""){
        //add current number to hist
        hist.push(placeholder);
        //reset placeholder
        placeholder = "";
        //add current operator to hist
        hist.push(id);
        
    } else if(ans){
        
        hist.push(ans);
        hist.push(id);
    }
};

//get output math expression to be calculated
var operatorIds = function(array){
    var dict = {
        "*":3,
        "/":3,
        "+":2,
        "-":2
    };
    
    var output = [];
    var stack = [];
    
    for(var indx = 0; indx < array.length; indx++){
        //if the number in array[indx] is a number ,
        // then add it to the output array
        if(!isNaN(parseFloat(array[indx])) && isFinite(array[indx])){
            output.push(Number(array[indx]));
        }
        //when array[indx] is an operator
        else {
            while(stack.length > 0 && dict[stack.slice(-1)[0]] >= dict[array[indx]]){
                output.push(stack.pop());
            }
            stack.push(array[indx]);
        }
    }//end for
    while(stack.length > 0){
        output.push(stack.pop());
    }
    
    return output;
};

//performs the actual math expressions
var perform = function(op1, op2, op3){
    
    //from attached bignumber.js --- to help w/ rounding
    op2 = new BigNumber(op2);
    op3 = new BigNumber(op3);
    
    if(op1 === "*"){
        return op2.times(op3).round(14);
    } else if(op1 === "/"){
        return op2.div(op3).round(14);
    } else if(op1 === "-"){
        return op2.minus(op3).round(14);
    } else if (op1 === "%"){
        return op2.mod(op3).round(14);
    } else{
        return op2.plus(op3).round(14);
    }
    
}

var calculate = function(array){
    var out = operatorIds(array);
    var op_stack = [];
    if(out.length <= 2){
        return out[0];
    }
    for(var indx = 0; indx < out.length; indx++){
        if(!isNaN(parseFloat(out[indx])) && isFinite(out[indx])){
            op_stack.push(out[indx]);
        } else {
            var oper3 = Number(op_stack.pop());
            var oper2 = Number(op_stack.pop());
            var answer = perform(out[indx], oper2, oper3);
            op_stack.push(answer);
        }
    }
    return op_stack.pop();
};







$(document).ready(function() {
                  
                  $('.operand').click(function(){
                                      checkNumber(this.id);
                                      update();
                                      });
                  
                  //when user clicks a number button
                  $('.operator').click(function() {
                                       dotOn = 0;
                                       checkOperator(this.id);
                                       update();
                                       });
                  
                  $('#CE').click(function(){
                                 placeholder = "";
                                 dotOn = 0;
                                 update();
                                 });
                  
                  $('#AC').click(function(){
                                 placeholder = "";
                                 ans = 0;
                                 hist = [];
                                 dotOn = 0;
                                 update();
                                 });
                  
                  $('#dot').click(function(){
                                  if(dotOn === 0 && placeholder !== ""){
                                  placeholder += "."
                                  dotOn = 1;
                                  } else if(dotOn === 0 && placeholder === ""){
                                  placeholder += "0."
                                  dotOn = 1;
                                  }
                                  update();
                                  });
                  
                  $('#equal').click(function(){
                                    //if a number is in the placeholder, push to hist array
                                    if(placeholder){
                                    hist.push(placeholder);
                                    }
                                    //make placeholder empty 
                                    placeholder = "";
                                    
                                    $('#history').text(hist.join(''));
                                    var calculated = calculate(hist);
                                    $('#current').text(calculated);
                                    ans = calculated; 
                                    hist = [];
                                    dotOn = 0;
                                    
                                    });
                  
                  
                  
                  });