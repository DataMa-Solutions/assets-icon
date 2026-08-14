#!/usr/bin/env node
/**
 * Rebuild google-analytics-outline.svg with a 2px inset stroke.
 * Outer silhouettes match the filled logo so gaps between elements stay unchanged.
 */

const fs = require('fs');
const path = require('path');

const ICONS_DIRECTORY = path.join(__dirname, '../icons/vue3');
const STROKE = 2;

function formatNumber(value) {
	const rounded = Math.round(value * 1000) / 1000;
	return Number.isInteger(rounded) ? String(rounded) : String(rounded);
}

function circleRingInset(centerX, centerY, outerRadius, stroke) {
	const innerRadius = Math.max(0.2, outerRadius - stroke);
	const outer = [
		`M${formatNumber(centerX + outerRadius)},${formatNumber(centerY)}`,
		`A${formatNumber(outerRadius)},${formatNumber(outerRadius)} 0 1 1 ${formatNumber(centerX - outerRadius)},${formatNumber(centerY)}`,
		`A${formatNumber(outerRadius)},${formatNumber(outerRadius)} 0 1 1 ${formatNumber(centerX + outerRadius)},${formatNumber(centerY)} Z`,
	].join(' ');
	const inner = [
		`M${formatNumber(centerX + innerRadius)},${formatNumber(centerY)}`,
		`A${formatNumber(innerRadius)},${formatNumber(innerRadius)} 0 1 0 ${formatNumber(centerX - innerRadius)},${formatNumber(centerY)}`,
		`A${formatNumber(innerRadius)},${formatNumber(innerRadius)} 0 1 0 ${formatNumber(centerX + innerRadius)},${formatNumber(centerY)} Z`,
	].join(' ');
	return `${outer} ${inner}`;
}

function verticalStadiumOutlineInset(centerX, top, bottom, outerWidth, stroke) {
	const outerRadius = outerWidth / 2;
	const innerWidth = Math.max(0.4, outerWidth - stroke * 2);
	const innerRadius = innerWidth / 2;
	const innerTop = top + stroke;
	const innerBottom = bottom - stroke;

	const outer = [
		`M${formatNumber(centerX - outerRadius)},${formatNumber(top + outerRadius)}`,
		`A${formatNumber(outerRadius)},${formatNumber(outerRadius)} 0 0 1 ${formatNumber(centerX + outerRadius)},${formatNumber(top + outerRadius)}`,
		`L${formatNumber(centerX + outerRadius)},${formatNumber(bottom - outerRadius)}`,
		`A${formatNumber(outerRadius)},${formatNumber(outerRadius)} 0 0 1 ${formatNumber(centerX - outerRadius)},${formatNumber(bottom - outerRadius)} Z`,
	].join(' ');

	const inner = [
		`M${formatNumber(centerX - innerRadius)},${formatNumber(innerTop + innerRadius)}`,
		`L${formatNumber(centerX - innerRadius)},${formatNumber(innerBottom - innerRadius)}`,
		`A${formatNumber(innerRadius)},${formatNumber(innerRadius)} 0 0 0 ${formatNumber(centerX + innerRadius)},${formatNumber(innerBottom - innerRadius)}`,
		`L${formatNumber(centerX + innerRadius)},${formatNumber(innerTop + innerRadius)}`,
		`A${formatNumber(innerRadius)},${formatNumber(innerRadius)} 0 0 0 ${formatNumber(centerX - innerRadius)},${formatNumber(innerTop + innerRadius)} Z`,
	].join(' ');

	return `${outer} ${inner}`;
}

// Geometry copied from the fitted filled logo (google-analytics.svg)
const circle = circleRingInset(5.164, 19.834, 2.582, STROKE);
const mediumBar = verticalStadiumOutlineInset(12.018, 9.415, 22.5, 5.142, STROKE);
const tallBar = verticalStadiumOutlineInset(18.832, 1.5, 22.416, 5.164, STROKE);

const svg = [
	'<?xml version="1.0" encoding="UTF-8"?>',
	'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">',
	`  <path fill="currentColor" fill-rule="evenodd" d="${[circle, mediumBar, tallBar].join(' ')}"/>`,
	'</svg>',
	'',
].join('\n');

fs.writeFileSync(path.join(ICONS_DIRECTORY, 'google-analytics-outline.svg'), svg, 'utf8');
console.log('wrote google-analytics-outline.svg (2px inset)');
