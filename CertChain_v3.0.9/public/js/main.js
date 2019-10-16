$(document).ready(function () {

    function XSS_Check(value) {
        value = value.replace(/\<|\>|\"|\'|\%|\;|\(|\)|\&|\+|\-/g, "");
        value = value.replace(/\</g, "&lt;");
        value = value.replace(/\>/g, "&gt;");
        return value;
    }
    function length_Check(value) {
        if (value.length < 45)
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
                        pw_check,
                        type: "client"
                    }
                    $.post("/register", send_params, function (data, status) {
                        alert(JSON.parse(data).msg);
                        $(location).attr("href", "/");
                    });
                }
            } else {
                alert("입력되지 않은 값이 있습니다. 다시 입력하세요.");
            }
        }
    });

    $("#register_org_btn").click(function () {
        const email = $("#register_org_email").val();
        const pw = $("#register_org_pw").val();
        const pw_check = $("#register_org_pw_check").val();
        const type = $("#register_org_type").val();
        const name = $("#register_org_name").val();
        const boss = $("#register_org_boss").val();
        const reg_num = $("#register_org_reg_num").val();


        const isEmail = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;

        const v = grecaptcha.getResponse();
        if (v == '') {
            alert("자동가입방지 인증실패 \n자동가입방지 체크박스를 체크해주세요.");
        }
        else {
            if (name && email && pw && pw_check && type && boss && reg_num) {
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
                        pw_check,
                        type: XSS_Check(type),
                        boss: XSS_Check(boss),
                        reg_num: XSS_Check(reg_num)
                    }
                    $.post("/register", send_params, function (data, status) {
                        alert(JSON.parse(data).msg);
                        $(location).attr("href", "/");
                    });
                }
            } else {
                alert("입력되지 않은 값이 있습니다. 다시 입력하세요.");
            }
        }
    });

    // 중복확인
    $("#dup_check_btn").click(function () {
        const email_clinet = $("#register_email").val();
        const email_org = $("#register_org_email").val();

        let email = "";

        if (email_clinet) {
            email = email_clinet;
        } else {
            email = email_org;
        }

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
                    let result = "<h4 class='widget-title mb-30' style='font-size:26px'>키 값 소유자 정보</h4>" +
                        "<p>이름 : " + parsedData[0].name + "</p>" +
                        "<p>이메일 : " + parsedData[0].email + "</p>" +
                        "<br><hr><br><h4 class='widget-title mb-30' style='font-size:26px'>조회한 키 값이 보유한 커리어 목록</h4>";

                    result += "<br><h4 class='widget-title mb-30'>졸업 증명서</h4>";
                    for (x in parsedData[1]) {
                        let type;
                        if(parsedData[1][x].type =="expected"){
                            type = "졸업 예정 증명서";
                        }else{
                            type = "졸업 증명서"
                        }
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
                            "<a class='post-author'>발급일 : " + parsedData[1][x].create_at.substr(0, 10) + "</a>" +
                            "<a class='post-author'>성명 : " + parsedData[1][x].name + "</a>" +
                            "<a class='post-author'>발급기관 : " + parsedData[1][x].from_name + "</a>" +
                            "</div>" +
                            "<p>" + type + "</p>" +
                            "<p>생년월일 : " + parsedData[1][x].birth + "</p>"+
                            "<p>학과 : " + parsedData[1][x].dept + "</p>" +
                            "<p>졸업일자 : " + parsedData[1][x].date + "</p>" +
                            "<p>학위명 : " + parsedData[1][x].degree + "</p>" +
                            "<p>학위번호 : " + parsedData[1][x].code + "</p>" +
                            "</div></div>";
                    }

                    result += "<hr><h4 class='widget-title mb-30'>자격증</h4>";
                    for (x in parsedData[2]) {
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
                            "<a class='post-author'>발급일 : " + parsedData[2][x].create_at.substr(0, 10) + "</a>" +
                            "<a class='post-author'>자격증 명 :" + parsedData[2][x].title + "</a>" +
                            "<a class='post-author'>발급기관 : " + parsedData[2][x].from_name + "</a>" +
                            "</div>" +
                            "<p>등급 : " + parsedData[2][x].grade + "</p>"+
                            "<p>등록번호 : " + parsedData[2][x].serial + "</p>" +
                            "<p>취득일자 : " + parsedData[2][x].date + "</p>" +        
                            "</div></div>";
                    }

                    result += "<hr><h4 class='widget-title mb-30'>경력 증명서</h4>";
                    for (x in parsedData[3]) {
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
                            "<a class='post-author'>발급일 : " + parsedData[3][x].create_at.substr(0, 10) + "</a>" +
                            "<a class='post-author'>성명 : " + parsedData[3][x].name + "</a>" +
                            "<a class='post-author'>발급기관 : " + parsedData[3][x].from_name + "</a>" +
                            "</div>" +
                            "<p>생년월일 : " + parsedData[3][x].birth + "</p>"+
                            "<p>입사일자 : " + parsedData[3][x].date_join + "</p>" +
                            "<p>퇴사일자 : " + parsedData[3][x].date_leave + "</p>" +
                            "<p>담당부서 : " + parsedData[3][x].dept + "</p>" +
                            "<p>직위 : " + parsedData[3][x].rank + "</p>" +
                            "</div></div>";
                    }
                    $("#career_search_reslut").html(result);

                } catch (err) {
                    alert(JSON.parse(data).msg);
                    window.location.reload(true);
                }
            });
        } else {
            alert("입력되지 않은 값이 있습니다. 다시 입력하세요.");
        }
    });


    $("#key_encode_btn").click(function () {
        const pw = $("#key_password").val();
        if (pw) {
            const send_params = {
                pw
            }
            $.post("/key_encode", send_params, function (data, status) {
                const parsed = JSON.parse(data);
                alert(parsed.msg);
                window.location.reload(true);
            });
        } else {
            alert("입력되지 않은 값이 있습니다. 다시 입력하세요.");
        }
    });

    $("#key_search_btn").click(function () {
        const send_params = {
        };
        $.post("/key_search", send_params, function (data, status) {
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
                    "<a class='post-tutorial'>" + parsedData[x].create_at.substr(0, 10) + "</a>" +
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


    $("#cert_insert_btn").click(function () {
        const cert_title = $("#cert_title").val();
        const cert_grade = $("#cert_grade").val();
        const cert_serial = $("#cert_serial").val();
        const cert_date = $("#cert_date").val();
        const cert_key = $("#cert_key").val();
        if (cert_title && cert_grade && cert_serial && cert_date && cert_key) {
            const send_params = {
                cert_title,
                cert_grade,
                cert_serial,
                cert_date,
                cert_key
            };
            $.post("/cert_insert", send_params, function (data, status) {
                alert(JSON.parse(data).msg);
                window.location.reload(true);
            });
        } else {
            alert("입력되지 않은 값이 있습니다. 다시 입력하세요.");
        }
    });


    $("#degree_insert_btn").click(function () {
        const degree_type = $("#degree_type").val();
        const degree_name = $("#degree_name").val();
        const degree_birth = $("#degree_birth").val();
        const degree_dept = $("#degree_dept").val();
        const degree_date = $("#degree_date").val();
        const degree_degree = $("#degree_degree").val();
        const degree_code = $("#degree_code").val();
        const degree_key = $("#degree_key").val();
        if (career_name && career_birth && career_join && career_leave && career_dept && career_rank && career_key) {
            const send_params = {
                degree_type,
                degree_name,
                degree_birth,
                degree_dept,
                degree_date,
                degree_degree,
                degree_code,
                degree_key
            };
            $.post("/degree_insert", send_params, function (data, status) {
                alert(JSON.parse(data).msg);
                window.location.reload(true);
            });
        } else {
            alert("입력되지 않은 값이 있습니다. 다시 입력하세요.");
        }
    });



    $("#career_insert_btn").click(function () {
        const career_name = $("#career_name").val();
        const career_birth = $("#career_birth").val();
        const career_join = $("#career_join").val();
        const career_leave = $("#career_leave").val();
        const career_dept = $("#career_dept").val();
        const career_rank = $("#career_rank").val();
        const career_key = $("#career_key").val();

        if (career_name && career_birth && career_join && career_leave && career_dept && career_rank && career_key) {
            const send_params = {
                career_name,
                career_birth,
                career_join,
                career_leave,
                career_dept,
                career_rank,
                career_key
            };
            $.post("/career_insert", send_params, function (data, status) {
                alert(JSON.parse(data).msg);
                window.location.reload(true);
            });
        } else {
            alert("입력되지 않은 값이 있습니다. 다시 입력하세요.");
        }

    });

});