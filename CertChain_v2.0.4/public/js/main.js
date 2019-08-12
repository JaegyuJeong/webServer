$(document).ready(function () {

    function XSS_Check(value) {
        value = value.replace(/\<|\>|\"|\'|\%|\;|\(|\)|\&|\+|\-/g, "");
        value = value.replace(/\</g, "&lt;");
        value = value.replace(/\>/g, "&gt;");
        return value;
    }
    function length_Check(value) {
        if(value.length<45)
            return true;
    }
    function check_password(pwd) {
        var char_type = 0;
        if (/[a-z]/.test(pwd))
            char_type = char_type + 1;
        if (/[A-Z]/.test(pwd))
            char_type = char_type + 1;
        if (/[0-9]/.test(pwd))
            char_type = char_type + 1;
        if (/[~!@#$%\^&*()_+`\-={}|[\]\\:”;’<>?,./]/gi.test(pwd))
            char_type = char_type + 1;

        return !(char_type < 2 || (char_type == 2 && pwd.length < 10) || pwd.length < 8);
    }

    $("#register_btn").click(function () {
        const name = $("#register_name").val();
        const email = $("#register_email").val();
        const pw = $("#register_pw").val();
        const pw_check = $("#register_pw_check").val();
        const isEmail = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;

        const v = grecaptcha.getResponse();
        if (v == '') {
            alert("자동가입방지 인증실패 \n자동가입방지 체크박스를 체크해주세요.");
        }
        else {
            if (name && email && pw && pw_check) {
                if (!isEmail.test(email)) {
                    alert("이메일 형식이 맞지 않습니다. [형식 : ___@___.___]");
                } else if (!check_password(pw)) {
                    alert("비밀번호 형식을 지켜주세요. 2종류는 10자이상, 3종류는 8자이상");
                } else if (pw != pw_check) {
                    alert("비밀번호가 일치하지 않습니다.");
                } else {
                    const send_params = {
                        name: XSS_Check(name),
                        email: XSS_Check(email),
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
        }
    });

    // 중복확인
    $("#dup_check_btn").click(function () {
        const email = $("#register_email").val();
        if (email) {
            const send_params = {
                email: XSS_Check(email)
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
            const send_params = {

            }
            $.post("/delete_account", send_params, function (data, status) {
                try {
                    alert(JSON.parse(data).msg);
                    window.location.reload(true);
                } catch (err) {
                    window.location.reload(true);
                }
            });
        } else {
        }
    });


    $("#login_btn").click(function () {
        const recaptcha = grecaptcha.getResponse();
        const email = $("#login_email").val();
        const pw = $("#login_pw").val();
        if (email && pw) {
            const send_params = {
                email: XSS_Check(email),
                pw,
                recaptcha
            };
            $.post("/login", send_params, function (data, status) {
                try {
                    alert(JSON.parse(data).msg);
                    $("#login_email").val() = "";
                } catch (err) {
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
        grecaptcha.reset();
    });

    $("#logout_btn").click(function () {
        $.get("/logout", function (data, status) {
            $(location).attr("href", "/");  // 리다이렉트
        });
    });

    $("#account_page_pw_btn").click(function () {
        const pw = $("#account_page_pw").val();
        let real_pw = "";
        if (pw) {
            $.post("/pw_check", { pw: pw }, function (data, status) {
                try {
                    alert(JSON.parse(data).msg);
                } catch (err) {
                    window.location.reload(true);
                }
            });
        } else {
            alert("입력되지 않은 값이 있습니다. 다시 입력하세요.");
        }
    });

    $("#update_pw_btn").click(function () {
        const old_pw = $("#old_pw").val();
        const new_pw1 = $("#new_pw1").val();
        const new_pw2 = $("#new_pw2").val();
        if (old_pw && new_pw1 && new_pw2) {
            if (!check_password(new_pw1)) {
                alert("비밀번호 형식을 지켜주세요. 2종류는 10자이상, 3종류는 8자이상");
            } else {
                const send_params = {
                    old_pw,
                    new_pw1,
                    new_pw2
                };
                $.post("/update_account", send_params, function (data, status) {
                    try {
                        alert(JSON.parse(data).msg);
                    } catch (err) {
                        alert("정상적으로 변경되었습니다.")
                        window.location.reload(true);
                    }
                });
            }
        } else {
            alert("입력되지 않은 값이 있습니다. 다시 입력하세요.");
        }
    });


    $("#doc_insert_btn").click(function () {
        const title = $("#doc_title").val();
        const agency = $("#doc_agency").val();
        const pw = $("#doc_pw").val();
        const origin_filepath = $("input[name=doc_filename]").val().split("\\");
        const new_filepath = origin_filepath[origin_filepath.length - 1];
        const fileTypeHandler = new_filepath.split(".");
        const fileType = fileTypeHandler[fileTypeHandler.length - 1];
        const allowedFileTypes = ["jpeg", "JPEG", "png", "PNG", "pdf", "PDF", "jpg", "JPG"];

        if (!allowedFileTypes.includes(fileType)) {
            alert('등록하는 파일형식이 잘못되었습니다.');
            $(location).attr("href", "/box");
        } else {
            if (title && agency && pw && new_filepath) {
                const send_params = {
                    title: XSS_Check(title),
                    agency: XSS_Check(agency),
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
                    "</div>" +
                    "<button class='btn roberto-btn w-100' id='doc_download_" + parsedData[x].no + "'><img src='img/download.png' ></button>" +
                    "<button class='btn roberto-btn w-100' id='doc_delete_" + parsedData[x].no + "'><img src='img/trash.png'></button>" +
                    "</div>";
            }
            $("#doc_list").html(result);
        });
    });

    $(document).on("click", "button[id^=doc_download_]", function () {
        var id = $(this).attr("id");
        var doc_no = id.replace("doc_download_", "");
        alert("추후 서비스할 예정입니다.");
    });

    $(document).on("click", "button[id^='doc_delete_']", function () {
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
                encoded_key: XSS_Check(encoded_key)
            };
            $.post("/key_check", send_params, function (data, status) {
                try {
                    const parsedData = JSON.parse(data);
                    let x;
                    let result = "<h4 class='widget-title mb-30'>키 값 소유자 정보</h4>" +
                        "<p>이름 : " + parsedData[0].name + "</p>" +
                        "<p>이메일 : " + parsedData[0].email + "</p>" +
                        "<h4 class='widget-title mb-30'>조회한 키 값이 보유한 문서 목록</h4>";

                    for (x in parsedData[1]) {
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

                } catch (err) {
                    alert(JSON.parse(data).msg);
                    window.location.reload(true);
                }
            });
        } else {
            alert("입력되지 않은 값이 있습니다. 다시 입력하세요.");
        }
    });


    $("#make_key_btn").click(function () {
        const memo = $("#key_memo").val();
        const pw = $("#key_password").val();
        if (memo && pw) {
            const send_params = {
                memo: XSS_Check(memo),
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
                    "</div>" +
                    "<button class='btn roberto-btn w-100' id='key_delete_" + parsedData[x].no + "'>삭제</button>" +
                    "</div>";
            }
            $("#key_list").html(result);
        });
    });

    $(document).on("click", "button[id^='key_delete_']", function () {
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

    $("#404_img").click(function () {
        $(location).attr("href", "/");
    });

});