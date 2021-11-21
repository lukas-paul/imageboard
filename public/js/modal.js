import commentComponent from "./comments.js";

export default {
    data() {
        return {
            url: "",
            title: "",
            description: "",
            username: "",
            error: "",
            success: "",
            watchNext: null,
            nextId: null,
            previousId: null,
            currentId: null,
            hover: false,
        };
    },
    components: {
        "comment-component": commentComponent,
    },
    props: ["id", "previous", "next"],
    mounted() {
        console.log("mount started!");
        fetch(`/selectedImageData/${this.id}`)
            .then((res) => {
                return res.json();
            })
            .then((result) => {
                console.log("result of fetch selcted image: ", result);
                console.log("next id: ", this.next);

                if (result.length === 0) {
                    this.error = true;
                    console.log("error");
                    console.log(result[0].url);
                } else {
                    this.success = true;
                    console.log("success? ", this.success);
                    this.url = result[0].url;
                    this.title = result[0].title;
                    this.description = result[0].description;
                    this.username = result[0].username;
                    this.nextId = result[0].next;
                    this.previousId = result[0].previousId;
                }
            });
    },
    template: `
        <div class="modal" @click="closeModal">

            
            <div v-if="success" class="modal-center">
                <h1 v-if="error" class="error-message">Nothing to see here!</h1>
                <div class="img-container" @click.stop @mouseover="hover=true" @mouseleave="hover=false">
                    <img  class="modal-image" v-bind:src="url"/>
                    <div v-if="hover" class="left-button" v-on:click="previousImage"><div class="arrow" id="left-arrow"></div></div>
                    <div v-if="hover" class="right-button" v-on:click="nextImage"><div class="arrow" id="right-arrow"></div></div>
                    <div v-if="hover" class="modal-text"><p class="img-info">Title: {{title}}<br> Usernmae: {{username}}<br> Description: {{description}}</p></div>
                </div>
                
                <comment-component :id="id"></comment-component>
            </div>
        </div>
    `,
    watch: {
        id() {
            console.log("watcher is triggerd");
            this.reloadModal();
        },
    },
    methods: {
        closeModal: function () {
            console.log("closeModal is triggered");
            this.$emit("close");
        },
        previousImage: function () {
            console.log("previous");
            this.nextId = this.$emit("previous", this.previousId);
        },
        nextImage: function () {
            console.log("next: ", this.next);
            this.nextId = this.$emit("next", this.nextId);
            console.log("next: ", this.next);
        },
        reloadModal: function () {
            console.log("remount started!");
            fetch(`/selectedImageData/${this.id}`)
                .then((res) => {
                    return res.json();
                })
                .then((result) => {
                    console.log("result of fetch selcted image: ", result);
                    console.log("next id: ", this.next);

                    if (result.length === 0) {
                        this.error = true;
                        console.log("error");
                        console.log(result[0].url);
                    } else {
                        this.success = true;
                        console.log("success? ", this.success);
                        this.url = result[0].url;
                        this.title = result[0].title;
                        this.description = result[0].description;
                        this.username = result[0].username;
                        this.nextId = result[0].next;
                        this.previousId = result[0].previousId;
                        this.currentId = this.id;
                        history.pushState({}, "", `/${this.currentId}`);
                    }
                });
        },
    },
};
