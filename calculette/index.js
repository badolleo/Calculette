let equation = "";
let a = ""
let char = "";
let nbPar = 0;

function ajout(obj){
    char = obj;
    if(obj == 'C'){
        equation = "";
    }else if(obj == '='){
        equation = resolve();
    }else{
        a = equation.charAt(equation.length - 1)
        if(obj == "()"){
            if( a == '(' || a == '%' || a == '/' || a == 'X' || a == '-' || a == '+'){
                equation += "(";
                nbPar += 1;
            }else{
                if(nbPar != 0){
                    nbPar -= 1;
                    equation += ")";
                }
            }
        }else if( obj == "+/-"){

        }else if(obj == "+" || obj == "-" || obj == "/" || obj == "X" || obj == "%") {
            if (a != "+" && a != "-" && a != "/" && a != "X" && a != "%"){
                    equation += obj;
            } 
        }else{
            equation += obj;
        }
    }

    document.getElementById('request').innerHTML = equation;
}

function retour(){
    let supp = equation.charAt(equation.length - 1)
    if(supp == ")") nbPar++;
    if(supp == "(") nbPar--;
    equation = equation.substring(0, equation.length - 1);
    document.getElementById('request').innerHTML = equation;
}

function reecritureEquation(chaine){
    let newString = "";
    for(let i = 0; i < chaine.length; i++){
        if(chaine[i] == "-") newString += "_";
        else newString += chaine[i];
    }
    return newString;
}

function resolve(){
    let condition = true;
    equation = reecritureEquation(equation);
    while(condition){
        condition = resSubBlock(equation);
    }
    document.getElementById('request').innerHTML = "" + equation;
}

function resSubBlock(string){
    let open = 0;
    let close = 0;
    let result;
    for(let i = 0; i < string.length; i++){
        if(string[i] == "(") open = i + 1;
        if(string[i] == ")"){ 
            close = i;
            break;
        }
    }
    if(open != close && close != 0){
        console.log("oui y'a des parentheses, on doit faire : " + equation.substring(open, close));
        result = simpleCal(equation.substring(open, close));
        equation = "" + equation.substring(0, open - 1) + result + equation.substring(close + 1, equation.length);
        console.log(equation)
        return true;
    }
    else{
        equation = simpleCal(equation);
        return false;
    }   

}

function simpleCal(chaine){
    let signe = chaine.indexOf('X')
    let result = 0;
    if(signe == -1) signe = chaine.indexOf('/');
    if(signe == -1) signe = chaine.indexOf('%');

    if(signe != -1){
        let x = trouverAvant(chaine, signe, true);
        let y = trouverApres(chaine, signe, true);
        switch(chaine[signe]){
            case 'X':
                result = x * y;
                break;
            case '/':
                result = x / y;
                break;
            case '%':
                result = x % y;
                break;
        }
        /** 
        console.log("---------------")
        console.log(chaine.substring(0, trouverAvant(chaine, signe, false)))
        console.log(chaine.substring(trouverApres(chaine, signe, false), chaine.length))
        console.log("---------------")
        console.log("multicplication : " + chaine.substring(0, trouverAvant(chaine, signe, false))
                                         + result
                                         + chaine.substring(trouverApres(chaine, signe, false) + 1, chaine.length))
        */
        return simpleCal(chaine.substring(0, trouverAvant(chaine, signe, false))
        + result
        + chaine.substring(trouverApres(chaine, signe, false) + 1, chaine.length));

    }else{
        signe = chaine.indexOf("+");
        if(signe == -1) signe = chaine.indexOf("_");
        if(signe != -1){
            let x = trouverAvant(chaine, signe, true);
            let y = trouverApres(chaine, signe, true);
            switch(chaine[signe]){
                case '+':
                    result = x + y;
                    break;
                case '_':
                    result = x - y;
                    break;
            }
            /** 
            console.log(result)
            console.log(chaine);
            */
            return simpleCal(result + chaine.substring(trouverApres(chaine, signe, false) + 1, chaine.length));
        }
    }
    return chaine;
}

function trouverAvant(chaine, index, bool){
    let res = "";
    let i = 0
    for(i = index - 1; i >= 0; i--){
        char = chaine[i];
        if(char == "/" || char == "X" || char == "%" || char == "+" || char == "_") break;
        res += chaine[i];
    }
    if(!bool) return i + 1;
    return res.split("").reverse().join("") * 1;
}

function trouverApres(chaine, index, bool){
    let res = "";
    let i = 0;
    for(i = index + 1; i < chaine.length; i++){
        char = chaine[i];
        if(char == "/" || char == "X" || char == "%" || char == "+" || char == "_") break;
        res += chaine[i];
    }
    if(!bool) return i - 1;
    return res * 1;
}