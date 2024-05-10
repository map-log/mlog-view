<script setup>
import { ref } from 'vue';
import { UserOutlined } from '@ant-design/icons-vue'

</script>

<template>
    <div>
        <a-float-button-group trigger="click" type="default" :style="{
            top: '24px', right: '24px',
        }">
            <template #icon>
                <UserOutlined />
            </template>
            <a-float-button />
            <a-float-button />
        </a-float-button-group>

    </div>
</template>

<style scoped></style>