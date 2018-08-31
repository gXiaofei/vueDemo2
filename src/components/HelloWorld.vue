<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <!-- <img :src="imgUrl" /> -->
    <div v-html="imgUrl"></div>
  </div>
</template>

<script>
    import axios from 'axios';
    export default {
        name: 'HelloWorld',
        data () {
            return {
                msg: 'Welcome to Your Vue.js App',
                imgUrl: ''
            };
        },
        created () {
            axios.post('/login', {username: '张三', password: 123456}).then(res => {
                console.log(res);
            }, err => {
                console.log(err);
            });
            axios.get('/login/captcha').then(res => {
                this.imgUrl = res.data.img;
                console.log(res);
            }, err => {
                console.log(err);
            });
        }
    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
