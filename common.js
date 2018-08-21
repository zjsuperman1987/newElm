//Ĭ�Ϸֱ�������
var UA = navigator.userAgent,
	isIos = /(iPhone|iPad|iPod|iOS)/i.test(UA) && !isAndroid, // ���ֹ�����UA��ͬʱ���� android iphone �ַ�
	isIphone = /(iPhone|iPod)/i.test(UA),
	isAndroid = /(Android)/i.test(UA),
	isWeixin = /(MicroMessenger)/i.test(UA),
// isAppcan = /(Appcan)/i.test(UA),
//isAppcan=(window.parent.uexDevice==null),
	sw = screen.width,
	sh = screen.height,
	cw = document.documentElement.clientWidth,
	ch = document.documentElement.clientHeight,
	isLandscape = sw > sh ? 1 : 0;
(function (doc, win) {
    docEl = doc.documentElement,
		resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
		recalc = function () {
		    //var clientWidth = docEl.clientWidth;
		    if (isIphone) {
		        clientWidth = Math.min(sw, sh, cw, 414)
		    } else if (isAndroid) {
		        clientWidth = Math.min(sw, sh, cw, 360)
		    } else {
		        clientWidth = Math.min(sw, sh, cw, 480)
		    }
		    if (!clientWidth) return;
		    localStorage.setItem("fontSize", clientWidth);
		    docEl.style.fontSize = 100 * (clientWidth / 320) + 'px';
		};
    if (!doc.addEventListener) return;
    win.addEventListener(resizeEvt, recalc, false);
    doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);

var $$ = function (selector) {
    return document.querySelector(selector);
}
var $$$ = function (selector) {
    return document.querySelectorAll(selector);
}

//----------------------AJAX----------------------
PubAjax = (function () {
    return {
        post: function (BusinessType, date, successFun, errorFun, completeFunc) {
            date = date || {};
            date.voucher = sessionStorage.getItem("voucher");
            if (BusinessType) {
                date.BusinessType = BusinessType;
            }
            date.BusinessData = {};
            var result;
            $.ajax({
                type: "POST",
                url: "/Mobile/WeChat/HttpRequest.aspx",
                cache: false,
                data: date,
                dataType: "json",
                async: false,
                success: successFun,
                error: errorFun,
                complete: completeFunc
            });
        }
    }
})();

//----------------------request----------------------
PubRequest = (function () {
    return {
        Query: function (name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //����һ������Ŀ�������������ʽ����
            var r = window.location.search.substr(1).match(reg);  //ƥ��Ŀ�����
            if (r !== null) {
                return unescape(r[2]);
            }
            return ""; //���ز���ֵ
        },
        TxQuery: function (name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //����һ������Ŀ�������������ʽ����
            var r = window.location.search.substr(1).match(reg);  //ƥ��Ŀ�����
            if (r !== null) {
                return decodeURI(r[2]);
            }
            return ""; //���ز���ֵ
        }
    }
})();

//----------------------util----------------------
PubUtil = (function () {
    return {
        Set: function (array, json) {
            $.each(array, function (i, item) {
                if (!PubUtil.isEmptyObject(json)) {
                    if ($("#" + item + "").length > 0 && json.hasOwnProperty(item)) {
                        $("#" + item + "").text(json[item] == null ? '' : json[item]);
                    }
                }
            });
        },
        isEmptyObject: function (json) {
            var t;
            for (t in json)
                return !1;
            return !0
        }
    }
})();

//----------------------������ͳһ��װ----------------------
pop = (function () {
    function isDefine(para) {
        if (typeof para == "undefined" || para == "" || para == "[]" || para == null || para == undefined) {
            return false;
        } else if (typeof para == "number" || para == "number" || para == "null") {
            return true;
        } else if (para == null || para == undefined) {
            return true;
        } else {
            for (var o in para) {
                return true;
            }
            return false;
        }
    }
    return {
        notice: function (content, time) {
            //uexWindow.toast('0', '5', content, time*1000);
            var timeVal = 2;
            if (isDefine(time)) {
                timeVal = time;
            }
            //��ʾ

            layer.open({
                content: content
                , skin: 'msg'
                , time: timeVal //2����Զ��ر�
             });
        },
        confirm: function (type, title, content, cb, conditions) {
            // appcan.window.confirm({
            // title:title,
            // content:content,
            // buttons:['��','��'],
            // callback:function(err,data,dataType,optId){
            // cb(data); //data=0��ʾ��һ����ť data=1��ʾ�ڶ�����ť
            // }
            // });

            //��ʾconfirm����
            var titleDom = "";
            if (isDefine(title)) {
                titleDom = '<div class="ub ub-ac ub-pc confirmsItem confirm_min_h">' + title + '</div>';
            }
            if (type == 1) {
                var btnLeft = "ȷ��";
                if (isDefine(conditions)) {
                    btnLeft = conditions.btnLeft;
                }
                chooseTypeDom = '<div class="ub ub-ac ub-pc confirms-chooseType01 confirmBtnItem" data-index="0">' + btnLeft + '</div>';
            } else {
                var btnLeft = "��",
                btnRight = "��";
                if (isDefine(conditions)) {
                    btnLeft = conditions.btnLeft || "��";
                    btnRight = conditions.btnRight || "��";
                }
                chooseTypeDom = '<div class="ub ub-ac ub-pc confirms-chooseType01-left confirmBtnItem" data-index="0">' + btnLeft + '</div>'
                          + '<div class="ub ub-ac ub-pc confirms-chooseType01-right confirmBtnItem" data-index="1">' + btnRight + '</div>';
            }

            var $tipsDom = $('<div class="confirms">'
                        + '<div class="ub ub-ac ub-pc confirms_ub">'
                            + '<div class="ub ub-ac ub-pc ub-ver confirm_content">'
                                + titleDom
                                + '<div class="ub ub-ac ub-pc confirm_min_h content-msg confirms-padding">' + content + '</div>'
                                + '<div class="ub ub-pj confirmsItem confirm_min_h confirms-chooseType">'
                                  + chooseTypeDom
                                + '</div>'
                            + '</div>'
                        + '</div>'
                      + '</div>');
            $("body").append($tipsDom);

            //$(".scrollContent").addClass("overlay");

            //ģ�����������¼�
            if (isSML) {
                //ѡ�����¼�
                $(".confirmBtnItem").on("tap", function (e) {
                    var index = $(this).data("index");
                    // alert(index);
                    cb(index);

                    var $confirms = $(".confirms");
                    $confirms.remove();

                    e.stopPropagation(); //��ֹ�¼�ð��
                    e.preventDefault();
                })

                if (isDefine(conditions) && conditions.isAllowClose == 0) {
                    $(".confirms").on("tap", function (e) {
                        e.stopPropagation(); //��ֹ�¼�ð��
                        e.preventDefault();
                    })
                } else {
                    //�������
                    $(".confirms").on("tap", function (e) {
                        var $confirms = $(".confirms");
                        $confirms.remove();

                        e.stopPropagation(); //��ֹ�¼�ð��
                        e.preventDefault();
                    })
                }
            } else { //�ֻ���
                //ѡ�����¼�
                $(".confirmBtnItem").on("touchend", function (e) {
                    var index = $(this).data("index");
                    // alert(index);
                    cb(index);

                    var $confirms = $(".confirms");
                    $confirms.remove();

                    e.stopPropagation(); //��ֹ�¼�ð��
                    e.preventDefault();
                })

                if (isDefine(conditions) && conditions.isAllowClose == 0) {
                    //�������
                    $(".confirms").on("touchend", function (e) {
                        e.stopPropagation(); //��ֹ�¼�ð��
                        e.preventDefault();
                    })
                } else {
                    //�������
                    $(".confirms").on("touchend", function (e) {
                        var $confirms = $(".confirms");
                        $confirms.remove();

                        e.stopPropagation(); //��ֹ�¼�ð��
                        e.preventDefault();
                    })
                }


                //��ֹĬ�ϻ����¼�
                $(".confirms").on("touchmove", function (e) {
                    e.stopPropagation(); //��ֹ�¼�ð��
                    e.preventDefault();
                })
            }

        },
        loading: function (content, time) {
            // layer.open({
            // type: 2,
            // className:"layer-loading",
            // content: (content)?content:"",
            // time:(time)?time:"",
            // shade: false,
            // shadeClose:false
            // });

            var $tipsDom = $('<div class="pop-loading pop">'
                        + '<div class="ub ub-ac ub-pc popLoading-box">'
                            + '<div class="ub ub-ac ub-pc popLoading_content">'
                                + '<div class="ub ub-ac ub-pc ub-ver popLoading_img_div">'
                                    + '<div class="ub ub-ac ub-pc loading_mask-div">'
                                        + '<div class="ub">'
                                            + '<img class="popLoading_img" src="image/loading_mask2.png"/>'
                                        + '</div>'
                                    + '</div>'
                                    + '<div class="loading_wave-div loading-show">'
                                        + '<img class="loading_wave" src="image/loading_wave.jpg"/>'
                                    + '</div>'
                                + '</div>'
                            + '</div>'
                        + '</div>'
                      + '</div>');
            $("body").append($tipsDom);

            //�������
            // $(".pop").on("touchend",function(){
            // var $pop=$(".pop");
            // $pop.remove();
            // e.stopPropagation();//��ֹ�¼�ð��
            // e.preventDefault();
            // })

            //��ֹĬ�ϻ����¼�
            $(".pop").on("touchmove", function (e) {
                e.stopPropagation(); //��ֹ�¼�ð��
                e.preventDefault();
            })
        },
        close: function (popname) { //popnameΪlayer�����������
            var $pop = $(".pop");
            if (isDefine($pop)) {
                $pop.remove();
            } else {
                if (popname) {
                    layer.close(popname);
                } else {
                    layer.closeAll();
                }
            }
        }
    }
})();

//----------------------�ַ������API----------------------
PubString = (function () {
    return {
        format: function (source, opts) {
            var data = Array.prototype.slice.call(arguments, 1), toString = Object.prototype.toString;
            if (data.length) {
                data = data.length == 1 ?
                /* ie �� Object.prototype.toString.call(null) == '[object Object]' */
	    	            (opts !== null && (/\[object Array\]|\[object Object\]/.test(toString.call(opts))) ? opts : data)
	    	            : data;
                return source.replace(/\{(.+?)\}/g, function (match, key) {
                    var replacer = data[key];
                    // chrome �� typeof /a/ == 'function'
                    if ('[object Function]' == toString.call(replacer)) {
                        replacer = replacer(key);
                    }
                    return ('undefined' == typeof replacer ? '' : replacer);
                });
            }
            return source;
        }
    }
})()


//----------------------ʱ�����API----------------------
PubDate = (function () {
    return {
        datetime: function () {
            var now = new Date();

            var year = now.getFullYear();       //��
            var month = now.getMonth() + 1;     //��
            var day = now.getDate();            //��

            var hh = now.getHours();            //ʱ
            var mm = now.getMinutes();          //��

            var clock = year + "-";

            if (month < 10)
                clock += "0";

            clock += month + "-";

            if (day < 10)
                clock += "0";

            clock += day + " ";

            if (hh < 10)
                clock += "0";

            clock += hh + ":";
            if (mm < 10) clock += '0';
            clock += mm;
            return (clock);
        },
        date: function () {
            var nowDate = new Date();
            var year = nowDate.getFullYear();
            var month = nowDate.getMonth() + 1 < 10 ? "0" + (nowDate.getMonth() + 1)
              : nowDate.getMonth() + 1;
            var day = nowDate.getDate() < 10 ? "0" + nowDate.getDate() : nowDate
              .getDate();
            var dateStr = year + "-" + month + "-" + day;
            return dateStr;
        },
        diff: function (datepart, startdate, enddate) {
            if (startdate == "" || enddate == "") {
                return "";
            }
            startdate = typeof startdate == "string" ? new Date(startdate.replace(/-/g, '/')) : startdate;
            enddate = typeof enddate == "string" ? new Date(enddate.replace(/-/g, '/')) : enddate;
            var interval = enddate.getTime() - startdate.getTime(); //������
            switch (datepart.toLowerCase()) {
                case "y": return $.toInt(enddate.getFullYear() - startdate.getFullYear());
                case "m": return $.toInt((enddate.getFullYear() - startdate.getFullYear()) * 12 + (enddate.getMonth() - startdate.getMonth()));
                case "d": return $.toInt(interval / 1000 / 60 / 60 / 24);
                case "w": return $.toInt(interval / 1000 / 60 / 60 / 24 / 7);
                case "h": return $.toInt(interval / 1000 / 60 / 60);
                case "s": return $.toInt(interval / 1000);
            }
        },
        add: function (datepart, number, date, pattern) {
            if (!date) {
                return "";
            }
            if (!pattern) {
                pattern = "yyyy-MM-dd";
            }

            var dtTmp = typeof date == "string" ? new Date(date.replace(/-/g, '/')) : date;
            var newDate;
            switch (datepart) {
                case 'y': newDate = new Date((dtTmp.getFullYear() + number), dtTmp.getMonth(), dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds()); break;
                case 'm': newDate = new Date(dtTmp.getFullYear(), (dtTmp.getMonth()) + number, dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds()); break;
                case 'd': newDate = new Date(Date.parse(dtTmp) + (86400000 * number)); break;
                case 'w': newDate = new Date(Date.parse(dtTmp) + ((86400000 * 7) * number)); break;
                case 'h': newDate = new Date(Date.parse(dtTmp) + (3600000 * number)); break;
                case 's': newDate = new Date(Date.parse(dtTmp) + (1000 * number)); break;
            }
            if (pattern) {
                return PubDate.format(newDate, pattern)
            }
            return newDate;
        },
        getDaysInMonth: function (year, month) {
            month = parseInt(month, 10) + 1;
            var temp = new Date(year + "/" + month + "/0");
            return temp.getDate();
        },
        //��ʽ������
        /*
        Arguments��
        1.pattern-(sring)�� ��ʽ��ģʽ
        hh: �� 0 �������λ 12 ����ʱ��ʾ<br>
        h: ���� 0 ����� 12 ����ʱ��ʾ<br>
        HH: �� 0 �������λ 24 ����ʱ��ʾ<br>
        H: ���� 0 ����� 24 ����ʱ��ʾ<br>
        mm: �� 0 ������λ�ֱ�ʾ<br>
        m: ���� 0 ����ֱ�ʾ<br>
        ss: �� 0 ������λ���ʾ<br>
        s: ���� 0 �������ʾ<br>
        yyyy: �� 0 �������λ���ʾ<br>
        yy: �� 0 �������λ���ʾ<br>
        MM: �� 0 �������λ�±�ʾ<br>
        M: ���� 0 ������±�ʾ<br>
        dd: �� 0 �������λ�ձ�ʾ<br>
        d: ���� 0 ������ձ�ʾ
        Examples:
        var date = new Date();
        alert(PubDate.format(date,"yyyy-MM-dd HH:mm:ss"))   
        */
        format: function (date, pattern) {
            if ('string' != typeof pattern) {
                return date.toString();
            }
            function replacer(patternPart, result) {
                pattern = pattern.replace(patternPart, result);
            }
            //��Ŀ���ַ�����ǰ�油0��ʹ��ﵽҪ��ĳ���
            function pad(source, length) {
                var pre = "",
                negative = (source < 0),
                string = String(Math.abs(source));

                if (string.length < length) {
                    pre = (new Array(length - string.length + 1)).join('0');
                }

                return (negative ? "-" : "") + pre + string;
            }
            var year = date.getFullYear(),
             month = date.getMonth() + 1,
            date2 = date.getDate(),
            hours = date.getHours(),
            minutes = date.getMinutes(),
            seconds = date.getSeconds();

            replacer(/yyyy/g, pad(year, 4));
            replacer(/yy/g, pad(year.toString().slice(2), 2));
            replacer(/MM/g, pad(month, 2));
            replacer(/M/g, month);
            replacer(/dd/g, pad(date2, 2));
            replacer(/d/g, date2);

            replacer(/HH/g, pad(hours, 2));
            replacer(/H/g, hours);
            replacer(/hh/g, pad(hours % 12, 2));
            replacer(/h/g, hours % 12);
            replacer(/mm/g, pad(minutes, 2));
            replacer(/m/g, minutes);
            replacer(/ss/g, pad(seconds, 2));
            replacer(/s/g, seconds);

            return pattern;
        },
        /*�Ƚ��������ڵĴ�С
        Arguments��
        1.date1  -(string) ,����1
        2.date2 -({string}) ,����2
        3:compareNull - (bool),���ڿ�ֵʱ�Ƿ�Ƚ�
        Result:
        ���date1>date2������true�����򷵻�false;
        Examples:
        PubDate.gt('2011-02-01','2011-02-05')  //false
        */
        //���ڵ���
        isGreaterEqual: function (date1, date2, compareNull) {
            if (date1 && date2) {
                return date1 >= date2;
            } else {
                return compareNull ? false : true;
            }
        },
        //С�ڵ���
        isLessEqual: function (date1, date2, compareNull) {
            if (date1 && date2) {
                return date1 <= date2;
            } else {
                return compareNull ? false : true;
            }
        },
        //����
        isGreater: function (date1, date2, compareNull) {
            if (date1 && date2) {
                return date1 > date2;
            } else {
                return compareNull ? false : true;
            }
        },
        //С��
        isLess: function (date1, date2, compareNull) {
            if (date1 && date2) {
                return date1 < date2;
            } else {
                return compareNull ? false : true;
            }
        },
        toDate: function (date) {
            return new Date(date.replace(/-/g, '/'));
        }
    }
})()


//----------------------������صĺ���----------------------
PubNumber = (function () {
    return {
        calc: function (num1, num2, operation, round, format) {
            var fltNum1 = (num1.toString().replace(/,/g, "")); //ȥ��ǧ��λ�е�","
            var fltNum2 = (num2.toString().replace(/,/g, ""));
            fltNum1 = fltNum1 == "" ? "0" : fltNum1;
            fltNum2 = fltNum2 == "" ? "0" : fltNum2;
            if (!round) {
                round = 0
            }

            var intNum1Digit = 1, intNum2Digit = 1, intDigit = 1;   //��Ҫ�Ŵ����λ

            var blnNumber = !isNaN(fltNum1) && fltNum1 !== "" && !isNaN(fltNum2) && fltNum2 !== ""; //�ж��Ƿ�����ֵ�������ַ��ܵ���ֵ
            if (blnNumber) {
                if (fltNum2 == 0 && operation == "/") {
                    return 0
                }

                var returnValue;
                if (fltNum1.indexOf(".") > 0) {
                    intNum1Digit = Math.pow(10, fltNum1.length - fltNum1.indexOf(".") - 1); //��1��Ҫ�Ŵ����С��λ
                }
                if (fltNum2.indexOf(".") > 0) {
                    intNum2Digit = Math.pow(10, fltNum2.length - fltNum2.indexOf(".") - 1); //��2��Ҫ�Ŵ����С��λ
                }
                if (operation == '*') {
                    intDigit = intNum1Digit * intNum2Digit;
                    num1 = PubNumber.round(parseFloat(fltNum1) * intNum1Digit);   //�Ŵ��������������
                    num2 = PubNumber.round(parseFloat(fltNum2) * intNum2Digit);
                }
                else {
                    intDigit = Math.max(intNum1Digit, intNum2Digit);
                    num1 = PubNumber.round(parseFloat(fltNum1) * intDigit);   //�Ŵ��������������
                    num2 = PubNumber.round(parseFloat(fltNum2) * intDigit);
                }

                switch (operation) {
                    case '+':
                        returnValue = (num1 + num2) / intDigit;
                        break;
                    case '-':
                        returnValue = (num1 - num2) / intDigit;
                        break;
                    case '*':
                        returnValue = (num1 * num2) / intDigit;
                        break;
                    case '/':
                        returnValue = num1 / num2;
                        break;
                    default:
                        throw new Error("calcDoubleFixֻ֧�ּӼ��˳�����");
                }
                //����6λС��λ����ָ����ʽ��ʾ
                if (round < 6) {
                    var pow = Math.pow(10, round);
                    returnValue = PubNumber.round(returnValue * pow) / pow;
                } else {
                    returnValue = PubNumber.round(returnValue * 1000000) / 1000000;
                }
                return format ? PubNumber.format(returnValue, round, true) : returnValue;
            }
            else {
                throw new Error("calcDoubleFix��֧���ַ����ĳ˳�������");
            }
        },
        //��������
        round: function (dec, decimals) {
            dec = $.toNum(dec);
            var step;
            var temp;

            dec = Math.round(dec * 100000000) / 100000000;

            if (dec == 0) {
                return dec;
            }
            else {
                temp = Math.abs(dec);
                if (decimals == 0 || decimals == undefined) {
                    temp = Math.round(temp);
                }
                else if (decimals > 0) {
                    step = Math.pow(10, decimals);
                    temp = Math.round(temp * step) / step;
                }

                if (dec > 0) { dec = temp; }
                else { dec = -temp; }
            }
            return dec;
        },
        /** 
        * ����ֵ����������ʽ��. 
        * 
        * @param num ��ֵ(Number����String) 
        * @param cent Ҫ������С��λ(Number) 
        * @param isThousand �Ƿ���Ҫǧ��λ 0:����Ҫ,1:��Ҫ(��ֵ����); 
        * @return ��ʽ���ַ���,��'1,234,567.45' 
        * @type String 
        */
        format: function (num, cent, isThousand) {
            num = num.toString().replace(/\$|\,/g, '');
            cent = !cent ? 2 : cent;
            isThousand = isThousand == 0 ? 0 : 1;

            // ��鴫����ֵΪ��ֵ����   
            if (isNaN(num)) {
                num = "0";
            }

            // ��ȡ����(��/����)   
            sign = (num == (num = Math.abs(num)));

            num = Math.floor(num * Math.pow(10, cent) + 0.50000000001);  // ��ָ����С��λ��ת��������.�����С��λ��������   
            cents = num % Math.pow(10, cent);              // ���С��λ��ֵ   
            num = Math.floor(num / Math.pow(10, cent)).toString();   // �������λ��ֵ   
            cents = cents.toString();               // ��С��λת�����ַ���,�Ա���С��λ����   

            // ����С��λ��ָ����λ��   
            while (cents.length < cent)
                cents = "0" + cents;

            if (isThousand) {
                // ���������ֽ���ǧ��λ��ʽ��.   
                for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
                    num = num.substring(0, num.length - (4 * i + 3)) + ',' + num.substring(num.length - (4 * i + 3));
            }

            if (cent > 0)
                return (((sign) ? '' : '-') + num + '.' + cents);
            else
                return (((sign) ? '' : '-') + num);
        },
        /** 
        * ��ǧ��λ��ʽ�������ַ���ת��Ϊ������ 
        * @public 
        * @param string sVal ��ֵ�ַ��� 
        * @return float 
        */
        unformat: function (sVal) {
            var fTmp = parseFloat(sVal.replace(/,/g, ''));
            return (isNaN(fTmp) ? 0 : fTmp);
        }
    }
})();
 