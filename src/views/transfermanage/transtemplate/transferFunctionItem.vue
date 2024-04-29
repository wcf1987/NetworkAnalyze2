<script setup lang="ts">
import Image1 from './assets/image1.png';
import Image2 from './assets/image2.png';
import Image3 from './assets/image3.png';
import Image4 from './assets/image4.png';
import Image5 from './assets/image5.png';
import Image6 from './assets/image6.png';
import Image7 from './assets/image7.png';
import Image8 from './assets/image8.png';
import Image9 from './assets/image9.png';
import Image10 from './assets/image10.png';
import Image11 from './assets/image11.png';
import Image12 from './assets/image12.png';
import { Random } from 'mockjs';
import { useThemeConfig } from '/@/stores/themeConfig';

const props = defineProps({
	name: {
		type: String,
		default: () => '',
	},
	children: {
		type: Array<{
			Name: String;
			Describes: String;
		}>,
	},
});
const Images = [Image1, Image10, Image11, Image12, Image2, Image3, Image4, Image5, Image6, Image7, Image8, Image9];
const storesThemeConfig = useThemeConfig();
const isIsDark = storesThemeConfig.$state.themeConfig.isIsDark;
</script>
<template>
	<div class="transgerFunctionItemWrapper">
		<div
			:style="{
				color: isIsDark ? '#ccc' : '#000',
				backgroundImage: isIsDark
					? 'linear-gradient(270deg, rgb(175, 179, 186) 0%, rgba(175, 179, 186, 0) 100%)'
					: 'linear-gradient(270deg, rgba(245, 247, 250, 0) 0%, rgb(245, 247, 250) 100%)',
			}"
			class="title"
		>
			{{ props.name.split(',').join(' → ') }}
		</div>
		<div class="content">
			<div class="transferFunctionItem" :style="{ backgroundImage: `url(${Images[Random.integer(0, 11)]})` }" v-for="item in $props.children">
				<div class="template-description">{{ item.Describes }}</div>
				<footer>
					<span></span>
					<div class="template-name">{{ item.Name }}</div>
					<el-button type="text">编辑</el-button>
				</footer>
			</div>
		</div>
	</div>
</template>
<style lang="scss" scoped>
.transgerFunctionItemWrapper {
	display: flex;
	flex-direction: column;
	margin-bottom: 8px;
	.title {
		height: 38px;
		line-height: 38px;
		padding: 0 16px;
		margin-bottom: 16px;
	}
	.content {
		display: flex;
		flex-wrap: wrap;
		padding: 0 8px;
	}
}
.transferFunctionItem {
	width: 250px;
	height: 150px;
	display: flex;
	flex-direction: column;
	padding: 16px;
	border: 1px solid #ccc;
	margin-right: 24px;
	border-radius: 4px;
	margin-bottom: 24px;
	position: relative;
	background-size: cover;

	&::after {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		content: '';
		background-color: rgba(255, 255, 255, 0.6);
		z-index: 0;
	}
	.template-description {
		padding: 8px;
		flex-grow: 1;
		// color: rgba($color: #000000, $alpha: 0.7);
	}
	.template-name {
		text-align: center;
		font-size: 16px;
	}
	.template-name,
	.template-description,
	footer {
		z-index: 1;
	}
	footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		span {
			width: 2em;
		}
		button {
			padding: 0 8px;
		}
	}
}
</style>
