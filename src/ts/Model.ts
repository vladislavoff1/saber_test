///<reference path="_import"/>

class Model {

    private items:number[][];

    constructor() {
        this.items = [
            [0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4],
            [0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4],
            [0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4]
        ];

        for (var i = 0; i < this.items.length; i++) {
            Model.shuffle(this.items[i]);
        }

    }

    public getItems() {
        return this.items;
    }

    public spin() {
        var i;
        var result = [];

        for (i = 0; i < this.items.length; i++) {
            result.push(Math.floor(Math.random() * this.items[i].length));
        }

        var win = true;
        for (i = 1; i < result.length; i++) {
            if (this.items[i - 1][result[i - 1]] != this.items[i][result[i]]) {
                win = false;
            }
        }

        return {
            "result": result,
            "win": win
        };
    }

    private static shuffle(arr) {
        var j, x, i;
        for (i = arr.length; i; i--) {
            j = Math.floor(Math.random() * i);
            x = arr[i - 1];
            arr[i - 1] = arr[j];
            arr[j] = x;
        }
    }

}