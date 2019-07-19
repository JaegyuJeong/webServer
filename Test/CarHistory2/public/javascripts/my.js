$(document).ready(function () {
    $("#member_insert_btn").click(function () {
        const name = $("#name").val();
        const email = $("#email").val();
        const comments = $("#comments").val();

        const send_params = {
            name,
            email,
            comments
        };
        $.post("/member_insert", send_params, function (data, status) {
            const parsed_data = JSON.parse(data);
            $("#result_div").html(`<h1>${parsed_data.msg}</h1>`);
        });
    });

    $("#login_btn").click(function () {
        const email = $("#login_email").val();
        const send_params = {
            email
        };
        $.post("/login", send_params, function (data, status) {
            try {
                alert(JSON.parse(data).msg);
                $("#login_email").val() = "";
            } catch (err) {
                window.location.reload(true);
            }
        });
    });
    $('#logout_btn').click(function () {
        $.get("/logout", function (data, status) {
            location.reload();
        });
    });

    //carBasicInfoSearch_btn
    $('#carBasicInfoSearch_btn').click(function () {
        const searchType = $('#searchType').val();
        const car_num_input = $('#car_num_input').val();
        const send_params = {
            searchType,
            car_num_input
        };
        $.post("/search_carInfo", send_params, function (data, status) {

            if (status === 'success') {
                const parsed_data = JSON.parse(data);
                let printData = `<table border=1 style='background-color:white;text-align:center;font-weight:bold;width:300px;height:300px'>`;
                for (key in parsed_data.msg) {
                    if (key === '차량번호') {
                        printData += `<tr><td style='background-color:lightgray;'>​${key}
                        ​</td><td style='color:blue'​><div id='car_no'>​${​parsed_data.msg[key]}​</div></​td></tr>`;
                    } else if (key === '용도 및 차종') {
                        printData += `<tr><td style='background-color:lightgray;'>​${key}​
                        </td><td style='color:blue'​><p contenteditable='true' id='useType'>​${​parsed_data.msg[key]}
                        ​</p></td​></tr>`;
                    } else {
                        printData += `<tr><td style='background-color:lightgray;'>​${key}​
                        </td><td style='color:blue'>​${​parsed_data.msg[key]}​</td></tr>`;
                    }
                } printData += `</table><button id='carBasicInfoUpdate_btn' class='btn btn-default'
                                style='background-color:chartreuse;color:black;'>수정</button><br/><br/>`​;
                $('#carBasicInfoSearch_div').html(`​${printData}​`);
            } else {
                alert("조회 결과 없음");
                $('#carBasicInfoSearch_div').html("차량번호나 차대번호를 확인하세요");
            }
        });
    });
    $(document).on('click', '#carBasicInfoUpdate_btn', function () {
        const car_no = $('#car_no').html();
        const useType = $('#useType').html();
        alert(car_no + ":" + useType);
        const send_params = {
            car_no,
            useType
        };
        $.post("/update_carInfo", send_params, function (data, status) {

            if (status === 'success') {
                $('#useType').attr('contenteditable', 'false');
                $('#useType').css('color', 'red');
            } else {
                alert("차량정보를 확인하세요");
            }
        });
    });
    //carBasicInfoUpdate_btn
    $("#carBasicInfoUpdate_btn").click(function () {
        const searchType = $("#searchType").val();
        const car_num_input = $("#car_num_input").val();
        const send_params = {
            searchType,
            car_num_input
        };
        $.post("/search_carInfo", send_params, function (data, status) {

            const parsed_data = JSON.parse(data);
            let printData = '<table border=3>';
            for (key in parsed_data.msg) {
                printData += `<tr><td>${key}</td><td><input value='${parsed_data.msg[key]}'>nl</td></tr>`;
            }
            printData += `</table><button id='carBasicInfoUpdate_btn'`

            $("#carBasicInfoSearch_div").html(`${printData}`);
        });
    });
});