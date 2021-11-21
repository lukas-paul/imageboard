export default {
    data() {
        return {
            username: "",
            comment: "",
            commentArray: null,
        };
    },
    props: ["id"],
    template: `
        <div @click.stop class="comment-section">
            <div class="leave-comment">
                <div><textarea placeholder="Comment" v-model="comment" name="comment" rows="4" cols="80"></textarea></div>
                <div><input placeholder="Name" v-model="username" name="username" class="input"></div>
                <button v-on:click="uploadComment" id="upload-comment">comment</button>
            </div>
            <div class="comments">
                <h2>Comments</h2>
                <div v-for="element in commentArray" class="show-comments">
                    <div>
                        <p>{{element.author}}:<br>{{element.comment}}</p>
                    </div>
                </div>
            </div>
        </div>
    `,
    mounted: function () {
        fetch(`/getAllComments/${this.id}`)
            .then((data) => {
                return data.json();
            })
            .then((data) => {
                console.log("we got comments back from the server: ", data);
                this.commentArray = data;
            });
    },
    watch: {
        id() {
            console.log("watcher is triggerd");
            this.relaodComments();
        },
    },
    methods: {
        relaodComments() {
            fetch(`/getAllComments/${this.id}`)
                .then((data) => {
                    return data.json();
                })
                .then((data) => {
                    console.log("we got comments back from the server: ", data);
                    this.commentArray = data;
                });
        },
        uploadComment: function () {
            console.log("this.id in upload Image: ", this.id);
            fetch(`/uploadComment/${this.id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: this.username,
                    comment: this.comment,
                }),
            })
                .then((result) => {
                    return result.json();
                })
                .then((result) => {
                    console.log("comment upload in fetch:", result);
                    this.commentArray.unshift(result);
                })
                .catch((err) =>
                    console.log("something isnt working in fetch: ", err)
                );
        },
    },
};
