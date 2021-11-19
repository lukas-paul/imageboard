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
                }
            });
    },
    template: `
        <div class="modal" @click="closeModal">

            
            <div v-if="success" class="modal-center">
                <h1 v-if="error" class="error-message">Nothing to see here!</h1>
                <img  class="modal-image" v-bind:src="url" @click.stop/>
                <p class="modal-text">Title: {{title}}<br> Usernmae: {{username}}<br> Description: {{description}}</p>
                <comment-component :id="id"></comment-component>
            </div>
        </div>
    `,
    methods: {
        closeModal: function () {
            console.log("closeModal is triggered");
            this.$emit("close");
        },
    },
};
