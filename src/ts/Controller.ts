///<reference path="_import"/>

class Controller {

    model = new Model();
    view = new View();

    public start;

    public spinBtn = $(".slot__spin");
    public canSpin = true;

    public constructor() {
        this.spinBtn.on("click", () => this.spin());

        var items = this.model.getItems();
        this.view.setItems(items);
    }

    public spin() {
        if (!this.canSpin) {
            return;
        }
        this.canSpin = false;
        this.spinBtn[0].classList.add("slot__spin--disabled");

        this.view.spinBars();

        setTimeout(() => {
            var spin = this.model.spin();
            this.view.stopBars(spin.result, spin.win, () => {
                this.spinBtn[0].classList.remove("slot__spin--disabled");
                this.canSpin = true;
            });
        }, 2000)
    }

}