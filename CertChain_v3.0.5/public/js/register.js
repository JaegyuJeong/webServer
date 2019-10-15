(function (root) {
    root.mon = root.mon || {};
    if (typeof mon.create !== 'function') return false;

    mon.create('mon.account.regist.write', (function () {
        'use strict';

        var core = mon.account.regist.core;

        //-----------------------
        // 회원가입 객체
        //-----------------------
        var RegistWrite = function () {
            var root = this;

            // 전체동의 체크 클릭 바인딩
            $('#agreeChkAll').bind('click', function () {
                if ($(this).attr("checked")) {
                    $('.agrSelect').find('input[type=checkbox]').prop('checked', true).change();
                } else {
                    $('.agrSelect').find('input[type=checkbox]').prop('checked', false).change();
                }
            });

            // 개별체크 클릭 바인딩 (전체 체킹처리 포함)
            var $agreeCheckBxs = $('.agrSelect').find('input[type=checkbox]');
            $agreeCheckBxs.bind('click', function () {
                var elemntLen = $agreeCheckBxs.length;
                var checkedLen = 0;

                $agreeCheckBxs.each(function () {
                    if ($(this).prop('checked')) {
                        checkedLen++;
                    }
                });

                elemntLen == checkedLen ? $('#agreeChkAll').prop('checked', true).change() : $('#agreeChkAll').prop('checked', false).change();
            });

            var $birthDay = $('#dev_born_day').data('birthday');
            if ($birthDay != "") {
                core.reg.dayBind($birthDay);
            }

            var $dev_email_Cp = $('#dev_email_Cp').val();
            if ($('#dev_email_Cp').val() != "") {
                core.reg.emailChk2();
                RegistValidator.prototype.CheckEmail();
            }

            // 비밀번호 레이어 클릭 바인딩
            $('#dev_pwd_help_icon').bind('click', function () {
                var $target = $('#dev_pwd_help_tooltip');
                $target.css('display') == 'none' ? $target.show() : $target.hide();
            });

            // 개인정보 유효기간 선택 레이어 바인딩
            $('#dev_valid_day_help_icon').bind('click', function () {
                var $target = $('#dev_valid_day_help_tooltip');
                $target.css('display') == 'none' ? $target.show() : $target.hide();
            });

            // 레이어 안내창 닫기 바인딩
            $('.btnClose a').bind('click', function (e) {
                e.preventDefault();
                $(this).parents('.tooltip').hide();
            });

            // 생년월일 선택 바인딩
            $('#dev_born_month').bind('change', function () {
                core.reg.dayBind();
            });

            // 생년월일 변경 바인딩
            $('#dev_born_year, #dev_born_month, #dev_born_day').bind('change', function () {
                RegistValidator.prototype.CheckBirth();
            });

            // 성별 선택 바인딩
            $('input:radio[name=Gender]').bind('change', function () {
                $('#txtGender').html("");
            });

            // 메일선택 바인딩
            $('#dev_mail_etc').bind('change', function () {
                core.reg.emailChk1();
            });
            $('#dev_email_Cp').bind('change', function () {
                core.reg.emailChk2();
                RegistValidator.prototype.CheckEmail();
            });
            $('#dev_M_Email, #dev_mail_etc').bind('keyup change', function () {
                RegistValidator.prototype.CheckEmail();
            });

            // 휴대폰번호 숫자만 입력가능하게 처리
            $('#dev_hphone2, #dev_hphone3').bind('keyup change', function () {
                $(this).val($(this).val().replace(/[^0-9]/gi, ""));
                RegistValidator.prototype.CheckPhone();
            });
            // 인증번호 숫자만 입력가능하게 처리
            $('#dev_CertNo').bind('keyup change', function () {
                $(this).val($(this).val().replace(/[^0-9]/gi, ""));
            });

            // 인증번호 받기 클릭 바인딩
            $('#btnCert').bind('click', function () {
                if ($('#dev_certChkStat').val() == "Y") return false;
                $('#dev_certChkStat').val('N');
                if (core.reg.checkForm()) {
                    core.auth.getCertSms();
                }
            });

            // 인증확인 버튼 클릭 바인딩
            $('#btnCertSubmit').bind('click', function () {
                if ($('#dev_certChkStat').val() == "Y") return false;
                core.auth.certComfirm();
            });

            // 시/도 선택 바인딩
            $('#Duty_Si_Code').bind('change', function () {
                var sicode = this.value;
                createGuCodeList(sicode);
                RegistValidator.prototype.CheckMAddress();
            });

            // 시/군/구 선택 바인딩
            $('#Duty_Gu_Code').bind('change', function () {
                var gucode = this.value;
                createDongCodeList(gucode);
                RegistValidator.prototype.CheckMAddress();
            });

            // 시/군/구 선택 바인딩
            $('#Duty_Dong_Code').bind('change', function () {
                RegistValidator.prototype.CheckMAddress();
            });

            // 가입하기 클릭 바인딩
            $('#btn_submit').bind('click', function (e) {
                e.preventDefault();
                // 유효성 체크
                var submitAlert = RegistValidator.prototype.SubmitAlert();

                if (!submitAlert) {
                    return submitAlert;
                };

                // 약관 동의 체크
                if (!$('#agreeChk_0').attr("checked")) {
                    alert('회원약관에 동의해주세요.');
                    $('#agreeChk_0').focus();
                    $("#boxJoinConfirm").show();
                    return false;
                }
                if (!$('#agreeChk_1').attr("checked")) {
                    alert('개인정보수집 및 이용에 동의해주세요.');
                    $('#agreeChk_1').focus();
                    $("#boxJoinConfirm").show();
                    return false;
                }
                $("#boxJoinConfirm").hide();

                if (confirm('개인회원으로 가입하시겠습니까?')) {
                    root.submit();
                }
            });

            // 약관 내용 SHOW/HIDE
            $('.toggle_terms > a').bind('click', function (e) {
                e.preventDefault();

                var $target = $(this);
                var $agreeTerms = $target.parent().next('.agree_terms');

                if ($agreeTerms.hasClass('t_on')) {
                    $agreeTerms.animate({ height: 0 }, 500, function () {
                        $agreeTerms.removeClass('t_on');
                        $target.html("내용보기<span class=''></span>");
                    });
                } else {
                    $agreeTerms.addClass('t_on');
                    $agreeTerms.animate({ height: 138 }, 500, function () {
                        $target.html("내용닫기<span class='open'></span>");
                    });
                }
            });

            if ($('#historyCert').val() == 'Y' && $('#dev_certChkStat').val() == "Y" && $('#dev_cert_idx').val() != "") {
                $('#dev_hphone1, #dev_hphone2, #dev_hphone3, #dev_CertNo').attr('disabled', true);
                $('#txtCert').removeClass("txtN").addClass("txtY").html("휴대폰 인증이 완료되었습니다.");
            }

            var createGuCodeList = function (sicode) {
                var codes = $.grep(GuCode, function (item, index) {
                    return item.SI_Code == sicode;
                });
                var $guCombo = $('#Duty_Gu_Code');

                var optionHtml = '<option value="">시&#183;군&#183;구</option>';

                $.each(codes, function (index, item) {
                    if (item.Gu_Code != sicode) {
                        optionHtml += '<option value="' + item.Gu_Code + '">' + item.Gu_Name + '</option>';
                    }
                });
                $guCombo.html(optionHtml);
                createDongCodeList('');
            }

            var createDongCodeList = function (gucode) {
                var codes = [];

                if (gucode != '') {
                    codes = $.grep(DongCode, function (item, index) {
                        return item.Dong_Code.substr(0, 4) == gucode;
                    });
                }

                var $dongCombo = $('#Duty_Dong_Code');

                var optionHtml = "";
                optionHtml = '<option value="">동&#183;읍&#183;면</option>';
                if (codes.length > 0) {
                    $.each(codes, function (index, item) {
                        var code = item.Dong_Code;
                        if (code != (gucode + '0000')) {
                            optionHtml += '<option value="' + code + '">' + item.Dong_Name + '</option>';
                        }
                    });
                }

                $dongCombo.html(optionHtml);
                $dongCombo.change();
            }

            // 페이지 종료시 안내표시 바인딩
            //$(window).bind('beforeunload', function () {
            //    if (root.submitted == false) {
            //        return '회원가입을 중단 하시겠습니까?';
            //    }
            //});
        };

        // 가입하기
        RegistWrite.prototype.submit = function () {
            var root = this;
            var idenE = $("#dev_Ident_e").val();
            var certIndex = $('#dev_cert_idx').val();

            if ($('#dev_certChkStat').val() != 'Y' || idenE == "" || certIndex == "") {
                $('.info_confirm').show();
                return false;
            }

            root.submitted = true;

            $.ajax({
                url: "/account/regist/is-cert-sms",
                type: "POST",
                cache: false,
                dataType: "json",
                data: {
                    identE: $("#dev_Ident_e").val(),
                    certIdx: $("#dev_cert_idx").val()
                },
                success: function (data) {
                    if (data.result == "OK") {
                        $('#dev_hphone1').attr('disabled', false);
                        $('#frm-reg').submit();
                    }
                    else {
                        if (typeof (data.errorMsg) != 'undefined') {
                            alert(data.errorMsg);
                            location.reload();
                        } else {
                            alert('오류가 발생하였습니다. 잠시 후 다시 시도해 주십시오.');
                            location.reload();
                        }
                    }
                },
                error: function () {
                    alert('오류가 발생하였습니다. 잠시 후 다시 시도해 주십시오.');
                    location.reload();
                }
            });
        };
        
        var RegistWriteCorp = {
            init: function () {
                var isTrans = false;
                if ($('#IsTransMem').length > 0) isTrans = true;
                //ipin -휴대폰 번호 append combo item 
                $.each(commonResources.PhoneExchangeNumber.mobile, function (index, item) {
                    var value = item.toString();
                    $('#MobileNo1').append('<option value="' + value + '">' + value + '</option>');
                });
                $('#MobileNo1').val($('#MobileNo1').data('val'));


                //전화변호 국번 append combo item 
                $('#Phone1').append('<option value="">선택</option>');
                $.each(commonResources.PhoneExchangeNumber.mobileNphone(), function (index, item) {
                    var value = item.toString();
                    $('#Phone1').append('<option value="' + value + '">' + value + '</option>');

                });
                $('#Phone1').append('<option value="selfInput">직접입력</option>');
                $('#Phone1').val($('#Phone1').data('val'));

                //이메일 세팅
                $('#dev_email_Cp').val($('#dev_email_Cp').data('val'));



                //본인인증 상태 세팅
                var certStep = $('#CertStep').val();
                var certType = $('#CertType').val().toLowerCase();
                if ($.trim(certType) == "") {
                    $('#CertType').val('M')
                    certType = "m";
                }
                $('div.dev_cert_area').hide();
                $('.certTab li.dev_cert_tab > a').removeClass('active');
                $('.certTab li.dev_cert_tab > a[data-val=' + $('#CertType').val() + ']').addClass('active');
                if (certStep == 0) {
                    $('#layer_cert_' + certType).show();
                } else if (certStep == 1) {
                    if (certType == "ipin") {
                        $('#layer_cert_ipin_step_2').show();
                    }
                } else if (certStep == 2) {
                    $('#layer_cert_success').show();
                } else {
                    $('#layer_cert_' + certType).show();
                }

                if (certStep > 0) {
                    $('#regform').find('[disabled]').prop('disabled', false).removeClass('ipDisable');
                } else {
                    $('#regform').find('[disabled]').addClass('ipDisable');
                }


                //기업인증 event binding
                $('#btn_sendMobileCert').on('click', function () {
                    var name = "", mobileNo = "";
                    name = $('#CorporateRegisterName').val();
                    mobileNo = $('#MobileNo1').val() + "-" + $('#MobileNo2').val() + "-" + $('#MobileNo3').val();
                    $(this).prop('disabled', true);
                    core.auth.sendCertSmsCorp(name, mobileNo);
                    $(this).prop('disabled', false);
                    return false;
                });
                $('#btn_confirmMobileCert').on('click', function () {
                    var name = "", mobileNo = "", certNo = "";
                    name = $('#CorporateRegisterName').val();
                    mobileNo = $('#MobileNo1').val() + "-" + $('#MobileNo2').val() + "-" + $('#MobileNo3').val();
                    certNo = $("#MobileCertNo").val();
                    core.auth.confirmCertSmsCorp(name, mobileNo, certNo);
                    return false;
                });

                //약관 체크 event binding
                //약관 event binding
                $('#agreeChkAll').on('click', function () {
                    $('.agrSelect').find('input[type=checkbox]').prop('checked', this.checked).change();
                }).on('change', function () {
                    $('#IsAllAgree').val(this.checked ? "1" : "0");
                    if (this.checked) $(this).next('label').addClass('on');
                    else $(this).next('label').removeClass('on');
                });

                var allAgreeChk = function () {
                    var agreeCheckBxs_len = $('.agrSelect input[type=checkbox]').length;
                    var isAllChk = $('.agrSelect input[type=checkbox]:checked').length == agreeCheckBxs_len
                    $('#agreeChkAll').prop('checked', isAllChk).change();
                };

                $('#user_info_agree2').on('change', function (e) {
                    var isChecked = this.checked;
                    if (isChecked) $(this).next('label').addClass('on');
                    else $(this).next('label').removeClass('on');

                    $('#isAgreePrivacySelect').val(isChecked ? "1" : "0");
                    allAgreeChk();
                });

                $('#user_info_agree_consignment').on('change', function (e) {
                    var isChecked = this.checked;
                    if (isChecked) $(this).next('label').addClass('on');
                    else $(this).next('label').removeClass('on');

                    $('#IsAgreePrivacyConsignment').val(isChecked ? "29" : "30");
                    allAgreeChk();
                });

                $('#user_ad_agree').on('change', function (e) {
                    var isChecked = this.checked;
                    if (isChecked) $(this).next('label').addClass('on');
                    else $(this).next('label').removeClass('on');
                    $('#IsAgreeReceiveNews').val(isChecked ? "1" : "0");
                    allAgreeChk();
                });

                $('#user_service_agree, #user_info_agree').on('change', function () {
                    var isChecked = $('#user_service_agree').is(':checked') && $('#user_info_agree').is(':checked');

                    if ($('#user_service_agree').is(':checked')) {
                        $('#user_service_agree').next('label').addClass('on');
                    } else {
                        $('#user_service_agree').next('label').removeClass('on');
                    }

                    if ($('#user_info_agree').is(':checked')) {
                        $('#user_info_agree').next('label').addClass('on');
                    } else {
                        $('#user_info_agree').next('label').removeClass('on');
                    }

                    //if ($('#user_info_agree2').is(':checked')) {
                    //    $('#user_info_agree2').next('label').addClass('on');
                    //} else {
                    //    $('#user_info_agree2').next('label').removeClass('on');                     
                    //}


                    $('#IsRequiredAgree').val(isChecked ? "1" : "0");
                    allAgreeChk();
                });

                //약관 선택값 세팅
                if ($('#IsAllAgree').val() == "1") {
                    $('#agreeChkAll').prop("checked", true).change();
                }

                if ($('#IsAgreePrivacyConsignment').val() == "29") {
                    $('#user_info_agree_consignment').prop("checked", true).change();
                }
                if ($('#IsRequiredAgree').val() == "1") {
                    $('#user_service_agree').prop("checked", true).change();
                    $('#user_info_agree').prop("checked", true).change();
                }
                if ($('#isAgreePrivacySelect').val() == "1") {
                    $('#user_info_agree2').prop("checked", true).change();                    
                }
                
                if ($('#IsAgreeReceiveNews').val() == "1") {
                    $('#user_ad_agree').prop("checked", true).change();
                }

                // 약관 내용 SHOW/HIDE
                $('.toggle_terms > a').on('click', function (e) {
                    e.preventDefault();

                    var $target = $(this);
                    var $agreeTerms = $target.parent().next('.agree_terms');

                    if ($agreeTerms.hasClass('t_on')) {
                        $agreeTerms.slideUp(200, function () {
                            $agreeTerms.removeClass('t_on');
                            $target.html("내용보기<span class=''></span>");
                        });
                    } else {
                        $agreeTerms.addClass('t_on');
                        $agreeTerms.slideDown(200, function () {
                            $target.html("내용닫기<span class='open'></span>");
                        });
                    }
                    return false;
                });

                //본인인증 event binding
                $('div.certTab > ul > li.dev_cert_tab > a').on('click', function (e) {
                    var certType = $(this).data('val');
                    var certStep = $('#CertStep').val();
                    if (certStep > 0) return false;
                    $('div.certTab > ul > li.dev_cert_tab > a').removeClass('active');
                    $('div.certTab > ul > li.dev_cert_tab > a[data-val=' + certType + ']').addClass('active');
                    $('#CertType').val(certType);

                    $('div.certTab .dev_cert_area').hide();
                    $('#layer_cert_' + certType.toLowerCase()).show();
                    return false;
                });

                $('.dev_cert_area  a[name=btn_cert]').on('click', function () {
                    var certType = $('#CertType').val();
                    var isAgree = $('#user_service_agree').is(':checked') && $('#user_info_agree').is(':checked');

                    if (!isAgree) {
                        alert("먼저 약관동의를 해주세요.");
                        $('#agreeChkAll').focus();
                        return false;
                    }

                    core.auth.identifyMember(certType, 'GIREG', $('#cer_return_url').val());
                    return false;
                });

                // 비밀번호 레이어 클릭 바인딩
                $('#dev_pwd_help_icon').on('click', function () {
                    var $target = $('#dev_pwd_tooltip');
                    if ($target.css('display') == 'none') {
                        $target.show();
                    } else {
                        $target.hide();
                    }
                    return false;
                });

                $('#dev_pwd_tooltip .btnClose').on('click', function () {
                    $('#dev_pwd_tooltip').hide();
                    return false;
                });

                // 개인정보 유효기간 선택 레이어 바인딩
                $('#dev_valid_day_help_icon').bind('click', function () {
                    var $target = $('#dev_valid_day_help_tooltip');
                    $target.css('display') == 'none' ? $target.show() : $target.hide();
                });

                // 레이어 안내창 닫기 바인딩
                $('#dev_valid_day_help_tooltip .btnClose').on('click', function () {
                    $('#dev_valid_day_help_tooltip').hide();
                    return false;
                });

                // IPIN인증휴대폰번호 숫자만 입력가능하게 처리
                $('#MobileNo2, #MobileNo3').bind('keyup change', function () {
                    $(this).val($(this).val().replace(/[^0-9]/gi, ""));
                });

                // 인증번호 숫자만 입력가능하게 처리
                $('#MobileCertNo').bind('keyup change', function () {
                    $(this).val($(this).val().replace(/[^0-9]/gi, ""));
                });

                // 메일선택 바인딩
                $('#dev_mail_etc').on('change', function () {
                    core.reg.emailChk1();
                });
                $('#dev_email_Cp').on('change', function () {
                    core.reg.emailChk2();
                    RegistValidator.prototype.CheckEmail();
                });
                $('#dev_M_Email, #dev_mail_etc').on('keyup change', function () {
                    RegistValidator.prototype.CheckEmail();
                });

                // 휴대폰번호 숫자만 입력가능하게 처리
                $('#Phone2, #Phone3').bind('keyup change', function () {
                    $(this).val($(this).val().replace(/[^0-9]/gi, ""));
                });


                //전화번호 선택 바인딩
                $('#Phone1').on('change', function () {
                    if (this.value == "selfInput") {
                        $('#dev_phone_area').hide();
                        $("#Phone2").val("");
                        $("#Phone3").val("");
                        $("#dev_phone_selfInput").show();
                    } else {
                        $("#dev_phone_selfInput").val("").hide();
                        $('#dev_phone_area').show();
                    }
                });
                //전화번호 valition binding
                $('#Phone1, #Phone2, #Phone3, #dev_phone_selfInput').on('blur', function () {
                    RegistValidator.prototype.CheckCPhone();
                });

                //사업자등록번호 valition binding
                $('#CorporateRegistrationNumber1,#CorporateRegistrationNumber2,#CorporateRegistrationNumber3')
                    .on('keyup change', function () {
                        $('#dev_corporateRegNumChkStat').val(0);
                        RegistValidator.prototype.CheckCorporateRegNum(RegistWriteCorp.getCorpRegNum());
                    });

                //기업인증 event binding
                $('#btn_CertifyCorporateRegistrationNumber').on('click', function () {
                    var certStep = $('#CertStep').val();
                    if (certStep < 1) return false;
                    $('#dev_corporateRegNumChkStat').val(0);
                    var regnum = RegistWriteCorp.getCorpRegNum();
                    var certResult = core.auth.certifyCorpRegNum(regnum, "", "", "", "", "");
                    $('#dev_corporateRegNumChkStat').val(certResult.ResultCode);

                    RegistValidator.prototype.CheckCorporateRegNum(regnum);
                    return false;
                });

                //브랜드 키워드 매핑
                $('#CName').autoComplete(
                    {
                        dataUrl: "/api/get-brand-keyword",
                        container: $('#dev_keywordResultList'),
                        focusClass: 'autoSearchOn',
                        select: function (obj) {
                            $('#BrandKeywordName').val(obj.text());
                            $('#BrandKeywordCode').val(obj.data('val'));
                            this.inputObj.val(obj.text());
                            this.container.find('ul > li').remove();
                            this.container.hide();
                        }
                    }
                );
                //기업명 validation binding
                $('#CName').on('focus keyup change', function () {
                    var value = this.value;
                    var selectedName = $('#BrandKeywordName').val().replace(' ', '');
                    if ((value.replace(' ', '')).indexOf(selectedName) < 0)
                        $('#BrandKeywordCode').val('');

                    RegistValidator.prototype.CheckCName();
                });

                //대표자명 validation binding
                $('#CorporateBossName').on('focus keyup change', function () {
                    RegistValidator.prototype.CheckCBossName();
                });

                //주소 validation binding
                $('#Full_Addr').on('focus change', function () {
                    RegistValidator.prototype.CheckAddress();
                });

                //주소 검색 open popup event binding
                $('#ZipCode, #btn_searchAddress').on('click', function () {
                    var certStep = $('#CertStep').val();
                    if (certStep < 1) return false;
                    core.reg.searchAddress('Y', 'addDetail');
                    return false;
                });

                $('#btn_join').on('click', function () {
                    if ($("#IpinMobileCertStat").val() == "bad") {
                        alert("이용제한 된 정보가 있습니다.\n해당 정보로는 서비스 이용이 불가합니다. (제한코드 : 3)\n자세한 문의는 고객센터(Tel.1588-9351)로 문의주시기 바랍니다.");
                        return;
                    }

                    $('#btn_join').prop('disabled', true);
                    var result = RegistWriteCorp.validateJoinForm();                    
                    if (result) {
                        $('#area_submit_noti').html('');
                        if (isTrans) {
                            if (confirm('기업회원으로 전환하시겠습니까?')) {
                                $('#regform').attr('action', '/account/regist/corptransmemproc');
                                $('#regform').submit();
                            } else {
                                $('#btn_join').prop('disabled', false);
                            }
                        } else {
                            if (confirm('가입 후, 사업자등록번호/회사명을 변경하시려면 사업자등록증 확인이 필요하니 정확히 입력해주세요.\n\n아래 정보로 회원가입 하시겠습니까?\n- 사업자등록번호 : ' + RegistWriteCorp.getCorpRegNum() + '\n- 회사/점포명 : ' + $("#CName").val())) {
                                $('#regform').attr('action', '/account/regist/writeproc');
                                $('#regform').submit();
                            } else {
                                $('#btn_join').prop('disabled', false);
                            }
                        }

                    } else {
                        $('#area_submit_noti').html('입력한 정보를 다시 확인해주세요.');
                        $('#btn_join').prop('disabled', false);
                    }
                    return false;
                });
            },
            getCorpRegNum: function () {
                var ret = "";
                ret = String.prototype.concat($.trim($('#CorporateRegistrationNumber1').val()), '-'
                    , $.trim($('#CorporateRegistrationNumber2').val()), '-'
                    , $.trim($('#CorporateRegistrationNumber3').val())
                );
                return ret;
            },
            checkLengthCorpRegNum: function (regnum) {
                if (regnum.length != 12) {
                    return false;
                }
                return true;
            },
            certSubmit: function (certType, encData, certNum, certIdx) {
                $('#CertType').val(certType);
                $('#enc_data').val(encData);
                $('#certNum').val(certNum);
                $('#CertIdx').val(certIdx);
                //$('#regform').attr("action", "/account/regist/write-c")
                $('#regform').submit();

            },
            validateJoinForm: function () {
                var isValid = false;
                var isTrans = false;
                if ($('#IsTransMem').length > 0) isTrans = true;


                //서비스 이용약관 동의
                isValid = $('#user_service_agree').is(':checked');
                if (!isValid) {
                    alert("이용약관에 동의해주세요.");
                    $('#user_service_agree').focus();
                    return false;
                }
                //개인정보 취급방침
                isValid = $('#user_info_agree').is(':checked');
                if (!isValid) {
                    alert("개인정보 수집 및 이용에 동의해주세요.");
                    $('#user_info_agree').focus();
                    return false;
                }
                //본인인증
                if ($('#CertStep').val() != "2") {
                    alert("본인명의 휴대폰 또는 아이핀 인증 후 회원가입이 가능합니다.");
                    $('.tab_00.dev_cert_tab > a').focus();
                    return false;
                }

                if (!isTrans) {
                    //아이디
                    isValid = RegistValidator.prototype.CheckId();
                    if (!isValid) {
                        $('#dev_idchk').focus();
                        return false;
                    }
                }

                //비밀번호
                isValid = RegistValidator.prototype.CheckPwd();
                if (!isValid) {
                    $('#dev_pwd1').focus();
                    return false;
                }
                //비밀번호확인
                isValid = RegistValidator.prototype.CheckPwd2();
                if (!isValid) {
                    $('#dev_pwconfirm').focus();
                    return false;
                }

                if (!isTrans) {
                    //전화번호
                    isValid = RegistValidator.prototype.CheckCPhone();
                    if (!isValid) {
                        $('#Phone1').focus();
                        return false;
                    }
                }

                if (!isTrans) {
                    //이메일
                    isValid = RegistValidator.prototype.CheckEmail();
                    if (!isValid) {
                        $('#dev_M_Email').focus();
                        return false;
                    }
                    var emailProvider = $("#dev_mail_etc").val();

                    if (emailProvider.toLowerCase().indexOf("netian.") > -1) {
                        alert("netian 메일은 종료된 메일서비스로 알바몬에서 사용하실 수 없습니다.");
                        $("#dev_mail_etc").focus();
                        return false;
                    } else if (emailProvider.toLowerCase().indexOf("orgio.") > -1) {
                        alert("orgio 메일은 종료된 메일서비스로 알바몬에서 사용하실 수 없습니다.");
                        $("#dev_mail_etc").focus();
                        return false;
                    } else if (emailProvider.toLowerCase().indexOf("sayclub.") > -1) {
                        alert("sayclub 메일은 서비스가 종료된 상태로 알바몬에서 사용하실 수 없습니다. 다른 메일을 입력해 주세요.");
                        $("#dev_mail_etc").focus();
                        return false;
                    } else if (emailProvider.toLowerCase().indexOf("yahoo.") > -1) {
                        alert("yahoo 메일은 발송이 원활하지 않으므로 다른 메일 주소를 입력해 주세요.");
                        $("#dev_mail_etc").focus();
                        return false;
                    }
                }



                //사업자등록번호
                var regnum = RegistWriteCorp.getCorpRegNum();
                if ($('#dev_corporateRegNumChkStat').val() == "0") {
                    RegistValidator.prototype.CheckCorporateRegNum(regnum);
                    $('#CorporateRegistrationNumber1').focus();
                    return false;
                }

                isValid = RegistWriteCorp.checkLengthCorpRegNum(regnum)
                if (!isValid) {
                    RegistValidator.prototype.CheckCorporateRegNum(regnum);
                    $('#CorporateRegistrationNumber1').focus();
                    return false;
                }

                var cname = $('#CName').val();
                var id = $('#dev_idchk').val();
                var mail = $('#dev_M_Email').val() + "@" + $('#dev_mail_etc').val();
                var phone = $("#PhoneFull").val();
                var ipinCertPhoneNo = $('#MobileNo1').val() + $('#MobileNo2').val() + $('#MobileNo3').val();
                var certResult = core.auth.certifyCorpRegNum(regnum, cname, id, mail, phone, ipinCertPhoneNo);

                if (certResult.ResultCode == -101 || certResult.ResultCode == -3) {
                    return false;
                }

                $('#dev_corporateRegNumChkStat').val(certResult.ResultCode);
                isValid = RegistValidator.prototype.CheckCorporateRegNum(regnum);
                if (!isValid) {
                    $('#CorporateRegistrationNumber1').focus();
                    return false;
                }

                if (!isTrans) {
                    //회사/점포명
                    isValid = RegistValidator.prototype.CheckCName();
                    if (!isValid) {
                        $('#CName').focus();
                        return false;
                    }

                    //대표자명
                    isValid = RegistValidator.prototype.CheckCBossName();
                    if (!isValid) {
                        $('#CorporateBossName').focus();
                        return false;
                    }
                }

                //회사/점포 주소
                isValid = RegistValidator.prototype.CheckAddress();
                if (!isValid) {
                    $('#btn_searchAddress').focus();
                    return false;
                }

                return true;

            }

        };

        var RegistWriteSocial = {
            init: function () {
                var $birthDay = $('#dev_born_day').data('birthday');
                if ($birthDay != "") {
                    core.reg.dayBind($birthDay);
                }

                $('#gnb > h1 > a > img').bind('click', function () {
                    $(this).parent().prop("href", "javascript:void(0);");
                    if (confirm("메인으로 이동 시 입력하신 정보 일부가 초기화 될 수 있습니다. 정말 이동하시겠습니까?")) {
                        location.href = "/";
                    }
                });

                // 비밀번호 레이어 클릭 바인딩
                $('#dev_pwd_help_icon').bind('click', function () {
                    var $target = $('#dev_pwd_help_tooltip');
                    $target.css('display') == 'none' ? $target.show() : $target.hide();
                });

                // 개인정보 유효기간 선택 레이어 바인딩
                $('#dev_valid_day_help_icon').bind('click', function () {
                    var $target = $('#dev_valid_day_help_tooltip');
                    $target.css('display') == 'none' ? $target.show() : $target.hide();
                });

                // 레이어 안내창 닫기 바인딩
                $('.btnClose a').bind('click', function (e) {
                    e.preventDefault();
                    $(this).parents('.tooltip').hide();
                });

                // 생년월일 선택 바인딩
                $('#dev_born_month').bind('change', function () {
                    core.reg.dayBind();
                });

                // 생년월일 변경 바인딩
                $('#dev_born_year, #dev_born_month, #dev_born_day').bind('change', function () {
                    RegistValidator.prototype.CheckBirth();
                });

                // 성별 선택 바인딩
                $('input:radio[name=Gender]').bind('change', function () {
                    $('#txtGender').html("");
                });

                // 메일선택 바인딩
                $('#dev_mail_etc').bind('change', function () {
                    core.reg.emailChk1();
                });
                $('#dev_email_Cp').bind('change', function () {
                    core.reg.emailChk2();
                    RegistValidator.prototype.CheckEmail();
                });
                $('#dev_M_Email, #dev_mail_etc').bind('keyup change', function () {
                    RegistValidator.prototype.CheckEmail();
                });

                // 휴대폰번호 숫자만 입력가능하게 처리
                $('#dev_hphone2, #dev_hphone3').bind('keyup change', function () {
                    $(this).val($(this).val().replace(/[^0-9]/gi, ""));
                    RegistValidator.prototype.CheckPhone();
                });
                // 인증번호 숫자만 입력가능하게 처리
                $('#dev_CertNo').bind('keyup change', function () {
                    $(this).val($(this).val().replace(/[^0-9]/gi, ""));
                });

                // 인증번호 받기 클릭 바인딩
                $('#btnCert').bind('click', function () {
                    if ($('#dev_certChkStat').val() == "Y") return false;
                    $('#dev_certChkStat').val('N');
                    if (core.reg.checkForm()) {
                        core.auth.getCertSms();
                    }
                });

                // 인증확인 버튼 클릭 바인딩
                $('#btnCertSubmit').bind('click', function () {
                    if ($('#dev_certChkStat').val() == "Y") return false;
                    core.auth.certComfirm();
                });

                // 시/도 선택 바인딩
                $('#Duty_Si_Code').bind('change', function () {
                    var sicode = this.value;
                    RegistWriteSocial.createGuCodeList(sicode);
                    RegistValidator.prototype.CheckMAddress();
                });

                // 시/군/구 선택 바인딩
                $('#Duty_Gu_Code').bind('change', function () {
                    var gucode = this.value;
                    RegistWriteSocial.createDongCodeList(gucode);
                    RegistValidator.prototype.CheckMAddress();
                });

                // 시/군/구 선택 바인딩
                $('#Duty_Dong_Code').bind('change', function () {
                    RegistValidator.prototype.CheckMAddress();
                });

                // 가입하기 클릭 바인딩
                $('#btn_submit').bind('click', function (e) {
                    e.preventDefault();
                    // 유효성 체크
                    var submitAlert = RegistValidator.prototype.SubmitAlertSocial();

                    if (!submitAlert) {
                        return submitAlert;
                    } else {
                        $('#frm-reg').attr('action', '/account/regist/AddProc');
                        RegistWrite.prototype.submit();
                    }

                    $("#boxJoinConfirm").hide();
                });

                if ($('#historyCert').val() == 'Y' && $('#dev_certChkStat').val() == "Y" && $('#dev_cert_idx').val() != "") {
                    $('#dev_hphone1, #dev_hphone2, #dev_hphone3, #dev_CertNo').attr('disabled', true);
                    $('#txtCert').removeClass("txtN").addClass("txtY").html("휴대폰 인증이 완료되었습니다.");
                }
            },
            createGuCodeList: function (sicode) {
                var codes = $.grep(GuCode, function (item, index) {
                    return item.SI_Code == sicode;
                });
                var $guCombo = $('#Duty_Gu_Code');

                var optionHtml = '<option value="">시&#183;군&#183;구</option>';

                $.each(codes, function (index, item) {
                    if (item.Gu_Code != sicode) {
                        optionHtml += '<option value="' + item.Gu_Code + '">' + item.Gu_Name + '</option>';
                    }
                });
                $guCombo.html(optionHtml);
                RegistWriteSocial.createDongCodeList('');
            },
            createDongCodeList: function (gucode) {
                var codes = [];

                if (gucode != '') {
                    codes = $.grep(DongCode, function (item, index) {
                        return item.Dong_Code.substr(0, 4) == gucode;
                    });
                }

                var $dongCombo = $('#Duty_Dong_Code');

                var optionHtml = "";
                optionHtml = '<option value="">동&#183;읍&#183;면</option>';
                if (codes.length > 0) {
                    $.each(codes, function (index, item) {
                        var code = item.Dong_Code;
                        if (code != (gucode + '0000')) {
                            optionHtml += '<option value="' + code + '">' + item.Dong_Name + '</option>';
                        }
                    });
                }

                $dongCombo.html(optionHtml);
                $dongCombo.change();
            }
        };

        //---------------------------------
        // subtext_info 유효성검사 객체
        //---------------------------------
        var RegistValidator = function () {
            var root = this;

            var vars = {
                timerUserIDChk: null,
                timerUserPWChk: null,
                timerUserPWChk2: null,
                timerName: null,
                chkPWStr: null,
                chkPWStr2: null,
                chkName: null
            };

            // 아이디 포커스 in/out 바인딩
            $('#dev_idchk').bind('focus', function () {
                window.clearInterval(vars.timerUserIDChk);
                vars.timerUserIDChk = window.setInterval(function () {
                    RegistValidator.prototype.CheckId();
                }, 400);
            }).bind('blur', function () {
                setTimeout(function () {
                    window.clearInterval(vars.timerUserIDChk);
                }, 500);
            });

            // 비밀번호 포커스 in/out 바인딩
            $('#dev_pwd1').bind('focus', function () {
                window.clearInterval(vars.timerUserPWChk);
                vars.timerUserPWChk = window.setInterval(function () {
                    var pw_val = $("#dev_pwd1").val();
                    if (vars.chkPWStr != pw_val) {
                        vars.chkPWStr = pw_val;
                        RegistValidator.prototype.CheckPwd();
                    }
                }, 100);
            }).bind('blur', function () {
                setTimeout(function () {
                    window.clearInterval(vars.timerUserPWChk);
                }, 200);
            });

            // 비밀번호 확인 포커스 in/out 바인딩
            $('#dev_pwconfirm').bind('focus', function () {
                window.clearInterval(vars.timerUserPWChk2);
                vars.timerUserPWChk2 = window.setInterval(function () {
                    var pw_val = $("#dev_pwconfirm").val();
                    if (vars.chkPWStr2 != pw_val) {
                        vars.chkPWStr2 = pw_val;
                        RegistValidator.prototype.CheckPwd2();
                    }
                }, 100);
            }).bind('blur', function () {
                setTimeout(function () {
                    window.clearInterval(vars.timerUserPWChk2);
                }, 200);
            });

            // 이름 포커스 in/out 바인딩
            $('#dev_u_name').bind('focus', function () {
                window.clearInterval(vars.timerName);
                vars.timerName = window.setInterval(function () {
                    var val = $("#dev_u_name").val();
                    if (vars.chkName != val) {
                        vars.chkName = val;
                        RegistValidator.prototype.CheckName();
                    }
                }, 100);
            }).bind('blur', function () {
                setTimeout(function () {
                    window.clearInterval(vars.timerName);
                }, 200);
            });
        };

        // 가입하기 전 유효성 체크
        RegistValidator.prototype.SubmitAlert = function () {
            var $boxJoinConfirm = $("#boxJoinConfirm");

            var rpwd = RegistValidator.prototype.CheckPwd();
            var rpwd2 = RegistValidator.prototype.CheckPwd2();
            var rname = RegistValidator.prototype.CheckName();
            var rbirth = RegistValidator.prototype.CheckBirth();
            var rgender = RegistValidator.prototype.CheckGender();
            var remail = RegistValidator.prototype.CheckEmail();
            var raddr = RegistValidator.prototype.CheckMAddress();
            if ($('#dev_certChkStat').val() == "Y" && $('#dev_cert_idx').val() != "") {
                var rphone = true;
            } else {
                var rphone = RegistValidator.prototype.CheckPhone();
            }

            if ($("#dev_idchkStat").val() != "Y") {
                $boxJoinConfirm.show();
                $('#dev_idchk').focus();
                return false;
            }
            if (rpwd == false) {
                $boxJoinConfirm.show();
                $('#dev_pwd1').focus();
                return false;
            }
            if (rpwd2 == false) {
                $boxJoinConfirm.show();
                $('#dev_pwconfirm').focus();
                return false;
            }
            if (rname == false) {
                $boxJoinConfirm.show();
                $('#dev_u_name').focus();
                return false;
            }
            if (rbirth == false) {
                $boxJoinConfirm.show();
                $('#dev_born_year').focus();
                return false;
            }
            if (rgender == false) {
                $boxJoinConfirm.show();
                $('#sex_male').focus();
                return false;
            }
            if (remail == false) {
                $boxJoinConfirm.show();
                $('#dev_M_Email').focus();
                return false;
            }
            if (rphone == false) {
                $boxJoinConfirm.show();
                $('#dev_hphone2').focus();
                return false;
            }
            if ($('#dev_certChkStat').val() != "Y" || $('#dev_cert_idx').val() == "") {
                $('#txtCert').removeClass("txtY").html("휴대폰 인증이 필요합니다.");
                $boxJoinConfirm.show();
                return false;
            }

            if (raddr == false) {
                $boxJoinConfirm.show();
                return false;
            }

            $boxJoinConfirm.hide();
            return true;
        };

        // 가입하기 전 유효성 체크 소셜회원
        RegistValidator.prototype.SubmitAlertSocial = function () {
            var $boxJoinConfirm = $("#boxJoinConfirm");

            var rname = RegistValidator.prototype.CheckName();
            var rbirth = RegistValidator.prototype.CheckBirth();
            var rgender = RegistValidator.prototype.CheckGender();
            var remail = RegistValidator.prototype.CheckEmail();
            var raddr = RegistValidator.prototype.CheckMAddress();
            if ($('#dev_certChkStat').val() == "Y" && $('#dev_cert_idx').val() != "") {
                var rphone = true;
            } else {
                var rphone = RegistValidator.prototype.CheckPhone();
            }

            if (rname == false) {
                $boxJoinConfirm.show();
                $('#dev_u_name').focus();
                return false;
            }

            if (rbirth == false) {
                $boxJoinConfirm.show();
                $('#dev_born_year').focus();
                return false;
            }

            if (rgender == false) {
                $boxJoinConfirm.show();
                $('#sex_male').focus();
                return false;
            }

            if (remail == false) {
                $boxJoinConfirm.show();
                $('#dev_M_Email').focus();
                return false;
            }

            if (rphone == false) {
                $boxJoinConfirm.show();
                $('#dev_hphone2').focus();
                return false;
            }

            if ($('#dev_certChkStat').val() != "Y" || $('#dev_cert_idx').val() == "") {
                $('#txtCert').removeClass("txtY").html("휴대폰 인증이 필요합니다.");
                $boxJoinConfirm.show();
                return false;
            }

            if (raddr == false) {
                $boxJoinConfirm.show();
                return false;
            }

            $boxJoinConfirm.hide();
            return true;
        };

        // 아이디 체크
        RegistValidator.prototype.chkStr = "";
        RegistValidator.prototype.CheckId = function () {
            var isValid = false;
            var $target = $('#dev_idchk');
            var $info = $target.next('.compul');
            var id_val = $target.val();

            if (id_val.length == 0) {
                RegistValidator.prototype.chkStr = "";
                $info.removeClass("txtY").html('아이디를 입력해주세요.');
                //$target.focus();
                return false;
            }

            if (!core.validator.id_check(id_val) || !core.validator.isCapital(id_val) || id_val.length < 6 || id_val.length > 16) {
                RegistValidator.prototype.chkStr = "";
                $info.removeClass("txtY").html("6~16자의 영소문자, 숫자만 사용 가능합니다.");
                //$target.focus();
                return false;
            }

            if ($("#dev_idchkStat").val() == "" || RegistValidator.prototype.chkStr != id_val) {
                RegistValidator.prototype.chkStr = id_val;

                $info.removeClass("txtY").html("중복확인중 입니다..");
                $.ajax({
                    url: "/account/regist/is-exist-id",
                    type: "POST",
                    cache: false,
                    async: false,
                    dataType: "json",
                    data: {
                        memberId: id_val
                    },
                    success: function (data) {
                        if (data.idCnt == 0) {
                            $info.addClass("txtY").html("사용 가능한 아이디입니다.");
                            $("#dev_idchkStat").val("Y");
                            isValid = true;
                            //return true;
                        }
                        else {
                            $info.removeClass("txtY").html("사용 중인 아이디입니다. 다른 아이디를 입력해주세요.");
                            $("#dev_idchkStat").val("N");
                            //return false;
                        }
                    },
                    error: function () {
                        $info.removeClass("txtY").html("네트워크 오류입니다. 다시 시도해주세요.");
                        $("#dev_idchkStat").val("N");
                        //return false;
                    }
                });
            } else {
                isValid = true;
            }
            return isValid;
        };

        // 비밀번호 체크
        RegistValidator.prototype.CheckPwd = function () {
            $("#dev_chk_pwd_confirm").show();
            $('#dev_pwdchkStat').val("N");
            var pwd = $('#dev_pwd1').val();
            var pwd2 = $("#dev_pwconfirm").val();

            var chk = core.validator.checkPwd('show', 'dev_pwd1', 'dev_idchk', 'dev_birthcheck', null, null);   ///js/mon_password_check.js

            if (pwd2.length > 0) {
                if (pwd != pwd2) {
                    $("#dev_chk_pwd_confirm").removeClass("txtY").html("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
                    return false;
                } else {
                    $("#dev_chk_pwd_confirm").addClass("txtY").html("정상 입력 되었습니다.");
                    $('#dev_pwdchkStat').val("Y");
                }
            }

            return chk;
        };

        // 비밀번호 확인 체크
        RegistValidator.prototype.CheckPwd2 = function () {
            $("#dev_chk_pwd_confirm").show();
            $('#dev_pwdchkStat').val("N");
            var $target = $('#dev_pwconfirm');
            var pwd = $target.val();

            if (pwd.length == 0) {
                $("#dev_chk_pwd_confirm").removeClass("txtY").html("비밀번호 확인을 입력해주세요.");
                return false;
            }

            if (pwd != $("#dev_pwd1").val()) {
                $("#dev_chk_pwd_confirm").removeClass("txtY").html("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
                return false;
            }

            $("#dev_chk_pwd_confirm").addClass("txtY").html("정상 입력 되었습니다.");
            $('#dev_pwdchkStat').val("Y");

            return true;
        };

        // 이름 체크
        RegistValidator.prototype.CheckName = function () {
            var $target = $('#dev_u_name');
            var $info = $target.next('.compul');
            var name_val = $target.val();
            $('#dev_namechkStat').val("N");
            if (name_val.length == 0 || name_val.replace(/ /gi, "").length == 0) {
                $info.removeClass("txtY").html('이름을 입력해주세요.');
                $target.focus();
                return false;
            }
            // 한글12자, 영문24자이면 core.validator.getStringLength 함수이용.( > 24)
            // console.log("common : " + core.validator.getStringLength(name_val));
            // console.log("name_val : " + name_val.length);
            if (!core.validator.str_check4(name_val) || name_val.length < 2 || name_val.length > 12 || name_val.replace(/ /gi, "").length < 2) {
                $info.removeClass("txtY").html('2~12자의 한글, 영문만 사용 가능합니다.');
                $target.focus();
                return false;
            }

            $info.addClass("txtY").html("");
            $('#dev_namechkStat').val("Y");
        };

        // 생년월일 체크
        RegistValidator.prototype.CheckBirth = function () {
            var $info = $('#txtBirth');
            $('#dev_birthChkStat').val("N");

            if ($('#dev_born_year').val() == "" || $('#dev_born_month').val() == "" || $('#dev_born_day').val() == "" || $('#dev_born_day').val() == null) {
                $info.removeClass("txtY").html("생년월일을 입력해주세요.");
                return false;
            };

            // 만15세 미만 체크
            var today = new Date();
            var nowMM = ("0" + today.getMonth()); nowMM = nowMM.substr(nowMM.length - 2, nowMM.length);
            var nowDD = ("0" + today.getDate()); nowDD = nowDD.substr(nowDD.length - 2, nowDD.length);

            var chkday = new Date(today.getFullYear() - 15, parseInt(nowMM), parseInt(nowDD));
            var chkdayMM = ("0" + (chkday.getMonth() + 1)); chkdayMM = chkdayMM.substr(chkdayMM.length - 2, chkdayMM.length);
            var chkdayDD = ("0" + chkday.getDate()); chkdayDD = chkdayDD.substr(chkdayDD.length - 2, chkdayDD.length);
            var chkdayStr = chkday.getFullYear().toString() + chkdayMM + chkdayDD;
            var born = $('#dev_born_year').val() + $('#dev_born_month').val() + $('#dev_born_day').val();
            if (born > chkdayStr) {
                $info.removeClass("txtY").html("만 15세 미만은 근로기준법 제64조에 근거, 취업이 불가하여 본 사이트에 가입 하실 수 없습니다. <span style='color:#494949'>만 13세 이상 15세 미만인 경우 취직인허증과 부모님 동의서를 보내주시면 가입이 가능하도록 처리해드립니다. 자세한 사항은 고객센터로 문의해 주시기 바랍니다.<br/>(Tel : 1588-9351, 이메일 : helpdesk@albamon.com)</span>");
                return false;
            }

            $info.addClass("txtY").html("");
            $('#dev_birthChkStat').val("Y");
            return true;
        };

        // 성별 체크
        RegistValidator.prototype.CheckGender = function () {
            var $info = $('#txtGender');
            if ($('input:radio[name=Gender]:checked').length == 0) {
                $info.removeClass("txtY").html("성별을 선택해주세요.");
                return false;
            }
            return true;
        };

        // 이메일 체크
        RegistValidator.prototype.CheckEmail = function () {
            var $info = $('#txtEmail');
            $('#dev_mailChkStat').val("N");

            if ($('#dev_M_Email').val() == "" || $('#dev_mail_etc').val() == "") {
                $info.removeClass("txtY").html("이메일을 입력해주세요.");
                return false;
            }

            if (core.validator.mail_check_sp($('#dev_M_Email').val())) {
                if (!core.validator.mail_check('@' + $('#dev_mail_etc').val())) {
                    $info.removeClass("txtY").html("이메일을 올바르게 입력해주세요.");
                    return false;
                };
            } else {
                $info.removeClass("txtY").html("이메일을 올바르게 입력해주세요.");
                return false;
            }

            var regExp = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z_])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
            var chkEmail = $.trim($("#dev_M_Email").val()) + "@" + $.trim($("#dev_mail_etc").val());
            if (chkEmail.match(regExp) == null) {
                $info.removeClass("txtY").html("이메일을 올바르게 입력해주세요.");
                return false;
            }

            $info.addClass("txtY").html("");
            $('#dev_mailChkStat').val("Y");
            return true;
        };

        // 휴대폰번호 체크
        RegistValidator.prototype.CheckPhone = function () {
            var $info = $('#txtCert');
            $('#dev_phoneChkStat').val("N");

            if ($('#dev_hphone2').val() == "" || $('#dev_hphone3').val() == "") {
                $info.removeClass("txtY").html("휴대폰 번호를 입력해주세요.");
                return false;
            }
            if ($('#dev_hphone2').val().length < 3 || $('#dev_hphone3').val().length < 4 || !core.validator.check_number($('#dev_hphone2').val()) || !core.validator.check_number($('#dev_hphone3').val())) {
                $info.removeClass("txtY").html("휴대폰 번호를 올바르게 입력해주세요.");
                return false;
            };

            $info.addClass("txtY").html("");
            $('#dev_phoneChkStat').val("Y");
            return true;
        };

        // 개인회원주소 체크
        RegistValidator.prototype.CheckMAddress = function () {
            var $info = $('#txtMAddr');
            var $siCode = $('#Duty_Si_Code');
            var $guCode = $('#Duty_Gu_Code');
            if ($guCode == null) $guCode = "";
            var $dongCode = $('#Duty_Dong_Code');
            if ($dongCode == null) $dongCode = "";
            var result = true;
            var target = $('#Duty_Si_Code, #Duty_Gu_Code, #Duty_Dong_Code');
            $('#dev_mAddrChkStat').val("N");

            if ($siCode.val() == "") {
                target = $siCode;
                result = false;
            } else {
                if ($guCode.val() == "") {
                    target = $guCode;
                    result = false;
                } else {
                    if ($dongCode.val() == "") {
                        target = $dongCode;
                        result = false;
                    }
                }
            }

            if (!result) {
                $info.removeClass("txtY").html('주소를 선택해주세요.');
                target.focus();
                return false;
            }

            $info.addClass("txtY").html("");
            $('#dev_mAddrChkStat').val("Y");
            return true;
        };

        // 사업자등록번호 체크
        RegistValidator.prototype.CheckCorporateRegNum = function (regnum) {
            var $info = $('#txtCRegNum');
            var stat = $('#dev_corporateRegNumChkStat').val();
            var message = $('#dev_corporateRegNumChkMessage').val();

            if (regnum == "") {
                $info.removeClass("txtY").html("사업자등록번호 입력 후 [확인]을 눌러 기업인증을 진행하세요.");
                return false;
            }
            else if (!RegistWriteCorp.checkLengthCorpRegNum(regnum)) {
                $info.removeClass("txtY").html("올바르지 않은 사업자등록번호입니다.");
                return false;
            }

            if (regnum.substr(0, 3) <= 99) {
                $info.removeClass("txtY").html("올바르지 않은 사업자등록번호입니다.");
                return false;
            }

            if (stat == 1 || stat == 100) {
                //성공
                $info.addClass("txtY").html("등록 가능합니다.<br>가입 후, 사업자등록번호/회사명을 변경하시려면 사업자등록증을 보내주셔야 합니다.");
                return true;
            } else if (stat == 0) {
                //확인 버튼 클릭 안함
                $info.removeClass("txtY").html("사업자등록번호 입력 후 [확인]을 눌러 기업인증을 진행하세요.");
                return false;
            } else if (stat == -3) {
                //가입불가
                $info.removeClass("txtY").html("가입할 수 없는 사업자등록번호입니다.");
                return false;
            } else if (stat == -4) {
                //invalid
                $info.removeClass("txtY").html("올바르지 않은 사업자등록번호입니다.");
                return false;
                //NICE평가정보에 등록되지 않은 사업자등록번호입니다.
            } else if (stat == -5) {
                //invalid but pass
                //$info.removeClass("txtY").html("NICE평가정보에 등록되지 않은 사업자등록번호입니다.");
                $info.addClass("txtY").html("등록 가능합니다.<br>가입 후, 사업자등록번호/회사명을 변경하시려면 사업자등록증을 보내주셔야 합니다.");
                return true;
                //
            } else if (stat == -101) {
                //invalid but pass
                return false;
                //
            } else {
                //default
                $info.removeClass("txtY").html("사업자등록번호 입력 후 [확인]을 눌러 기업인증을 진행하세요.");
                return false;
            }
        };

        // 기업명체크
        RegistValidator.prototype.CheckCName = function () {
            var isValid = false;
            var $target = $('#CName');
            var $info = $('#txtCName');
            var name_val = $.trim($target.val());
            $('#dev_cNamechkStat').val("N");
            if (name_val.length == 0) {
                $info.removeClass("txtY").html('회사명을 입력해 주세요.');
            } else if (name_val.length > 25) {
                $info.removeClass("txtY").html('회사명을 25자 내로 입력해 주세요.');
            }
            else {
                if (core.validator.subject_check(name_val)) {
                    //$target.val(name_val);
                    isValid = true;
                } else {
                    $info.removeClass("txtY").html("회사명에 - + # ( ) [ ] % & , . ' ㈜ ㈔ / 이외의 \n\n특수문자는 입력하실 수 없습니다.");
                }
            }

            if (isValid) {
                $info.addClass("txtY").html("");
                $('#dev_cNamechkStat').val("Y");
            }
            return isValid;
        };

        // 대표자명체크
        RegistValidator.prototype.CheckCBossName = function () {
            var $target = $('#CorporateBossName');
            var $info = $target.next('#txtCBossName');
            var name_val = $.trim($target.val());
            $('#dev_bossNamechkStat').val("N");
            if (name_val.length == 0) {
                $info.removeClass("txtY").html('대표자명을 입력해주세요.');
                return false;
            } else if (name_val.length > 20) {
                $info.removeClass("txtY").html('대표자명을 20자 내로 입력해주세요.');
                return false;
            }

            $info.addClass("txtY").html("");
            $('#dev_bossNamechkStat').val("Y");
            return true;
        };

        // 회사주소 체크
        RegistValidator.prototype.CheckAddress = function () {
            var $target = $('#Full_Addr');
            var $info = $target.next('#txtAddr');
            var name_val = $.trim($target.val());

            var zipCode = "", addrText = "", addrText1 = "";
            zipCode = $.trim($('#ZipCode').val());
            addrText = $.trim($('#Addr_Text').val());
            addrText1 = $.trim($('#Addr_Text1').val());
            $('#dev_addrchkStat').val("N");
            if (zipCode.length == 0 || addrText.length == 0 || addrText1.length == 0) {
                $info.removeClass("txtY").html('회사/점포주소를 입력해 주세요.');
                return false;
            }

            $info.addClass("txtY").html("");
            $('#dev_addrchkStat').val("Y");
            return true;
        };

        // 기업 전화 번호 체크
        RegistValidator.prototype.CheckCPhone = function () {
            var isValid = false;
            var $info = $('#txtPhone');
            $('#dev_phoneChkStat').val("N");
            var phone1 = "", phone2 = "", phone3 = "";
            phone1 = $("#Phone1").val();
            phone2 = $("#Phone2").val();
            phone3 = $("#Phone3").val();
            $("#PhoneFull").val("");

            if (phone1 == "selfInput") {
                if ($("#dev_phone_selfInput").val() == "") {
                    $info.removeClass("txtY").html("전화번호/휴대폰번호를 입력해주세요.");
                    $("#dev_phone_selfInput").focus();
                } else {
                    if (!core.validator.checkPhoneSelf($("#dev_phone_selfInput").val())) {
                        $info.removeClass("txtY").html("전화번호/휴대폰번호를 숫자, +, - 를 이용해서 입력해 주세요.");
                        $("#dev_phone_selfInput").focus();
                    } else {
                        $("#PhoneFull").val($("#dev_phone_selfInput").val());
                        isValid = true;
                    }
                }
            } else {
                if (phone1 == "" || phone2 == "" || phone3 == "") {
                    $info.removeClass("txtY").html("전화번호/휴대폰번호를 입력해주세요.");
                    //$("#Phone1").focus();
                } else {
                    if ((core.validator.check_number(phone2) == false) || (core.validator.check_number(phone3) == false)) {
                        $info.removeClass("txtY").html("전화번호/휴대폰번호를 숫자로 입력해 주세요.");
                        //$("#Phone1").focus();
                    } else {
                        if ((phone2.length >= 3) && (phone3.length == 4)) {
                            if (phone1 == "n") {
                                $("#PhoneFull").val(phone2 + "-" + phone3);
                            } else {
                                $("#PhoneFull").val(phone1 + "-" + phone2 + "-" + phone3);
                            }
                            isValid = true;
                        }
                        else {
                            $info.removeClass("txtY").html("전화번호/휴대폰번호 형식이 잘못되었습니다. 다시 입력하여 주세요.");
                            //$("#Phone1").focus();
                            $("#PhoneFull").val("")
                        }
                    }
                }
            }

            if (isValid) {
                $('#dev_phoneChkStat').val("Y");
                $info.addClass("txtY").html("");
            }
            return isValid;
        };

        return {
            registWrite: RegistWrite,
            registWriteCorp: RegistWriteCorp,
            registWriteSocial: RegistWriteSocial,
            registValidator: RegistValidator
        };
    })());
})(this);