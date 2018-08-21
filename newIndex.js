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
                url: "/Mobile/WeChat/IndexPage.aspx",
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

window.onload = function () {
    initControl.initSearchBottomCustomer();
    initControl.initCarouselCustomer();
    initControl.initCarouselImg();
    initControl.initCustomerList();
    initControl.clickSeach();
    initControl.initSort();
    initControl.initScroll();
    //    position.isGetLocation();
}

var initControl = (function () {
    var IndexFilter = "�ۺ�����";   // ��������
    var count = 1;   //��ʼ������ λ��

    return {
        //��ʼ���������ײ��̼�
        initSearchBottomCustomer: function () {

        },
        //��ʼ���ֲ��̼�  
        initCarouselCustomer: function () {

            PubAjax.post("selectCaouselCustomer", {}, function (result) {
                $.each(result.carouselCustomerList, function (i, item) {
                    if (i < 10) {
                        $('.swiperCustomer .swiper-slide').eq(0).append(
                             '<div class="scFormat" data-contractguid=' + item.contractGUID + '>' +
                                '<div class="srFormat_top">' +
                                    '<img src="../../_image/Login.jpg" />' +
                                '</div>' +
                                '<div class="srFormat_bottom">' +
                                    '<span>' + item.BrandName + '</span>' +
                                '</div>' +
                            '</div>'
                        )
                    } else {
                        $('.swiperCustomer .swiper-slide').eq(1).append(
                            '<div class="scFormat" data-contractguid=' + item.contractGUID + '>' +
                                '<div class="srFormat_top">' +
                                    '<img src="../../_image/Login.jpg" />' +
                                '</div>' +
                                '<div class="srFormat_bottom">' +
                                    '<span>' + item.BrandName + '</span>' +
                                '</div>' +
                            '</div>'
                        )
                    }
                })
            })

            var swiperCustomer = new Swiper(".swiperCustomer", {
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                    bulletClass: 'change_bulletClass',
                    bulletActiveClass: 'change_bulletActiveClass'
                }
            })
        },
        //��ʼ���ֲ�ͼƬ
        initCarouselImg: function () {
            var swiperImg = new Swiper('.swiperImg', {
                spaceBetween: 30,
                centeredSlides: true,
                autoplay: {
                    delay: 2500,
                    disableOnInteraction: false
                },
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                    bulletClass: 'change_bulletClass',
                    bulletActiveClass: 'change_bulletActiveClass'
                }
            });
        },
        //��ʼ���̼��б�
        initCustomerList: function (count) {
            PubAjax.post("selectCustomerListInfo", {
                startPosition: count,
                Filter: IndexFilter,
                lng: sessionStorage.getItem("lat"),
                lat: sessionStorage.getItem("lng")
            }, function (result) {
                //ɾ�� �ȴ� icon
                window.setTimeout(function () { $('.loaderWrapper').remove(); }, 500)

                $.each(result.customerList, function (i, item) {
                    $('.customerListWrapper').append(
                        '<div class="customerList" data-contractguid=' + item.ContractGUID + '>' +
                            '<div class="cl_left">' +
                                '<img src="../../_image/Login.jpg" />' +
                            '</div>' +
                            '<div class="cl_right">' +
                                '<div class="clr_brandName">' +
                                    '<span>' + item.BrandName + '</span> <span>...</span>' +
                                '</div>' +
                                '<div class="clr_formateType">' +
                                    '<span>' + item.FormatTypeName + '</span>' +
                                '</div>' +
                                '<div class="clr_position">' +
                                    '<span>����</span> <i class="fas fa-map-marker-alt"></i><span>' + item.distance + 'm</span>' +
                                '</div>' +
                                '<div class="clr_saleCount">' +
                                    '<span>������</span> <span>' + item.saleNum + '</span>' +
                                '</div>' +
                                '<div class="clr_discount">' +

                                '</div>' +
                            '</div>' +
                        '</div>'
                    )

                    if (item.FullDiscount) {
                        $('.clr_discount').append(
                            '<div><i>�����ۿ�</i><span>' + item.FullDiscount + '</span></div>'
                        )
                    }
                    if (item.FullDiscount && item.MinusAmount) {
                        $('.clr_discount').append(
                            '<div><i>����</i><span>' + item.FullDiscount + ", " + item.MinusAmount + '</span></div>'
                        )
                    }
                })

            })
        },
        //��ʼ���������
        clickSeach: function () {
            $('.searchBar').on('click', function () {
                $('.seachPage').show();
                IndexWrapper.disable();
                initSearch.init();
            });
        },
        //��ʼ������
        initSort: function () {
            var synthesizeSort = document.querySelector(".synthesizeSort")
            var ss_panel = document.querySelector(".ss_panel")
            var ss_shadow = document.querySelector(".ss_shadow")
            var sortTriangle = synthesizeSort.querySelector(".sort_triangle");
            // ��� ss_panel, ss_shadow ��ʾ���أ� up-down Icon ��ɫ�仯
            function toggleSort() {
                if (sortTriangle.classList.contains("fa-caret-down")) {
                    sortTriangle.style.color = "#1B8CE0";
                    sortTriangle.classList.remove('fa-caret-down');
                    sortTriangle.classList.add('fa-caret-up');
                    synthesizeSort.children[0].children[0].style.color = "#1B8CE0";
                    ss_panel.style.display = "block";
                    ss_shadow.style.display = "block";
                    IndexWrapper.scrollToElement('.recommendCustomer', 0, 0, -20);
                    IndexWrapper.disable();
                } else {
                    sortTriangle.style.color = "gray";
                    sortTriangle.classList.remove('fa-caret-up');
                    sortTriangle.classList.add('fa-caret-down');
                    synthesizeSort.children[0].children[0].style.color = "#333";
                    ss_panel.style.display = "none";
                    ss_shadow.style.display = "none";
                    IndexWrapper.enable();
                }
            }
            // ���� �ȴ� div
            function generateWaitIcon() {
                //��ӵȴ� icon
                var loaderWrapper = document.createElement("div");
                loaderWrapper.classList.add("loaderWrapper");
                loaderWrapper.style.width = window.innerWidth + 'px';
                loaderWrapper.style.height = window.innerHeight + 'px';
                loaderWrapper.style.display = "table-cell";
                loaderWrapper.style.verticalAlign = "middle";
                loaderWrapper.style.textAlign = "center";
                loaderWrapper.style.position = 'relative';
                loaderWrapper.style.zIndex = '1';
                loaderWrapper.style.background = '#eee';
                var loader = document.createElement("div");
                loader.classList.add("loader");
                loader.style.display = 'block';
                loaderWrapper.appendChild(loader);
                for (var i = 0; i < 4; i++) {
                    loader.appendChild(document.createElement("span"));
                }
                document.querySelector("body").appendChild(loaderWrapper);
            }

            synthesizeSort.addEventListener("click", function (e) {
                var e = e || window.event;
                var target = e.target || e.srcElement;

                while (target !== synthesizeSort) {
                    if (target.classList.contains('ss_item') || target.classList.contains('ss_panel')) {
                        if (target.classList.contains('ss_panel')) {
                            toggleSort()
                        } else {
                            if (target.classList.contains("ss_active"))
                                return;

                            // �ƶ� ѡ�� icon �� �����ɫ
                            var rightIcon = document.querySelector(".ss_active").children[1];
                            document.querySelector(".ss_active").classList.remove("ss_active");
                            target.classList.add("ss_active");
                            target.appendChild(rightIcon);
                            // չʾ��Ӱ���������
                            toggleSort();
                            // ���� ͷ�� ���� ��ֵ
                            synthesizeSort.children[0].children[0].innerHTML = target.children[0].innerHTML;
                            // ���� �ȴ� div
                            generateWaitIcon();
                            //ɾ��������ťѡ��
                            var len = target.parentNode.parentNode.parentNode.children.length;
                            for (var i = 0; i < len; i++) {
                                target.parentNode.parentNode.parentNode.children[i].classList.remove("ss_active_top");
                            }
                            // ˢ������
                            $('.customerListWrapper').empty();
                            IndexFilter = target.children[0].innerHTML;
                            initControl.initCustomerList();
                            IndexWrapper.refresh();
                        }
                        return;
                    }

                    if (target.tagName.toLowerCase() == 'div') {
                        switch (target.children[0].innerHTML) {
                            case "�ۺ�����":
                                toggleSort()
                                break;
                            case "�������":
                                if (target.classList.contains("categroy")) {
                                    toggleSort();
                                } else {
                                    // ���õ����ť��ɫ
                                    var len = target.parentNode.children.length;
                                    for (var i = 0; i < len; i++) {
                                        target.parentNode.children[i].classList.remove("ss_active_top");
                                    }
                                    target.classList.add("ss_active_top");

                                    IndexWrapper.scrollToElement('.recommendCustomer', 0, 0, -20);
                                    generateWaitIcon();

                                    $('.customerListWrapper').empty();
                                    IndexFilter = target.children[0].innerHTML;
                                    initControl.initCustomerList();
                                    IndexWrapper.refresh();
                                }
                                break;
                            case "�������":
                                if (target.classList.contains("categroy")) {
                                    toggleSort();
                                } else {
                                    // ���õ����ť��ɫ
                                    var len = target.parentNode.children.length;
                                    for (var i = 0; i < len; i++) {
                                        target.parentNode.children[i].classList.remove("ss_active_top");
                                    }
                                    target.classList.add("ss_active_top");

                                    IndexWrapper.scrollToElement('.recommendCustomer', 0, 0, -20);
                                    generateWaitIcon();

                                    $('.customerListWrapper').empty();
                                    IndexFilter = target.children[0].innerHTML;
                                    initControl.initCustomerList();
                                    IndexWrapper.refresh();
                                }
                                break;
                            default:
                                toggleSort()
                                break;
                        }
                    }
                    target = target.parentNode;
                }
                count = 1;
            })

            //���� ���ֵ��
            ss_shadow.addEventListener("click", function () {
                toggleSort();
            })
        },
        //��ʼ������
        initScroll: function () {

            function pullUp() {
                count += 10;

                setTimeout(function () {
                    //��������
                    initControl.initCustomerList(count);
                    IndexWrapper.refresh();
                }, 1000);
            }

            function pullDown() {
                setTimeout(function () {
                    //���� ˢ��
                    IndexWrapper.refresh();
                    IndexWrapper.scrollTo(0, -$('.pullDown').outerHeight());
                }, 1000);
            }

            refresher.init({
                id: 'IndexWrapper',
                pullUpAction: pullUp,
                pullDownAction: pullDown
            })

            // ������λ
            function scrollPosition() {
                var y = this.y >> 0;
                // ����߶�
                var myPositionH = $('.currentAddressWrapper').outerHeight() + $('.pullDown').outerHeight();        //�ҵ�λ�ø߶�
                var sortPositionH = $('.headerBar').outerHeight() + $('.swiperCustomer').outerHeight() + $('.swiperImg').outerHeight() + $('.recommendCustomer').outerHeight() + $('.pullDown').outerHeight() - $('.seachBarWrapper').outerHeight();
                var customerListPosition = $('.headerBar').outerHeight() + $('.swiperCustomer').outerHeight() + $('.swiperImg').outerHeight() + $('.recommendCustomer').outerHeight() + $('.pullDown').outerHeight() + $('.synthesizeSort').outerHeight();

                if (y <= -myPositionH) {
                    $('#IndexWrapper').after($('.seachBarWrapper')[0]);
                } else {
                    $('.currentAddressWrapper').after($('.seachBarWrapper')[0]);
                }
                if (y <= -sortPositionH) {
                    $('.seachBarWrapper').after($('.synthesizeSort')[0]);
                    $('.customerListWrapper').css({ 'margin-top': '30px' })
                } else {
                    $('.recommendCustomer').after($('.synthesizeSort')[0]);
                    $('.customerListWrapper').css({ 'margin-top': 0 })
                }
            }
            IndexWrapper.on('scroll', scrollPosition);
        }
    }
})()

