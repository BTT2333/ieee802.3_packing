var leadCode = 0xAAAAAAAAAAAAAA; //前导码 7B
var preFrame = 0xAB; //帧前定界符 1B
var checkNum; //校验字段
var mac1 = 0x8000FF602CDC;
var mac2 = 0x8000FE853A5F;
var lenNum; //长度字段
var dataNum; //数据字段
var crc_32 = 0x104C11DB7;


window.onload = function () {
    // console.log("macS:"+test(101001,1101));
    alert("lol");
    $("#sub").click(function () {
        add();
    });
}


function add() {
    var data = $("#dataNum").val();
    if (data == "") {
        alert("数据字段不能为空！");
    } else {
        dataNum = strToBinCharCode(data); //数据字段二进制填充
        while (dataNum.length < (46 * 8)) {
            // alert("123456");
            dataNum += "00000000";
        }


        var numLen = dataNum.length / 8 + 18; //长度字段加上目的mac、元mac等的长度
        lenNum = numLen.toString(2); //长度字段填充

        while (lenNum.length < 16) {
            lenNum = "0" + lenNum;
        }

        console.log("dataNum:" + dataNum);
        console.log("numLen:" + numLen);
        console.log("lenNum:" + lenNum);

        checkNum = FCS(mac1, mac2, lenNum, dataNum);
        console.log("crc:" + checkNum);

        AddTable(checkNum);

    }
}

function AddTable(checkNum) {
    var table = document.getElementById("IEEE_table");
    var oneRow = table.insertRow(1);
    var cell1 = oneRow.insertCell();
    cell1.setAttribute("style","word-wrap:break-word;word-break:break-all");
    cell1.setAttribute("width","90px");
    cell1.innerHTML = leadCode.toString(2);
    var cell2 = oneRow.insertCell();
    cell2.setAttribute("style","word-wrap:break-word;word-break:break-all");
    cell2.setAttribute("width","70px");
    cell2.innerHTML = preFrame.toString(2);
    var cell3 = oneRow.insertCell();
    cell3.setAttribute("style","word-wrap:break-word;word-break:break-all");
    cell3.setAttribute("width","100px");
    cell3.innerHTML = mac2.toString(2);
    var cell4 = oneRow.insertCell();
    cell4.setAttribute("style","word-wrap:break-word;word-break:break-all");
    cell4.setAttribute("width","100px");
    cell4.innerHTML = mac1.toString(2);
    var cell5 = oneRow.insertCell();
    cell5.setAttribute("style","word-wrap:break-word;word-break:break-all");
    cell5.setAttribute("width","100px");
    cell5.innerHTML = lenNum; 
    var cell6 = oneRow.insertCell();
    cell6.setAttribute("style","word-wrap:break-word;word-break:break-all");
    cell6.setAttribute("width","100px");
    cell6.innerHTML = dataNum;
    var cell7 = oneRow.insertCell();
    cell7.setAttribute("style","word-wrap:break-word;word-break:break-all");
    cell7.setAttribute("width","100px");
    cell7.innerHTML = checkNum;
}


//FCS
function FCS(mac1, mac2, len, data) {
    var Instr = mac1.toString(2) + mac2.toString(2) + len + data;
    var Mlen;
    crc_32 = crc_32.toString(2).substr(1, 32);
    var plen = crc_32.length;

    var crc = [32];

    for (var i = 0; i < 32; i++) { //crc置为0
        crc[i] = "0";
    }


    for (var i = 0; i < 32; i++) { //数据后添加32个0
        Instr += '0';
    }

    Mlen = Instr.length;

    console.log("crcinit:" + crc);
    console.log("crc_32:" + crc_32);
    console.log("mlen:" + Mlen);
    console.log("plen:" + plen);
    console.log("Instr:" + Instr);
    var point = 0;

    while (Mlen > point) { //数据未处理完
        if (crc[0] == "1") { //首位为1
            crc = left(crc); //左移一位
            if (Instr[point] == "1") {
                crc[31] = "1";
            }
            for (var j = 0; j < 32; j++) {
                //console.log("crc_32:"+crc_32.substr(j, 1)+",crc:"+crc[j]);
                if (crc[j] == crc_32[j])
                    crc[j] = "0";
                else
                    crc[j] = "1";
            }
        } else {
            crc = left(crc); //左移一位
            if (Instr[point] == "1") {
                crc[31] = "1";
            }
        }
        point++;
        console.log("crcin2:" + point + ":" + crc.join(""));
    }
    return crc.join("");
}

function left(crc) {
    for (var i = 0; i < 31; i++) {
        crc[i] = crc[i + 1];
    }
    crc[31] = "0";
    return crc;
}


//字符串转二进制编码，不足8位补零
function strToBinCharCode(str) {
    if (str === "")
        return "";
    var binCharCode = [];

    for (var i = 0; i < str.length; i++) {
        var temp = str.charCodeAt(i).toString(2);
        while (temp.length < 8) {
            temp = "0" + temp;
        }
        binCharCode.push(temp);
    }
    return binCharCode.join("");
}