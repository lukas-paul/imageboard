import * as Vue from "./vue.js";
import modalComponent from "./components.js";

Vue.createApp({
    data() {
        return {
            imageData: null,
            images: [],
            title: "",
            description: "",
            username: "",
            file: null,
            selectedId: null,
        };
    },
    components: {
        "modal-component": modalComponent,
    },
    methods: {
        setFile(e) {
            this.file = e.target.files[0];
        },

        selectImage(e) {
            console.log("e.target: ", e.target.id);
            this.selectedId = e.target.id;
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
                    return result.json();
                })
                .then((result) => {
                    console.log("image upload in fetch:", result);
                    this.imageData.unshift(result);
                })
                .catch((err) =>
                    console.log("something isnt working in fetch: ", err)
                );
        },
        closeModal() {
            console.log("closemodal is triggered");
            this.selectedId = null;
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
