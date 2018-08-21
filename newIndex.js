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
    var IndexFilter = "综合排序";   // 过滤条件
    var count = 1;   //初始化加载 位置

    return {
        //初始化搜索栏底部商家
        initSearchBottomCustomer: function () {

        },
        //初始化轮播商家  
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
        //初始化轮播图片
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
        //初始化商家列表
        initCustomerList: function (count) {
            PubAjax.post("selectCustomerListInfo", {
                startPosition: count,
                Filter: IndexFilter,
                lng: sessionStorage.getItem("lat"),
                lat: sessionStorage.getItem("lng")
            }, function (result) {
                //删除 等待 icon
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
                                    '<span>距离</span> <i class="fas fa-map-marker-alt"></i><span>' + item.distance + 'm</span>' +
                                '</div>' +
                                '<div class="clr_saleCount">' +
                                    '<span>销售量</span> <span>' + item.saleNum + '</span>' +
                                '</div>' +
                                '<div class="clr_discount">' +

                                '</div>' +
                            '</div>' +
                        '</div>'
                    )

                    if (item.FullDiscount) {
                        $('.clr_discount').append(
                            '<div><i>整单折扣</i><span>' + item.FullDiscount + '</span></div>'
                        )
                    }
                    if (item.FullDiscount && item.MinusAmount) {
                        $('.clr_discount').append(
                            '<div><i>满减</i><span>' + item.FullDiscount + ", " + item.MinusAmount + '</span></div>'
                        )
                    }
                })

            })
        },
        //初始化点击搜索
        clickSeach: function () {
            $('.searchBar').on('click', function () {
                $('.seachPage').show();
                IndexWrapper.disable();
                initSearch.init();
            });
        },
        //初始化排序
        initSort: function () {
            var synthesizeSort = document.querySelector(".synthesizeSort")
            var ss_panel = document.querySelector(".ss_panel")
            var ss_shadow = document.querySelector(".ss_shadow")
            var sortTriangle = synthesizeSort.querySelector(".sort_triangle");
            // 外层 ss_panel, ss_shadow 显示隐藏， up-down Icon 颜色变化
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
            // 生成 等待 div
            function generateWaitIcon() {
                //添加等待 icon
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

                            // 移动 选中 icon 和 点击颜色
                            var rightIcon = document.querySelector(".ss_active").children[1];
                            document.querySelector(".ss_active").classList.remove("ss_active");
                            target.classList.add("ss_active");
                            target.appendChild(rightIcon);
                            // 展示阴影，排序面板
                            toggleSort();
                            // 排序 头部 重新 赋值
                            synthesizeSort.children[0].children[0].innerHTML = target.children[0].innerHTML;
                            // 生成 等待 div
                            generateWaitIcon();
                            //删除其他按钮选中
                            var len = target.parentNode.parentNode.parentNode.children.length;
                            for (var i = 0; i < len; i++) {
                                target.parentNode.parentNode.parentNode.children[i].classList.remove("ss_active_top");
                            }
                            // 刷新数据
                            $('.customerListWrapper').empty();
                            IndexFilter = target.children[0].innerHTML;
                            initControl.initCustomerList();
                            IndexWrapper.refresh();
                        }
                        return;
                    }

                    if (target.tagName.toLowerCase() == 'div') {
                        switch (target.children[0].innerHTML) {
                            case "综合排序":
                                toggleSort()
                                break;
                            case "销量最高":
                                if (target.classList.contains("categroy")) {
                                    toggleSort();
                                } else {
                                    // 设置点击按钮颜色
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
                            case "距离最近":
                                if (target.classList.contains("categroy")) {
                                    toggleSort();
                                } else {
                                    // 设置点击按钮颜色
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

            //监听 遮罩点击
            ss_shadow.addEventListener("click", function () {
                toggleSort();
            })
        },
        //初始化滚动
        initScroll: function () {

            function pullUp() {
                count += 10;

                setTimeout(function () {
                    //上拉加载
                    initControl.initCustomerList(count);
                    IndexWrapper.refresh();
                }, 1000);
            }

            function pullDown() {
                setTimeout(function () {
                    //下拉 刷新
                    IndexWrapper.refresh();
                    IndexWrapper.scrollTo(0, -$('.pullDown').outerHeight());
                }, 1000);
            }

            refresher.init({
                id: 'IndexWrapper',
                pullUpAction: pullUp,
                pullDownAction: pullDown
            })

            // 滚动定位
            function scrollPosition() {
                var y = this.y >> 0;
                // 计算高度
                var myPositionH = $('.currentAddressWrapper').outerHeight() + $('.pullDown').outerHeight();        //我的位置高度
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

// 搜索页面
var initSearch = (function () {
    // 设置历史搜索
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
            // 显示搜索页面 关闭首页滚动 并初始化
            $('.sph_searchWrapper input').focus();
            window.setTimeout(function () {
                $('.sph_searchWrapper').addClass('sph_searchWrapperAnimate');
            }, 0)
            // 删除 首页 动画效果
            if ($('.seachBarWrapper').hasClass('returnAnimateLast')) {
                $('.seachBarWrapper').removeClass('returnAnimateLast')
            }
            // 展示历史搜索 信息
            if (localStorage.getItem("spHistory")) {
                $('.sp_historyContent').empty();
                $.each(localStorage.getItem("spHistory").split(','), function (i, item) {
                    $('.sp_historyContent').append('<div class="sphc_item"><span>' + item + '</span></div>');
                });
                $('.sphc_item').on('click', function () {
                    $('.sph_searchWrapper input').val($(this).find('span').text());
                    $('.sph_right').trigger('click');
                });


                // 监听左边返回按钮
                $('.sph_left').on('click', function () {
                    $('.seachPage').hide();
                    IndexWrapper.enable();
                    $('.sph_searchWrapper').removeClass('sph_searchWrapperAnimate');

                    $('.seachBarWrapper').addClass('returnAnimate');
                    window.setTimeout(function () {
                        $('.seachBarWrapper').addClass('returnAnimateLast');
                    }, 0)

                    // 重新调用方法 与 取消监听
                    initControl.clickSeach();
                    $('.sph_left').off();
                })

                // 监听右边搜索按钮
                $('.sph_right').on('click', function () {
                    var inputValue = $('.sph_searchWrapper input').val();
                    if (inputValue.trim() == "") return;
                    PubAjax.post("selectSpCustomerInfo", { input: inputValue }, function (result) {
                        if (result.spCustomerList) {
                            console.log("抱歉没有找到你搜索的");
                        } else {
                            // 设置 历史搜索
                            setHistory(inputValue);
                            // 显示主页面
                            $('.sp_container').show();
                            $('.sp_container').append($('.synthesizeSort')[0]);
                            //                            $.each(result.spCustomerList, function (i, item) { 
                            //                                
                            //                            })
                            console.log("测试")
                        }
                    })
                });

                //取消 监听;
                $('.searchBar').off();
            }
        }
    }
})();

/*
1、功能描述：首页定位功能
xhp
*/
var position = (function () {
    return {
        isGetLocation: function () {
            //如果没有地址的缓存则重新获取定位
            if (sessionStorage.getItem("addr") == null) {
                position.getLocation();
            } else {
                $("#addr").text(sessionStorage.getItem("name") == null ? sessionStorage.getItem("addr") : sessionStorage.getItem("name") == null ? "" : sessionStorage.getItem("name"));

            }
        },
        //获取当前用户位置信息
        getLocation: function () {
            //初始化定位组件 
            var geolocation = new qq.maps.Geolocation();
            //timeout 调用API超市时间默认10s  failTipFlag 判断用户如果未授权是否重新提示授权
            var options = { timeout: 9000, failTipFlag: true };
            var position = geolocation.getLocation(showPosition, errPosition, options);

            //定位成功回调函数
            function showPosition(position) {
                //返回结果说明
                //    "module":"geolocation",
                //    "nation": "中国",
                //    "province": "广州省",
                //    "city":"深圳市",
                //    "district":"南山区",
                //    "adcode":"440305", //行政区ID，六位数字, 前两位是省，中间是市，后面两位是区，比如深圳市ID为440300
                //    "addr":"深圳大学杜鹃山(白石路北250米)",
                //    "lat":22.530001, //火星坐标(gcj02)，腾讯、Google、高德通用
                //    "lng":113.935364,
                //    "accuracy":13 //误差范围，以米为单位 
                // alert(JSON.stringify(position, null));
                //缓存微信信息
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
            //定位失败回调函数
            function errPosition(position) {
                alert("定位失败！请您刷新后重新确认定位授权。");
            }
        },
        openSelAddress: function () {
            window.location.href = "/Mobile/WeChat/selAddress.htm";
        }

    }
})()