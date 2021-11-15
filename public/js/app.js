import * as Vue from "./vue.js";

Vue.createApp({
    data() {
        return {
            imageData: null,
        };
    },
    mounted: function () {
        fetch("/data.json")
            .then((data) => data.json())
            .then((data) => {
                console.log("imagedata from server:", data);
                this.imageData = data.reverse();
            });
    },
}).mount("#main");
