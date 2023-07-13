const calc = expression => {
    let split = expression.split('').filter(e => /\S/.test(e)), 
        operatorExists = split.filter((e) => /\*|\/|\+|\-/.test(e)),
        i, j, total, preIndex, postIndex, parIndex = [], negNum = [], negRange = [];
    if (!operatorExists.length) return Number(expression);
    split.forEach((e, i) => e === '(' ? parIndex.push(i) : null);
    const negative = split => {
      for (i = split.length - 2; i >= 0; i--) {
        if (/-/.test(split[i]) && /[^\d\)]/.test(split[i-1]) && /\d|\(/.test(split[i+1])) {
          j = i;
          while (/\d|\./.test(split[j+1])) {
            negNum.push(split[j+1]); negRange.push(j); j++;
          }
        } else break;
        negRange.push(j);
        split.splice(negRange[0], negRange[negRange.length-1] + 1 - negRange[0], Number(negNum.join('')) * -1);
      }
    }
    const parentheses = (split, parSequence) => {
      while (parIndex.length) {
        i = parIndex[parIndex.length - 1] + 1;
        while (split[i] !== ')') {
          parSequence.push(split[i]); i++;
        }
        parSequence.length === 1 ? spliceSplit(split, parIndex, parSequence[0]) : operatorPriority(split, parSequence)
      }
    }
    const operatorPriority = (split, sequence, operator = []) => {
      for (i = 0; i < sequence.length; i++) {
        if (/\*|\//.test(sequence[i])) { operator.push(sequence[i], i); break; }
      }
      if (/\*|\//.test(operator[0]))  createSubSequence(split, sequence, operator)
      for (i = 0; i < sequence.length; i++) {
        if (typeof sequence[i] !== 'string') continue;
        if (/\-/.test(sequence[i])) { operator.push(sequence[i], i); break; }
        if (/\+/.test(sequence[i])) { operator.push(sequence[i], i); break; }
      }
      if (/\+|\-/.test(operator[0])) createSubSequence(split, sequence, operator) 
    }
    const createSubSequence = (split, sequence, operator, preOperator = [], postOperator = [], subRange = []) => {
      j = operator[1];
      while (/\d|\./.test(sequence[j - 1])) {
        preOperator.unshift(sequence[j - 1]); j--;
      }
      preIndex = j;
      subRange.push(preIndex);
      if (preOperator.length) {
        preOperator = Number(preOperator.join(''));
      }
      j = operator[1];
      while (j < sequence.length && /\d|\./.test(sequence[j + 1])) {
        postOperator.push(sequence[j + 1]); j++;
      }
      postIndex = j;
      subRange.push(postIndex);
      postOperator = Number(postOperator.join(''));
      calculate(split, sequence, operator, preOperator, postOperator, subRange)
    }
    const calculate = (split, sequence, operator, preOperator, postOperator, subRange) => {
      switch (operator[0]) {
        case '*':
          total = preOperator * postOperator; break;
        case '/':
          total = preOperator / postOperator; break;
        case '+':
          total = preOperator + postOperator; break;
        case '-':
          total = preOperator - postOperator; break;
      }
      spliceSequence(split, sequence, total, subRange)
    }
    const spliceSequence = (split, sequence, total, subRange) => {
      sequence.splice(preIndex, subRange[1] - subRange[0] + 1, total);
      if (sequence.length > 1) {
        operatorPriority(split, sequence, operator = [], preOperator = [], postOperator = [], subRange = []);
      }
        spliceSplit(split, parIndex, total)
    }
    const spliceSplit = (split, parIndex, total, parEnd = []) => {
       split.forEach((e, i) => e === ')' ? parEnd.push(i) : null);
      if (parIndex.length) {
        split.splice(parIndex[parIndex.length - 1], parEnd[0] + 1 - parIndex[parIndex.length - 1], total);
        if (split[parIndex[parIndex.length - 1] - 1] === '-') {
          split.splice(parIndex[parIndex.length - 1] - 1, parEnd[0] + 1 - parIndex[parIndex.length - 1], total * -1);
        }
        parIndex.pop();
      }
      if (split.length === 1) return split[0];
      parIndex.length ? parentheses(split, parSequence = []) : operatorPriority(split, split)
    }
    negative(split)
    parIndex.length ? parentheses(split, parSequence = []) : operatorPriority(split, split)
    return split[0]
  }

const inputField = document.getElementById("inputField"),
input = document.querySelector('input');

const calculate = () => {
    const value = document.querySelector('input').value, 
    appendDiv = document.createElement('div'), 
    div = document.querySelector('#appendToMe'), 
    output = calc(value);
    if (value.length) {
      appendDiv.append(value + " = " + output);
      appendDiv.classList.add('output')
      div.append(appendDiv);
    }
  }

const input0 = () => inputField.value += 0;
const input1 = () => inputField.value += 1;
const input2 = () => inputField.value += 2;
const input3 = () => inputField.value += 3;
const input4 = () => inputField.value += 4;
const input5 = () => inputField.value += 5;
const input6 = () => inputField.value += 6;
const input7 = () => inputField.value += 7;
const input8 = () => inputField.value += 8;
const input9 = () => inputField.value += 9;
const inputPlus = () => inputField.value += '+';
const inputMinus = () => inputField.value += '-';
const inputMult = () => inputField.value += '*';
const inputDiv = () => inputField.value += '/';
const inputOpenBracket = () => inputField.value += '(';
const inputCloseBracket = () => inputField.value += ')';
const inputEquals = () => {
    calculate(input.value)
    document.getElementById("btn=").disabled = true;
};
const inputClear = () => {
    inputField.value = '';
    document.getElementById("btn=").disabled = false;
}
const refresh = () => location.reload();

input.addEventListener('keydown', (event) => {
    if (event.keyCode === 13) calculate(input.value); 
});

input.addEventListener('keydown', (event) => {
    if (event.key === "Escape") inputClear();
})
  