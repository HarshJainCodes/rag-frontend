import { createApp } from 'vue';
import { createPinia } from 'pinia';

import '@mdi/font/css/materialdesignicons.css';

// Vuetify
import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { aliases, mdi } from 'vuetify/iconsets/mdi';

import Toast, { type PluginOptions, POSITION } from 'vue-toastification';
import 'vue-toastification/dist/index.css';

import App from './App.vue';
import router from './router';

const vuetify = createVuetify({
	components,
	directives,
	icons: {
		defaultSet: 'mdi',
		aliases,
		sets: {
			mdi,
		},
	},
});

const app = createApp(App);

const options: PluginOptions = {
	position: POSITION.TOP_RIGHT,
};

app.use(createPinia());
app.use(router);
app.use(vuetify);
app.use(Toast, options);

app.mount('#app');