// ����ҳ��
var initSearch = (function () {
    // ������ʷ����
    function setHistory(item) {
        var historyList = localStorage.getItem("spHistory");
        if (!histtoryList) {
            localStorage.setItem("spHistory", item);
            return;
        }
        historyList = historyList.split(',');
        var len = historyList.length;
        for (var i = 0; i < len; i++) {
            if (item == historyList[i]) return;
        }
        if (len == 10) {
            localStorage.setItem("spHistory", item + "," + historyList.join(',').slice(0, -2));
            return;
        }
        localStorage.setItem("spHistory", item + ',' + historyList.join(','));
    }
    return {
        init: function () {
            // ��ʾ����ҳ�� �ر���ҳ���� ����ʼ��
            $('.sph_searchWrapper input').focus();
            window.setTimeout(function () {
                $('.sph_searchWrapper').addClass('sph_searchWrapperAnimate');
            }, 0)
            // ɾ�� ��ҳ ����Ч��
            if ($('.seachBarWrapper').hasClass('returnAnimateLast')) {
                $('.seachBarWrapper').removeClass('returnAnimateLast')
            }
            // չʾ��ʷ���� ��Ϣ
            if (localStorage.getItem("spHistory")) {
                $('.sp_historyContent').empty();
                $.each(localStorage.getItem("spHistory").split(','), function (i, item) {
                    $('.sp_historyContent').append('<div class="sphc_item"><span>' + item + '</span></div>');
                });
                $('.sphc_item').on('click', function () {
                    $('.sph_searchWrapper input').val($(this).find('span').text());
                    $('.sph_right').trigger('click');
                });


                // ������߷��ذ�ť
                $('.sph_left').on('click', function () {
                    $('.seachPage').hide();
                    IndexWrapper.enable();
                    $('.sph_searchWrapper').removeClass('sph_searchWrapperAnimate');

                    $('.seachBarWrapper').addClass('returnAnimate');
                    window.setTimeout(function () {
                        $('.seachBarWrapper').addClass('returnAnimateLast');
                    }, 0)

                    // ���µ��÷��� �� ȡ������
                    initControl.clickSeach();
                    $('.sph_left').off();
                })

                // �����ұ�������ť
                $('.sph_right').on('click', function () {
                    var inputValue = $('.sph_searchWrapper input').val();
                    if (inputValue.trim() == "") return;
                    PubAjax.post("selectSpCustomerInfo", { input: inputValue }, function (result) {
                        if (result.spCustomerList) {
                            console.log("��Ǹû���ҵ���������");
                        } else {
                            // ���� ��ʷ����
                            setHistory(inputValue);
                            // ��ʾ��ҳ��
                            $('.sp_container').show();
                            $('.sp_container').append($('.synthesizeSort')[0]);
                            //                            $.each(result.spCustomerList, function (i, item) { 
                            //                                
                            //                            })
                            console.log("����")
                        }
                    })
                });

                //ȡ�� ����;
                $('.searchBar').off();
            }
        }
    }
})();

