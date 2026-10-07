<script setup lang="ts">
import { RouterView } from 'vue-router';
</script>

<template>
	<v-app>
		<v-main>
			<router-view v-slot="{ Component }">
				<keep-alive>
					<component :is="Component"></component>
				</keep-alive>
			</router-view>
		</v-main>
	</v-app>
</template>

<style scoped></style>
