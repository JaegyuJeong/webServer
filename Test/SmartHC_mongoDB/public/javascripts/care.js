$(document).ready(function(){
    $('#contact_send').click(function(){
        const name=$('#mem_name').val();
        const email=$('#mem_email').val();
        const phonum=$('#mem_phonum').val();
        const message=$('#mem_message').val();
        const mem_info={
            name,
            email,
            phonum,
            message
        };
        alert(JSON.stringify(mem_info));
        $.post("/member_insert",mem_info,function (data,status) {
            const parsed_data=JSON.parse(data);
            $('#memcontact').html(`<h1>${parsed_data}</h1>`);
        });
    });

    $('#login_btn').click(function () {
        const us_email = $('#mem_email').val();
        const us_name = $('#mem_name').val();
        const send_params = {
            us_email,
            us_name
        };
        $.post("/login", send_params, function (data, status) {
            try{
                alert(JSON.parse(data).msg);
                $('#mem_email').val()="";
                $('#mem_name').val()="";
            }catch(err){
                window.location.reload(true);
            };
        });
    });

    $('#logout_btn').click(function () {
        $.get("/logout", function (data, status) {
            alert("로그아웃 되었습니다.");
            location.reload();
        });
    });
});