/*
1��������������ҳ��λ����
xhp
*/
var position = (function () {
    return {
        isGetLocation: function () {
            //���û�е�ַ�Ļ��������»�ȡ��λ
            if (sessionStorage.getItem("addr") == null) {
                position.getLocation();
            } else {
                $("#addr").text(sessionStorage.getItem("name") == null ? sessionStorage.getItem("addr") : sessionStorage.getItem("name") == null ? "" : sessionStorage.getItem("name"));

            }
        },
        //��ȡ��ǰ�û�λ����Ϣ
        getLocation: function () {
            //��ʼ����λ��� 
            var geolocation = new qq.maps.Geolocation();
            //timeout ����API����ʱ��Ĭ��10s  failTipFlag �ж��û����δ��Ȩ�Ƿ�������ʾ��Ȩ
            var options = { timeout: 9000, failTipFlag: true };
            var position = geolocation.getLocation(showPosition, errPosition, options);

            //��λ�ɹ��ص�����
            function showPosition(position) {
                //���ؽ��˵��
                //    "module":"geolocation",
                //    "nation": "�й�",
                //    "province": "����ʡ",
                //    "city":"������",
                //    "district":"��ɽ��",
                //    "adcode":"440305", //������ID����λ����, ǰ��λ��ʡ���м����У�������λ����������������IDΪ440300
                //    "addr":"���ڴ�ѧ�ž�ɽ(��ʯ·��250��)",
                //    "lat":22.530001, //��������(gcj02)����Ѷ��Google���ߵ�ͨ��
                //    "lng":113.935364,
                //    "accuracy":13 //��Χ������Ϊ��λ 
                // alert(JSON.stringify(position, null));
                //����΢����Ϣ
                sessionStorage.setItem("nation", position.nation);
                sessionStorage.setItem("province", position.province);
                sessionStorage.setItem("city", position.city);
                sessionStorage.setItem("district", position.district);
                sessionStorage.setItem("adcode", position.adcode);
                sessionStorage.setItem("addr", position.addr);
                sessionStorage.setItem("lat", position.lat);
                sessionStorage.setItem("lng", position.lng);
                sessionStorage.setItem("accuracy", position.accuracy);
                $("#addr").text(sessionStorage.getItem("addr"));

            }
            //��λʧ�ܻص�����
            function errPosition(position) {
                alert("��λʧ�ܣ�����ˢ�º�����ȷ�϶�λ��Ȩ��");
            }
        },
        openSelAddress: function () {
            window.location.href = "/Mobile/WeChat/selAddress.htm";
        }

    }
})()