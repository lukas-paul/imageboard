import * as Vue from "./vue.js";

Vue.createApp({
    data() {
        return {
            imageData: null,
            images: [],
            title: "",
            description: "",
            username: "",
            file: null,
        };
    },

    methods: {
        setFile(e) {
            this.file = e.target.files[0];
        },
        upload() {
            console.log("this: ", this);
            const formData = new FormData();
            formData.append("file", this.file);
            formData.append("title", this.title);
            //formData.append("username", this.username);
            formData.append("username", this.username);
            formData.append("description", this.description);
            fetch("/upload", {
                method: "POST",
                body: formData,
            })
                .then((result) => {
                    result.json();
                })
                .then((result) => {
                    console.log("images from server:", result);
                    this.imageData.unshift(result);
                })
                .catch((err) =>
                    console.log("something isnt working in fetch: ", err)
                );
        },
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
