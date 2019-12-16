<template>
    <div class="container">
        <p>是否删除</p>
        <div>
            <button @click="handleSure">确定</button>
            <button @click="handleCancel">取消</button>
        </div>
    </div>
</template>

<script>
    export default {
        name:"Modal",
        methods:{
            handleSure(){
                this.$emit('sure')
            },
            handleCancel(){
                this.$emit('cancel')
            }
        }
    }
</script>

<style  scoped>
    .container{
    position: absolute;
    top: 0;right: 0;left: 0;bottom: 0;
    background:white;
    z-index: 100;
    }
    p{
        position: absolute;
        left: 30%;top: 100px;
    }
    .container button{
        margin: 0 50px;
        margin-top: 100px;
        font-size: 30px;
    }
    .container>div{
        margin-top: 200px;
    }
</style>