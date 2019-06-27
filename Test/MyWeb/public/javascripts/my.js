$(document).ready(function() {
    $("#member_insert_btn").click(function() {
        const name = $("#name").val();
        const email = $("#email").val();
        const comments = $("#comments").val();

        const send_params = {
            name,
            email,
            comments
        };
        $.post("/member_insert",send_params,function(data,status) {
                const parsed_data=JSON.parse(data);
                $("#result_div").html(`<h1>${parsed_data.msg}</h1>`);
        });
    });

    $("#login_btn").click(function() {
        const email=$("#login_email").val();
        const send_params={
            email
        };
        $.post("/login",send_params, function(data, status) {

                const parsed_data=JSON.parse(data);
                $('#login_result_div').html(
                    `<h1>${parsed_data.msg}</h1>
                    <button id='logout' style='color:black'>로그아웃</button> `);
        });
    });
    $('#logout_btn').click(function () {                  
        $.get("/logout",function (data,status) {
            //location.reload();
        });        
    });

    //carBasicInfoSearch_btn
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