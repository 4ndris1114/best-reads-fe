<!-- The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work. -->

<template>
    <div class="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <div class="max-w-md w-full space-y-8 bg-white p-10 rounded-lg shadow-lg">
            <!-- Logo -->
            <div class="flex justify-center">
                <fa icon="book-open" class="text-4xl text-blue-600" />
            </div>

            <!-- Welcome Text -->
            <div class="text-center">
                <h2 class="mt-6 text-3xl font-extrabold text-gray-900">Welcome back</h2>
                <p class="mt-2 text-sm text-gray-600">Sign in to continue to BestReads</p>
            </div>

            <!-- Login Form -->
            <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
                <div class="space-y-4">
                    <!-- Email Input -->
                    <div>
                        <label for="email" class="sr-only">Email address</label>
                        <div class="relative">
                            <fa icon="envelope"
                                class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></fa>
                            <input id="email" v-model="email" type="email" required
                                class="peer appearance-none rounded-lg relative block w-full pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                placeholder="Email address" />
                        </div>
                        <p v-if="emailError" class="mt-1 text-xs text-red-500">{{ emailError }}</p>
                    </div>

                    <!-- Password Input -->
                    <div>
                        <label for="password" class="sr-only">Password</label>
                        <div class="relative">
                            <fa icon="lock" class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                            </fa>
                            <input id="password" v-model="password" :type="showPassword ? 'text' : 'password'" required
                                class="appearance-none rounded-lg relative block w-full pl-10 pr-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                placeholder="Password" />
                            <button type="button"
                                class="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                                @click="togglePassword">
                                <fa :icon="showPassword ? 'eye-slash' : 'eye'" class="text-gray-400"></fa>
                            </button>
                        </div>
                        <p v-if="passwordError" class="mt-1 text-xs text-red-500">{{ passwordError }}</p>
                    </div>

                    <!-- Remember Me - how can we do this? -->
                    <div class="flex flex-col items-start justify-between">
                        <div class="flex items-center">
                            <input id="remember-me" v-model="rememberMe" type="checkbox"
                                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer" />
                            <label for="remember-me" class="ml-2 block text-sm text-gray-900 cursor-pointer">
                                Remember me
                            </label>
                        </div>
                        <div class="text-sm">
                            <a href="#" class="font-medium text-blue-600 hover:text-blue-500"
                                @click="handleForgotPassword">
                                Forgot your password?
                            </a>
                        </div>
                    </div>
                </div>

                <!-- Login Button -->
                <button type="submit"
                    class="!rounded-button group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 whitespace-nowrap cursor-pointer"
                    :disabled="isLoading">
                    <span v-if="isLoading" class="absolute left-1/2 transform -translate-x-1/2">
                        <fa icon="spinner" class="animate-spin" />
                    </span>
                    <span :class="{ invisible: isLoading }">Sign in</span>
                </button>

                <!-- Social Login -->
                <div class="mt-6">
                    <div class="relative">
                        <div class="absolute inset-0 flex items-center">
                            <div class="w-full border-t border-gray-300"></div>
                        </div>
                        <div class="relative flex justify-center text-sm">
                            <span class="px-2 bg-white text-gray-500">Or continue with</span>
                        </div>
                    </div>
                </div>
            </form>

            <!-- Sign Up Link -->
            <p class="mt-8 text-center text-sm text-gray-600">
                Don't have an account?
                <!-- TODO : Add sign up page -->
                <a href="#" class="font-medium text-blue-600 hover:text-blue-500" @click="handleSignUp">
                    Sign up
                </a>
            </p>
        </div>

        <!-- Toast Notification -->
        <div v-if="showToast" class="fixed top-4 right-4 bg-white shadow-lg rounded-lg p-4 flex items-center space-x-3"
            :class="toastType === 'error' ? 'border-l-4 border-red-500' : 'border-l-4 border-green-500'">
            <fa :icon="toastType === 'error' ? 'exclamation-circle' : 'check-circle'" 
                :class="toastType === 'error' ? 'text-red-500' : 'text-green-500'"></fa>
            <p class="text-sm text-gray-600">{{ toastMessage }}</p>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useUserStore } from '@/stores/userStore';

onMounted(() => {
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('isRegistering', 'false');
    window.history.replaceState({}, '', `${window.location.pathname}?${urlParams.toString()}`);
});

// stores
const userStore = useUserStore();

// state
const email = ref('');
const password = ref('');
const rememberMe = ref(false);
const showPassword = ref(false);
const isLoading = ref(false);
const emailError = ref('');
const passwordError = ref('');
const showToast = ref(false);
const toastMessage = ref('');
const toastType = ref<'success' | 'error'>('success');

// emits
const emit = defineEmits(['signup']);

const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

const showNotification = (message: string, type: 'success' | 'error') => {
    toastMessage.value = message;
    toastType.value = type;
    showToast.value = true;
    setTimeout(() => {
        showToast.value = false;
    }, 3000);
};

const handleLogin = async () => {
    if (!validateEmail(email.value)) {
        emailError.value = 'Please enter a valid email address';
        return;
    }

    emailError.value = '';
    isLoading.value = true;

    try {
        await userStore.login(email.value, password.value);
        showNotification('Successfully logged in!', 'success');
    } catch (error) {
        if (error.response.data === "Email not found") {
            emailError.value = error.response.data;
        } else if (error.response.data === "Incorrect password") {
            passwordError.value = error.response.data;
        }
        showNotification('Login failed. Please try again.', 'error');
    } finally {
        isLoading.value = false;
    }
};

const togglePassword = () => {
    showPassword.value = !showPassword.value;
};

const handleForgotPassword = () => {
    showNotification("Not implemented yet! (hehe)", 'error');
};

const handleSignUp = () => {
    emit('signup');
    showNotification('Redirecting to sign up page...', 'success');
};
</script>

<style scoped>
.fa-spinner {
    animation: spin 1s linear infinite;
}

@keyframes spin {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

input:-webkit-autofill {
    background-color: transparent !important;
    -webkit-text-fill-color: #000 !important;
    transition: background-color 5000s ease-in-out 0s;
}
</style>