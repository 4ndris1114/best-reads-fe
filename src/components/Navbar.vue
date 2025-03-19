<template>
    <!-- Header -->
    <header class="fixed top-0 w-full bg-white shadow-sm z-50">
        <div class="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <div class="text-2xl font-bold text-blue-600">BestReads</div>

            <!-- Navigation -->
            <nav class="flex items-center gap-6 ml-8">
                <a href="#" class="text-gray-700 hover:text-blue-600 font-medium">Home</a>
                <a href="#" class="text-gray-700 hover:text-blue-600 font-medium">My Bookshelves</a>
            </nav>

            <!-- Search bar -->
            <div class="flex-1 max-w-2xl mx-8 relative">
                <fa icon="search" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <input type="text" v-model="searchQuery" placeholder="Search books, authors, or genres..."
                    class="w-full px-4 py-2 pl-10 border-none bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>

            <!-- User actions -->
            <div class="flex items-center gap-6">
                <button class="relative !rounded-button cursor-pointer">
                    <fa icon="bell" class="scale-140" />
                    <span class="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                <div
                    class="cursor-pointer flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full">
                    <fa icon="user" />
                </div>
            </div>
        </div>
    </header>
</template>

<script setup lang="ts"></script>

<style scoped></style>
