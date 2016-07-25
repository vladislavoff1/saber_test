///<reference path="_import"/>

class View {

    speed = 0.3;

    slot = $(".slot");
    bars = $(".slot__bar");
    barInner = $(".slot__bar_inner");

    constructor() {

    }

    public setItems(items:number[][]) {
        for (var i = 0; i < this.barInner.length; i++) {
            var els = this.barInner[i].getElementsByClassName("slot__item");

            for (var j = 0; j < els.length; j++) {
                els[j].setAttribute("data-slot__item", items[i][j % 20] + "");
            }
        }
    }

    requestAnimationId;

    public spinBars() {
        for (var i = 0; i < this.barInner.length; i++) {
            var el = this.barInner[i];

            if (el.style.top == "") {
                el.style.top = "0%";
            }
        }

        var draw = function (deltaTime) {
            for (var i = 0; i < this.barInner.length; i++) {
                var el = this.barInner[i];
                var newTop = parseInt(el.style.top) + this.speed * deltaTime;

                if (newTop > 0) {
                    newTop -= 1000 / 1.5;
                }

                el.style.top = newTop + "%";
            }
        }.bind(this);

        var start = performance.now();

        var self = this;
        this.requestAnimationId = requestAnimationFrame(function animate(time) {
            // определить, сколько прошло времени с начала анимации
            var deltaTime = time - start;
            start = time;

            // нарисовать состояние анимации в момент timePassed
            draw(deltaTime);
            self.requestAnimationId = requestAnimationFrame(animate);
        });
    }

    public stopBars(result:number[], win:boolean, complete:() => void) {
        cancelAnimationFrame(this.requestAnimationId);

        var needToShow = this.barInner.length;
        var alreadyShowed = 0;

        for (var i = 0; i < this.barInner.length; i++) {

            this.showItem(i, result[i], function func() {
                if (++alreadyShowed == needToShow) {
                    if (win) {
                        this.showWin(result, () => {
                            complete();
                        });
                    } else {
                        complete();
                    }
                }
            }.bind(this));
        }
    }


    public showWin(winItems:number[], complete:() => void) {
        var items = [];
        for (var i = 0; i < winItems.length; i++) {
            winItems[i] = (winItems[i] + 19) % 20 + 1;


            var els = this.barInner[i].getElementsByClassName("slot__item");
            items[i] = els[winItems[i]];
            items[i].classList.add("slot__item--animation");
        }

        setTimeout(() => {
            for (var i = 0; i < items.length; i++) {
                items[i].classList.remove("slot__item--animation");
            }
            complete();
        }, 2000);
    }

    public showItem(barId, itemId, callback:() => void) {
        var height = 1000 / 1.5;
        var numberOfItems = 20;

        if (this.barInner[barId].style.top == "") {
            this.barInner[barId].style.top = "0%";
        }

        var needPosition = -height / numberOfItems * ((itemId + 19) % 20);

        var draw = function (deltaTime) {
            var currentPosition = parseInt(this.barInner[barId].style.top);
            var distance = needPosition - currentPosition;
            distance = Math.abs(distance);

            if (distance < this.speed * deltaTime) {
                this.barInner[barId].style.top = needPosition + "%";
                return false;
            }

            var newTop = currentPosition + this.speed * deltaTime;

            if (newTop > 0) {
                newTop -= 1000 / 1.5;
            }

            this.barInner[barId].style.top = newTop + "%";
            return true;
        }.bind(this);

        this.animate(draw, () => {
            callback();
        });

    }

    private animate(draw:(number) => boolean, callback:() => void) {
        var start = performance.now();

        requestAnimationFrame(function animate(time) {
            // определить, сколько прошло времени с начала анимации
            var timePassed = time - start;
            start = time;

            // нарисовать состояние анимации в момент timePassed
            if (draw(timePassed)) {
                requestAnimationFrame(animate);
            } else {
                callback();
            }

        });
    }


}