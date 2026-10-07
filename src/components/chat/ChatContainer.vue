<template>
	<div class="d-flex flex-column w-100 h-100">
		<div style="max-height: 60dvh; overflow-y: auto">
			<div v-for="(msg, index) in chatHistory" :key="index">
				<div v-if="msg.role == 'user'" class="d-flex justify-end">
					<v-card class="w-75 my-5 h-100">
						<v-card-text>
							<div v-html="parseMarkdown(msg.content)"></div>
						</v-card-text>
					</v-card>
				</div>
				<div v-else>
					<v-card class="w-75 my-5 h-100">
						<v-card-text>
							<div v-html="parseMarkdown(msg.content)"></div>
						</v-card-text>
					</v-card>
				</div>
			</div>
		</div>

		<v-card
			class="w-100 d-flex flex-column pa-5 rounded-xl"
			elevation="5"
			style="min-height: 100px"
		>
			<v-textarea
				v-model="enteredPrompt"
				placeholder="Enter Your Prompt Here"
				variant="plain"
				max-rows="5"
				rows="1"
				auto-grow
				class="w-100"
				@keydown.enter.exact.prevent="onPressEnter"
			>
			</v-textarea>
			<div class="w-100 d-flex">
				<v-menu>
					<template #activator="{ props }">
						<v-icon v-bind="props" icon="mdi-plus" class="mx-2" @click="() => {}">
						</v-icon>
					</template>

					<v-list>
						<v-list-item @click="onClickUploadPdf"> Upload PDF </v-list-item>
					</v-list>
				</v-menu>
				<v-spacer></v-spacer>
				<v-icon
					:icon="currentlyStreamingMessages ? 'mdi-stop-circle-outline' : 'mdi-send'"
					@click="requestStopChat"
				></v-icon>
			</div>
		</v-card>
	</div>

	<v-dialog v-model="showUploadDialog">
		<div class="w-50 mx-auto h-100">
			<v-card min-height="600px" max-height="90%" class="h-100 d-flex flex-column">
				<div class="pa-3 d-flex justify-end">
					<v-icon icon="mdi-close" size="large" @click="() => (showUploadDialog = false)">
					</v-icon>
				</div>

				<v-spacer />
				<div class="pa-3 px-10 d-flex flex-column justify-center h-100">
					<v-file-upload filter-by-type=".pdf,.md" multiple v-model="uploadedFiles">
						<template #default>
							<v-file-upload-dropzone density="comfortable"></v-file-upload-dropzone>

							<v-file-upload-list max-height="300px">
								<template #default="{ files, onClickRemove }">
									<v-file-upload-item
										v-for="(file, index) in files"
										:key="file.name"
										:file="file"
										clearable
										@click:remove="onClickRemove(index)"
									>
									</v-file-upload-item>
								</template>
							</v-file-upload-list>
						</template>
					</v-file-upload>
					<v-btn
						variant="tonal"
						class="mx-auto"
						@click="uploadPDFToBackend"
						:loading="isUploadBtnLoading"
					>
						Upload
					</v-btn>
				</div>
				<v-spacer />
			</v-card>
		</div>
	</v-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, watch, type Ref } from 'vue';
import type { ChatMessage } from './Constants';
import { marked } from 'marked';
import { TYPE, useToast } from 'vue-toastification';

export default defineComponent({
	name: 'ChatContainer',
	setup() {
		const enteredPrompt = ref('');

		const toast = useToast();

		const currentlyStreamingMessages = ref(false);
		const showUploadDialog = ref(false);

		const isUploadBtnLoading = ref(false);

		const uploadedFiles = ref([]);

		const chatHistory: Ref<ChatMessage[]> = ref([]);

		const requestStopChat = () => {
			console.log('The user has requested to stop the chat');
		};

		const parseMarkdown = (text: string) => {
			return marked.parse(text, {
				async: false,
			});
		};

		const onPressEnter = async () => {
			const enteredText = enteredPrompt.value;
			if (enteredPrompt.value.trim() === '') return;
			enteredPrompt.value = '';

			chatHistory.value.push({
				role: 'user',
				content: enteredText,
			});

			const request = await fetch('http://localhost:8002/chat-response', {
				method: 'POST',
				body: JSON.stringify({
					user_query: enteredText,
				}),
				headers: { 'Content-Type': 'application/json' },
			});

			if (request.status == 200) {
				const assistanceResponse = await request.json();
				chatHistory.value.push({
					content: assistanceResponse.answer,
					role: 'assistant',
				});
			}
		};

		const onClickUploadPdf = () => {
			uploadedFiles.value = [];
			showUploadDialog.value = true;
		};

		const uploadPDFToBackend = async () => {
			const formData = new FormData();

			uploadedFiles.value.forEach((file) => {
				console.log(file);
				formData.append('pdfs', file);
			});

			isUploadBtnLoading.value = true;

			const uploading = await fetch('http://localhost:8002/upload-pdf', {
				method: 'POST',
				body: formData,
			});

			if (uploading.status == 200) {
				isUploadBtnLoading.value = false;
				showUploadDialog.value = false;
				console.log('files uploaded successfully');

				toast('File Uploaded Successfully', {
					type: TYPE.SUCCESS,
				});
			}
		};

		return {
			enteredPrompt,
			uploadedFiles,
			currentlyStreamingMessages,
			showUploadDialog,
			isUploadBtnLoading,
			chatHistory,
			onPressEnter,
			requestStopChat,
			onClickUploadPdf,
			uploadPDFToBackend,
			parseMarkdown,
		};
	},
});
</script>
