/*!
* pull to refresh v2.0
*author:wallace
*2015-7-22
*/
var refresher = {
    info: {
        "pullDownLable": "",
        "pullingDownLable": "Release to refresh...",
        "pullUpLable": "",
        "pullingUpLable": "Release to load more...",
        "loadingLable": "Loading..."
    },
    init: function (parameter) {
        var wrapper = document.getElementById(parameter.id);
        var div = document.createElement("div");
        div.className = "scroller";
        wrapper.appendChild(div);
        var scroller = wrapper.querySelector(".scroller");
        var list = wrapper.querySelector("#" + parameter.id + " ul");
        scroller.insertBefore(list, scroller.childNodes[0]);
        var pullDown = document.createElement("div");
        pullDown.className = "pullDown";
        var loader = document.createElement("div");
        loader.className = "loader";
        for (var i = 0; i < 4; i++) {
            var span = document.createElement("span");
            loader.appendChild(span);
        }
        pullDown.appendChild(loader);
        var pullDownLabel = document.createElement("div");
        pullDownLabel.className = "pullDownLabel";
        pullDown.appendChild(pullDownLabel);
        scroller.insertBefore(pullDown, scroller.childNodes[0]);
        var pullUp = document.createElement("div");
        pullUp.className = "pullUp";
        var loader = document.createElement("div");
        loader.className = "loader";
        for (var i = 0; i < 4; i++) {
            var span = document.createElement("span");
            loader.appendChild(span);
        }
        pullUp.appendChild(loader);
        var pullUpLabel = document.createElement("div");
        pullUpLabel.className = "pullUpLabel";
        var content = document.createTextNode(refresher.info.pullUpLable);
        pullUpLabel.appendChild(content);
        pullUp.appendChild(pullUpLabel);
        scroller.appendChild(pullUp);
        var pullDownEl = wrapper.querySelector(".pullDown");
        var pullDownOffset = pullDownEl.offsetHeight;
        var pullUpEl = wrapper.querySelector(".pullUp");
        var pullUpOffset = pullUpEl.offsetHeight;
        this.scrollIt(parameter, pullDownEl, pullDownOffset, pullUpEl, pullUpOffset);
    },
    scrollIt: function (parameter, pullDownEl, pullDownOffset, pullUpEl, pullUpOffset) {
        eval(parameter.id + "= new IScroll(parameter.id, { probeType: 3, startY: -40, onRefresh: function () {refresher.onRelease(pullDownEl,pullUpEl);} })");
        pullDownEl.querySelector('.pullDownLabel').innerHTML = refresher.info.pullDownLable;
        document.addEventListener('touchmove', function (e) {
            e.preventDefault();
        }, false);

        //¹ö¶¯
        eval(parameter.id).on('scroll', function () {
            var y = this.y >> 0;
            if (y > -(pullUpOffset)) {
                pullDownEl.id = '';
                pullDownEl.querySelector('.pullDownLabel').innerHTML = refresher.info.pullDownLable;
                // this.minScrollY = -pullUpOffset;
            }
            if (y > 0) {
                pullDownEl.classList.add("flip");
                pullDownEl.querySelector('.pullDownLabel').innerHTML = refresher.info.pullingDownLable;
                // this.minScrollY = 0;
            }
            if (this.scrollerHeight < this.wrapperHeight && y < (-pullUpOffset) || this.scrollerHeight > this.wrapperHeight && this.y < (this.maxScrollY - pullUpOffset)) {
                pullUpEl.style.display = "block";
                pullUpEl.classList.add("flip");
                pullUpEl.querySelector('.pullUpLabel').innerHTML = refresher.info.pullingUpLable;
            }
            if (this.scrollerHeight < this.wrapperHeight && y > (-pullUpOffset) && pullUpEl.id.match('flip') || this.scrollerHeight > this.wrapperHeight && y > (this.maxScrollY - pullUpOffset) && pullUpEl.id.match('flip')) {
                pullDownEl.classList.remove("flip");
                pullUpEl.querySelector('.pullUpLabel').innerHTML = refresher.info.pullUpLable;
            }
        })
        //¹ö¶¯½áÊø
        eval(parameter.id).on("scrollEnd", function () {
            if (pullDownEl.className.match('flip') /*&&!pullUpEl.className.match('loading')*/) {
                pullDownEl.classList.add("loading");
                pullDownEl.classList.remove("flip");
                pullDownEl.querySelector('.pullDownLabel').innerHTML = refresher.info.loadingLable;
                pullDownEl.querySelector('.loader').style.display = "block"
                pullDownEl.style.lineHeight = "20px";
                if (parameter.pullDownAction) parameter.pullDownAction();
            }
            if (pullUpEl.className.match('flip') /*&&!pullDownEl.className.match('loading')*/) {
                pullUpEl.classList.add("loading");
                pullUpEl.classList.remove("flip");
                pullUpEl.querySelector('.pullUpLabel').innerHTML = refresher.info.loadingLable;
                pullUpEl.querySelector('.loader').style.display = "block"
                pullUpEl.style.lineHeight = "20px";
                if (parameter.pullUpAction) parameter.pullUpAction();
            }
        })
    },
    onRelease: function (pullDownEl, pullUpEl) {
        if (pullDownEl.className.match('loading')) {
            pullDownEl.classList.toggle("loading");
            pullDownEl.querySelector('.pullDownLabel').innerHTML = refresher.info.pullDownLable;
            pullDownEl.querySelector('.loader').style.display = "none"
            pullDownEl.style.lineHeight = pullDownEl.offsetHeight + "px";
        }
        if (pullUpEl.className.match('loading')) {
            pullUpEl.classList.toggle("loading");
            pullUpEl.querySelector('.pullUpLabel').innerHTML = refresher.info.pullUpLable;
            pullUpEl.querySelector('.loader').style.display = "none"
            pullUpEl.style.lineHeight = pullUpEl.offsetHeight + "px";
        }
    }
}