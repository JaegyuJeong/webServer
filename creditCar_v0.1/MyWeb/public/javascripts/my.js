$(document).ready(function() {
    //로그인
    $("#member_insert_btn").click(function() {
        const member_insert_id = $("#member_insert_id").val();
        const member_insert_pw = $("#member_insert_pw").val();
        const member_insert_pn = $("#member_insert_pn").val();
        if(member_insert_id&&member_insert_pw&member_insert_pn){
        const send_params = {
            member_insert_id,
            member_insert_pw,
            member_insert_pn
        };
        $.post('/member_insert',send_params,function(data,status) {
            $(location).attr("href", "/");
            const parsedData = JSON.parse(data);
            alert(`${parsedData.msg}`);
        });
    } else {alert("입력되지 않은 값이 있습니다.")}
    });

    $("#login_btn").click(function() {
        const member_login_id = $("#member_login_id").val();
        const member_login_pw = $("#member_login_pw").val();
        if(member_login_id && member_login_pw){
            const send_params = {
                member_login_id,
                member_login_pw
            };
            $.post('/login',send_params,function(data,status) {
                const parsedData = JSON.parse(data);
                if(parsedData.loginSuccess === true) {
                    $(location).attr("href","/main");
                    alert(`${parsedData.msg}`);
                }else {
                    $(location).attr("href","/");
                    alert(`${parsedData.msg}`);
                    $("#member_login_id").val("");
                    $("#member_login_pw").val("");
                }
            });
        }

    });
    $("#logout_btn").click(function() {
        $.get("/logout",function (data,status) {
            const parsedData = JSON.parse(data);
            $(location).attr("href", "/");
            alert(`${parsedData.msg}`);
        });     
    });
    $("#carBasicInfoSearch_btn").click(function() {
        const searchType=$("#searchType").val();
        const car_num_input=$("#car_num_input").val();
        const send_params={
            searchType,
            car_num_input
        };
        $.post("/search_carInfo",send_params, function(data, status) {

                const parsed_data=JSON.parse(data);
                let printData='<table border=3>';
                for(key in parsed_data.msg)
                {
                    printData += `<tr><td>${key}</td><td>${parsed_data.msg[key]}</td></tr>`;
                }

                $("#carBasicInfoSearch_div").html(`${printData}`);
        });
    });
});