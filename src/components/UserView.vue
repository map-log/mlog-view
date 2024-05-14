<script setup>
import { UserOutlined } from '@ant-design/icons-vue'

import { useRouter } from 'vue-router';

const router = useRouter();

const navigateToLogin = () => {
    router.push({ name: 'login' });
};

</script>

<template>
    <div>
        <a-float-button-group trigger="click" type="default" :style="{
            top: '24px', right: '24px',
        }">
            <template #icon>
                <UserOutlined />
            </template>
            <a-float-button @click="navigateToLogin" />
            <a-float-button @click="navigateToLogin" />
        </a-float-button-group>

    </div>
</template>

<style scoped></style>