<script setup>

</script>

<template>
    <a-timeline-item color="black">
        <h3>소제목1</h3>
        <a-image-preview-group>
            <a-image :width="100" src="https://aliyuncdn.antdv.com/vue.png" />
            <a-image :width="100" src="https://aliyuncdn.antdv.com/logo.png" />
        </a-image-preview-group>
        <br>
        <a-rate :value="2.5" allow-half />
        <p>내용.......</p>
    </a-timeline-item>
</template>

<style scoped></style>