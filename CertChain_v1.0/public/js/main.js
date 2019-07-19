$(document).ready(function () {

    $("#register_btn").click(function () {
        const name = $("#register_name").val();
        const email = $("#register_email").val();
        const pw = $("#register_pw").val();
        const pw_check = $("#register_pw_check").val();
        const isEmail = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
        if (name && email && pw && pw_check) {
            if (!isEmail.test(email)) {
                alert("5~20자의 영문 소문자, 숫자와 특수기호(_),(-)만 사용 가능합니다.");
            } else if(pw != pw_check){
                alert("비밀번호가 일치하지 않습니다.");
            } else {
                const send_params = {
                    name,
                    email,
                    pw,
                    pw_check
                }
                $.post("/register", send_params, function (data, status) {
                    alert(JSON.parse(data).msg);
                    window.location.reload(true);
                });
            }
        } else {
            alert("입력되지 않은 값이 있습니다. 다시 입력하세요.");
        }
    });

    // 중복확인
    $("#dup_check_btn").click(function () {
        const email = $("#register_email").val();
        if (email) {
            const send_params = {
                email
            }
            $.post("/dup_check", send_params, function (data, status) {
                const parsedData = JSON.parse(data);
                if (parsedData.result > 0) {
                    $("#alert_duplication").html("<p style='color:red; font-size:14px; font-weight:bold'>중복된 이메일이 있습니다.</p>");
                    $("#register_email").html("");
                } else {
                    $("#alert_duplication").html("<p style='color:blue; font-size:14px; font-weight:bold'>가입 가능한 이메일입니다.</p>");
                    $("#register_email").html("");
                }

            });
        } else {
            alert("입력되지 않은 값이 있습니다. 다시 입력하세요.");
        }
    });


    $("#delete_account_btn").click(function () {

        if (confirm("정말 탈퇴하시겠습니까?")) {
            let pw = prompt("확인을 위해 비밀번호를 입력해주세요.", "");
            if (pw == null) {
                //alert("취소");
            } else {
                const send_params = {
                    pw
                }
                $.post("/delete_account", send_params, function (data, status) {
                    try {
                        alert(JSON.parse(data).msg);
                        window.location.reload(true);
                    } catch (err) {
                        window.location.reload(true);
                    }
                });
            }

        } else {
        }
    });


    $("#login_btn").click(function () {
        const email = $("#login_email").val();
        const pw = $("#login_pw").val();
        if (email && pw) {
            const send_params = {
                email,
                pw
            };
            $.post("/login", send_params, function (data, status) {
                try {
                    alert(JSON.parse(data).msg);
                    $("#login_email").val() = "";
                } catch (err) {
                    //console.log(err);
                    window.location.reload(true);
                }
            });
        } else {
            alert("입력되지 않은 값이 있습니다. 다시 입력하세요.");
        }
    });

    $("#login_page_btn").click(function () {
        $("#register_name").val("");
        $("#register_email").val("");
        $("#register_pw").val("");
        $("#register_pw_check").val("");
        $("#alert_duplication").html("");
    });

    $("#logout_btn").click(function () {
        $.get("/logout", function (data, status) {
            $(location).attr("href", "/");  // 리다이렉트
        });
    });


    $("#doc_insert_btn").click(function () {
        const title = $("#doc_title").val();
        const agency = $("#doc_agency").val();
        const pw = $("#doc_pw").val();
        const origin_filepath = $("input[name=doc_filename]").val().split("\\");
        const new_filepath = origin_filepath[origin_filepath.length - 1];

        if (title && agency && pw && new_filepath) {
            const send_params = {
                title,
                agency,
                pw,
                new_filepath
            };
            $.post("/doc_insert", send_params, function (data, status) {
                alert(JSON.parse(data).msg);
                window.location.reload(true);
            });
        } else {
            alert("입력되지 않은 값이 있습니다. 다시 입력하세요.");
        }
    });
    

    $("#doc_search_btn").click(function () {
        const send_params = {
        };
        $.post("/doc_search", send_params, function (data, status) {
            const parsedData = JSON.parse(data);
            let x;
            let result = "";

            for (x in parsedData) {
                result +=
                    "<div class='single-recent-post d-flex' >" +
                        "<!-- Thumb -->" +
                        "<div class='post-thumb'>" +
                            "<a href='#'><img src='img/box-filled.png' alt=''></a>" +
                        "</div>" +
                        "<!-- Content -->" +
                        "<div class='post-content'>" +
                            "<!-- Post Meta -->" +
                            "<div class='post-meta'>" +
                                "<a class='post-author'>" + parsedData[x].create_at.substr(0, 10) + "</a>" +
                                "<a class='post-tutorial'>" + parsedData[x].agency + "</a>" +
                            "</div>" +
                            "<p>" + parsedData[x].title + "</p>" +
                        "</div>"+
                        "<button class='btn roberto-btn w-100' id='doc_download_" + parsedData[x].no + "'><img src='img/download.png' ></button>" +
                        "<button class='btn roberto-btn w-100' id='doc_delete_" + parsedData[x].no + "'><img src='img/trash.png'></button>" +
                    "</div>";
            }
            $("#doc_list").html(result);
        });
    });

    $(document).on("click", "button[id^=doc_download_]", function(){ 
        var id = $(this).attr("id"); 
        var doc_no = id.replace("doc_download_", "");
        alert("추후 서비스할 예정입니다.");
        /*
        if (doc_no) {
            const send_params = {
                doc_no
            };
            $.post("/doc_download", send_params, function (data, status) {
                alert("추후 서비스할 예정입니다.");
            });
        } else {
            alert("정상적인 경로가 아닙니다. 다시 시도해주세요.");
        }
        */  
    });

    $(document).on("click", "button[id^='doc_delete_']", function(){ 
        var id = $(this).attr("id"); 
        var box_no = id.replace("doc_delete_", "");

        if (box_no) {
            const send_params = {
                box_no
            };
            $.post("/doc_delete", send_params, function (data, status) {
                alert(JSON.parse(data).msg);
                window.location.reload(true);
            });
        } else {
            alert("정상적인 경로가 아닙니다. 다시 시도해주세요.");
        }  
    });

    $("#key_check_btn").click(function () {
        const encoded_key = $("#encoded_key").val();
        if (encoded_key) {
            const send_params = {
                encoded_key
            };
            $.post("/key_check", send_params, function (data, status) {
                const parsedData = JSON.parse(data);
                let x;
                let result = "<h4 class='widget-title mb-30'>키 값 소유자 정보</h4>"+
                        "<p>이름 : "+parsedData[0].name+"</p>"+
                        "<p>이메일 : "+parsedData[0].email+"</p>"+
                        "<h4 class='widget-title mb-30'>조회한 키 값이 보유한 문서 목록</h4>";

                for (x in parsedData) {
                    result +=
                        "<div class='single-recent-post d-flex' >" +
                        "<!-- Thumb -->" +
                        "<div class='post-thumb'>" +
                        "<a href='#'><img src='img/box-filled.png' alt=''></a>" +
                        "</div>" +
                        "<!-- Content -->" +
                        "<div class='post-content'>" +
                        "<!-- Post Meta -->" +
                        "<div class='post-meta'>" +
                        "<a class='post-author'>" + parsedData[1][x].create_at.substr(0, 10) + "</a>" +
                        "<a class='post-tutorial'>" + parsedData[1][x].agency + "</a>" +
                        "</div>" +
                        "<p>" + parsedData[1][x].title + "</p>" +
                        "</div></div>";
                }
                $("#key_check_doc_list").html(result);
            });
        } else {
            alert("입력되지 않은 값이 있습니다. 다시 입력하세요.");
        }
    });


    // $("#cs_qna_send_btn").click(function () {
    //     const name = $("#cs_qna_name").val();
    //     const email = $("#cs_qna_email").val();
    //     const contents = $("#cs_qna_contents").val();
    //     if (name && email && contents) {
    //         const send_params = {
    //             name,
    //             email,
    //             contents
    //         }
    //         $.post("/cs_qna", send_params, function (data, status) {
    //             const parsed = JSON.parse(data);
    //             alert(parsed.msg + "\n접수메일 : " + parsed.email + "\n접수내용 : " + parsed.contents);
    //         });
    //     } else {
    //         alert("입력되지 않은 값이 있습니다. 다시 입력하세요.");
    //     }


    // });

    $("#make_key_btn").click(function () {
        const memo = $("#key_memo").val();
        const pw = $("#key_password").val();
        if (memo && pw) {
            const send_params = {
                memo,
                pw
            }
            $.post("/make_key", send_params, function (data, status) {
                const parsed = JSON.parse(data);
                alert(parsed.msg);
                window.location.reload(true);
            });
        } else {
            alert("입력되지 않은 값이 있습니다. 다시 입력하세요.");
        }
    });

    $("#search_key_btn").click(function () {
        const send_params = {
        };
        $.post("/search_key", send_params, function (data, status) {
            const parsedData = JSON.parse(data);
            let x;
            let result = "";


            for (x in parsedData) {
                result +=
                    "<div class='single-recent-post d-flex' >" +
                    "<!-- Thumb -->" +
                    "<div class='post-thumb'>" +
                    "<a href='#'><img src='img/key.png' alt=''></a>" +
                    "</div>" +
                    "<!-- Content -->" +
                    "<div class='post-content'>" +
                    "<!-- Post Meta -->" +
                    "<div class='post-meta'>" +
                    "<a class='post-author'>" + parsedData[x].create_at.substr(0, 10) + "</a>" +
                    "<a class='post-tutorial'>" + parsedData[x].memo + "</a>" +
                    "</div>" +
                    "<p >" + parsedData[x].encoded_key + "</p>" +
                    "</div>"+
                    "<button class='btn roberto-btn w-100' id='key_delete_" + parsedData[x].no + "'>삭제</button>" +
                    "</div>";
            }
            $("#key_list").html(result);
        });
    });

    $(document).on("click", "button[id^='key_delete_']", function(){ 
        var id = $(this).attr("id"); 
        var key_no = id.replace("key_delete_", "");

        if (key_no) {
            const send_params = {
                key_no
            };
            $.post("/key_delete", send_params, function (data, status) {
                alert(JSON.parse(data).msg);
                window.location.reload(true);
            });
        } else {
            alert("정상적인 경로가 아닙니다. 다시 시도해주세요.");
        }  
    });




});