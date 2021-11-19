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
                <div><label>Comment</label><textarea v-model="comment" name="comment" class="input" rows="4"></textarea></div>
                <div><label>Username</label><input v-model="username" name="username" class="input"></div>
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
    methods: {
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
