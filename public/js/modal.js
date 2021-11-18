import commentComponent from "./comments.js";

export default {
    data() {
        return {
            url: "",
            title: "",
            description: "",
            username: "",
        };
    },
    components: {
        "comment-component": commentComponent,
    },
    props: ["id"],
    mounted: function () {
        console.log("mount started!");
        fetch(`/selectedImageData/${this.id}`)
            .then((res) => {
                return res.json();
            })
            .then((result) => {
                console.log("result of fetch selcted image: ", result);
                this.url = result[0].url;
                this.title = result[0].title;
                this.description = result[0].description;
                this.username = result[0].username;
            });
    },
    template: `
        <div class="modal" @click="closeModal">
            <img class="modal-image" v-bind:src="url" @click.stop/>
            <p class="modal-text">Title: {{title}}<br> Usernmae: {{username}}<br> Description: {{description}}</p>
            <comment-component :id="id"></comment-component>
        </div>
    `,
    methods: {
        closeModal: function () {
            console.log("closeModal is triggered");
            this.$emit("close");
        },
    },
};
