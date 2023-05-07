$(document).ready(function () {
    $("#gantt").click(function () {
        console.log("this is gantt");
        // 프로세스 개수 받아오기
        // var processorCnt = parseInt(prompt("Enter the number of processors:"));
        // var endTime = parseInt(prompt("Enter the end time:"));
        // var processCnt = parseInt(prompt("Enter the number of processes:"));

        let processorCnt = 4; // 얘는 pCoreCnt + eCoreCnt 값

        // 시뮬레이터 인포에서 값 가져오기 (PCoreCnt, ECoreCnt)
        let pcoreCnt = 2;
        let ecoreCnt = 2;
        let cores = ["Pcore1", "Pcore2", "Ecore1", "Ecore2"];
        // Max(TT)
        let endTime = 19;
        // 시뮬레이터 인포에서 값 가져오기 (ProcessCnt)
        let processCnt = 6;

        let colors = []
        for (let i = 0; i <= processCnt; i++) {
            colors.push(getRandColor());
        }
        // 각 시간당 각 프로세서에서 어떤 프로세스가 동작하는가
        let processes =
            [[1, 0, 0, 0],
            [1, 0, 0, 0],
            [1, 2, 0, 0],
            [1, 2, 0, 0],
            [0, 2, 0, 0],
            [0, 2, 3, 0],
            [0, 0, 3, 4],
            [0, 0, 3, 4],
            [5, 0, 3, 4],
            [5, 6, 3, 4],
            [0, 6, 3, 4],
            [0, 6, 3, 0],
            [4, 6, 0, 0],
            [4, 6, 0, 0],
            [0, 6, 0, 0],
            [0, 6, 0, 0],
            [0, 6, 0, 0],
            [0, 6, 0, 0],
            [0, 6, 0, 0],];

        // 간트차트로 쓰일 테이블 생성
        let ganttTable = $("<table id='ganttTable'>");

        // 시간 스탬프 표시
        let timeRow = $("<tr class='tableRow' id='tableRow'>");
        for (let i = 0; i <= endTime; i++) {
            if (i === 0) timeRow.append("<th style='width:100px; background:#FFFFFF'></th>");
            else timeRow.append("<th class='timeStamp' id='timeStamp'>" + i + "</th>");
        }
        ganttTable.append(timeRow);
        
        // 칠하기
        for (let i = 0; i < processorCnt; i++) {
            let col = $("<tr class='tableCol' id='tableCol'>");
            col.append("<td class='innerHeader' id='innerHeader'>" + cores[i] + "</td>");
            for (let j = 0; j < endTime; j++) {
                if (processes[j][i] !== 0) {
                    if (j === 0 || (j > 0 && processes[j - 1][i] !== processes[j][i]))
                        col.append("<td style='background-color:" + colors[processes[j][i]] + ";'>P" + processes[j][i] + "</td>");
                    else
                        col.append("<td style='background-color:" + colors[processes[j][i]] + ";'></td>");
                }
                else col.append("<td></td>");
            }
            ganttTable.append(col);
        }

        // add the table to the chart container
        $("#baseTable").html(ganttTable);
    });
});

function getRandColor() {
    // 랜덤으로 하기 vs 정해진 색 n개 만들어 놓기
    // #FFFFFF의 형태로 랜덤 색상 반환
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}