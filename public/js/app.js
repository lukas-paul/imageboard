import * as Vue from "./vue.js";
import modalComponent from "./modal.js";

Vue.createApp({
    data() {
        return {
            imageData: null,
            title: "",
            description: "",
            username: "",
            file: null,
            selectedId: location.pathname.slice(1),
            moreButton: true,
            nextId: null,
            previousId: null,
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
            console.log("next ", e.target.lang);
            console.log("previous ", e.target.title);
            console.log("current ", e.target.id);
            let previousId = e.target.title;
            let nextId = e.target.lang;
            let id = e.target.id;
            history.pushState({}, "", `/${id}`);
            this.selectedId = id;
            this.nextId = nextId;
            this.previousId = previousId;
        },
        nextImage(next) {
            console.log("next image has been triggered: ", this.selectedId);
            this.selectedId = next;
            console.log("selectedId after push state: ", this.selectedId);
        },
        previousImage(previous) {
            console.log("previous image has been triggered: ", this.selectedId);
            this.selectedId = previous;
            console.log("selectedId after push state: ", this.selectedId);
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
            history.pushState({}, "", `/`);
        },
        getMoreImages() {
            let length = this.imageData.length;
            let lastId = this.imageData[length - 1].id;
            console.log("lastid in vue app: ", lastId);
            fetch(`/moredata.jason/${lastId}`)
                .then((data) => data.json())
                .then((data) => {
                    console.log("more imagedata from server: ", data);
                    data.forEach((element) => {
                        this.imageData.push(element);
                        if (element.id === element.lowestId) {
                            this.moreButton = false;
                        }
                    });
                });
        },
    },
    mounted: function () {
        fetch("/data.json/")
            .then((data) => data.json())
            .then((data) => {
                console.log("imagedata from server:", data);
                this.imageData = data;
            });
        addEventListener("popstate", (e) => {
            console.log(location.pathname, e.state);
            this.selectedId = location.pathname.slice(1);
        });
    },
}).mount("#main");
