var app = new Vue({
    el: '#app',
    data: {
        posts: []
    },
    mounted() {
        axios.get('/api/Posts').then((response) => {
            this.posts = response.data;
            
        })
    },
})