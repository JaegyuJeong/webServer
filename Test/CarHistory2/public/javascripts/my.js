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
            try {
                alert(JSON.parse(data).msg);
                $("#login_email").val()="";
            }catch(err){
                window.location.reload(true);
            }
        });
    });
    $('#logout_btn').click(function () {                  
        $.get("/logout",function (data,status) {
            location.reload();
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
                    printData += `<tr><td>${key}</td><td><input value='${parsed_data.msg[key]}'>nl</td></tr>`;
                }
                printData += `</table><button id='carBasicInfoUpdate_btn'`

                $("#carBasicInfoSearch_div").html(`${printData}`);
        });
    });
    
    //carBasicInfoUpdate_btn
    $("#carBasicInfoUpdate_btn").click(function() {
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
                    printData += `<tr><td>${key}</td><td><input value='${parsed_data.msg[key]}'>nl</td></tr>`;
                }
                printData += `</table><button id='carBasicInfoUpdate_btn'`

                $("#carBasicInfoSearch_div").html(`${printData}`);
        });
    });
});