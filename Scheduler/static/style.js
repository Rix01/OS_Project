/**
 * P, E Core - Color Change
 * @type {number[]}
 */
let checkList = [0, 0, 0, 0];
let check = 0;
function changeColor(num) {
    let processId = 'core' + num;
    let changeButton = document.getElementById(processId);

    check = checkList[num-1] % 3;
    if(check === 0){
        changeButton.style.backgroundColor = "#FFFFFF";
        changeButton.style.color = "#62C184";
        changeButton.style.borderColor = "#62C184";
        changeButton.innerText = "PCORE";
    }
    else if(check === 1){
        changeButton.style.backgroundColor = "#62C184";
        changeButton.style.color = "#FFFFFF";
        changeButton.innerText = "ECORE";
    }
    else {
        changeButton.style.backgroundColor = "#D0EDDA";
        changeButton.innerText = "OFF";
    }

    setCoreInfo(check);

    checkList[num-1] += 1;
}


/**
 * algorithm explain
 */
function algorithmExplain(e) {
    const text = e.options[e.selectedIndex].text;

    if(text === 'RR (Round Robin)') {
        document.getElementById('explainText1').innerText = "RR이지롱~";
    }
    else if(text === 'FCFS (First Come First Service)') {
        document.getElementById('explainText1').innerText = "FCFS 설명이지롱~";
    }
    else if(text === 'SPN (The Shortest Process Next)') {
        document.getElementById('explainText1').innerText = "SPN 설명이지롱~";
    }
    else {
        document.getElementById('explainText1').innerText = "MyAlgorithm 설명이지롱~";
    }

    algorithm(e);
}

/**
 * dropDown algorithm - Choose Algorithm with RR
 */
function algorithm(e) {
    const text = e.options[e.selectedIndex].text;

    if(text === 'RR (Round Robin)' || text === 'MyAlgorithm' ) {
        document.getElementById("RR").style.visibility ='visible';
    }
    else {
        document.getElementById("RR").style.visibility ='hidden';
    }
}

/**
 * Simulator Information
 * @type {number}
 */
let pcoreCnt = 0;
let ecoreCnt = 0;

function setCoreInfo(check) {
    const PCoreText =  document.getElementsByClassName('PCoreCnt')[0];
    const ECoreText = document.getElementsByClassName('ECoreCnt')[0];

    pcoreCnt = pcoreCount(check);
    ecoreCnt = ecoreCount(check);

    PCoreText.value = pcoreCnt;
    ECoreText.value = ecoreCnt;
}

function pcoreCount(check) {
    if(check === 1) {
        return --pcoreCnt;
    }
    else if(check === 2) return pcoreCnt;
    return ++pcoreCnt;
}
function ecoreCount(check) {
    if(check === 2) {
        return --ecoreCnt;
    }
    else if(check === 0) return ecoreCnt;
    return ++ecoreCnt;
}


/**
 * add Process
 */
let processCnt = 1;
let processName_cnt = 1;
document.addEventListener("DOMContentLoaded", function(event) {
    let addButton = document.querySelector('#plus');
    addButton.addEventListener('click', addProcess);

    function addProcess(e) {
        let processForm = document.querySelectorAll(".process-form");
        let container = document.querySelector('#form-container');
        let totalForms = document.querySelector('#id_form-TOTAL_FORMS');

        let formNum = processForm.length - 1;

        e.preventDefault();

        let newForm = processForm[processCnt - 1].cloneNode(true);
        let formRegex = RegExp(`form-(\\d){1}-`, 'g');

        formNum++;
        newForm.innerHTML = newForm.innerHTML.replace(formRegex, `form-${formNum}-`);

        // input 폼 추가
        container.insertBefore(newForm, addButton);
        totalForms.setAttribute('value', `${formNum + 1}`);

        //프로세스 이름 변경
        let processNameSpan = newForm.querySelector('#processName');
        processNameSpan.innerText = "Process " + ++processName_cnt;

        // 프로세스 개수 늘리기
        const ProcessText = document.getElementsByClassName('processCnt')[0];
        processCnt++;
        ProcessText.value = processCnt;

        // 프로세스 개수가 18개가 되면 '+' 버튼 안 보이게
        if (processCnt === 18) {
            const plusButton = document.getElementById("plus");
            plusButton.style.display = 'none';
        }
    }
});


/**
 * simulator information - get variable
 */
$('input[name=processCnt]').attr('value',processCnt);
$('input[name=PCoreCnt]').attr('value',pcoreCnt);
$('input[name=ECoreCnt]').attr('value',ecoreCnt);


/**
 * assemble 3 forms & submit
 */
$(document).ready(function() {
  $('#goButton').click(function() {
    let formData = new FormData();

    let processNum = $('#current-simulator').serialize();
    let PCoreNum = $('#AlgorithmList').serialize();
    let ECoreNum = $('#form-container').serialize();

    processNum += '&' + PCoreNum + '&' + ECoreNum;
    formData.append('QueryDict', processNum);

    $.ajax({
      url: '',
      type: 'POST',
      data: formData,
      contentType: false,
      processData: false,
      success: function(response) {
        console.log('success');
      },
      error: function(response) {
        console.log('error');
      }
    });
  });
});


/**
 * Input Field Valid Check - Only Number
 */
$(document).ready(function() {
    $("input[type='text']").on('input', function() {
        this.value = this.value.replace(/[^0-9]/g, '');
    });

    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (!/^(GET|HEAD|OPTIONS|TRACE)$/i.test(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader('X-CSRFToken', $('input[name="csrfmiddlewaretoken"]').val());
            }
        }
    });
});


/**
 * showLog.html - Core Color Change
 * @param button
 * @param cnt
 */
function changeColorLog(button, cnt) {
    if(cnt === 0){
        button.style.backgroundColor = "#FFFFFF";
        button.style.color = "#62C184";
        button.style.borderColor = "#62C184";
        button.innerText = "PCORE";
    }
    else if(cnt === 1){
        button.style.backgroundColor = "#62C184";
        button.style.color = "#FFFFFF";
        button.innerText = "ECORE";
    }
    else {
        button.style.backgroundColor = "#D0EDDA";
        button.innerText = "OFF";
    }
}
document.addEventListener("DOMContentLoaded", function() {
    const PcoreNum = document.getElementById('PCoreInfo').textContent;
    const EcoreNum = document.getElementById('ECoreInfo').textContent;

    let p = PcoreNum;
    let e = EcoreNum;
    for (let c = 1; c <= 4; c++) {
        let coreName = 'core' + c;
        const button = document.getElementById(coreName);

        if (parseInt(p) !== 0) {
            changeColorLog(button, 0);
            p--;
        }
        else if (parseInt(e) !== 0) {
            changeColorLog(button, 1);
            e--;
        }
    }
});
