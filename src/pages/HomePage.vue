<template>
	<div class="w-100 h-100" style="min-height: 100dvh">
		<div class="d-flex flex-column h-100 justify-center">
			<div class="d-flex text-display-medium w-100 justify-center">
				<!-- <div>Your Rag Powered AI Chatbot</div> -->
			</div>

			<div class="d-flex mt-15 justify-center w-75 mx-auto">
				<chat-container />
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ChatContainer from '@/components/chat/ChatContainer.vue';

export default defineComponent({
	name: 'HomePage',
	components: {
		ChatContainer,
	},
	setup() {},
});
</script>
