#!/usr/bin/env python3
"""Generate filled 24x24 vue3 source and export icons (webfont-safe)."""

from __future__ import annotations

import math
from pathlib import Path

OUTPUT_DIRECTORY = Path(__file__).resolve().parent.parent / "icons" / "vue3"
STROKE_WIDTH = 2.0


def format_number(value: float) -> str:
	rounded = round(value, 2)
	if math.isclose(rounded, int(rounded)):
		return str(int(rounded))
	text = f"{rounded:.2f}"
	return text.rstrip("0").rstrip(".")


def capsule(x1: float, y1: float, x2: float, y2: float, width: float = STROKE_WIDTH) -> str:
	radius = width / 2
	delta_x = x2 - x1
	delta_y = y2 - y1
	length = math.hypot(delta_x, delta_y)
	if length < 0.001:
		return filled_circle(x1, y1, radius)

	unit_x = delta_x / length
	unit_y = delta_y / length
	perp_x = -unit_y * radius
	perp_y = unit_x * radius

	ax, ay = x1 + perp_x, y1 + perp_y
	bx, by = x1 - perp_x, y1 - perp_y
	cx, cy = x2 - perp_x, y2 - perp_y
	dx, dy = x2 + perp_x, y2 + perp_y

	return (
		f"M{format_number(ax)},{format_number(ay)} "
		f"L{format_number(dx)},{format_number(dy)} "
		f"A{format_number(radius)},{format_number(radius)} 0 0 1 {format_number(cx)},{format_number(cy)} "
		f"L{format_number(bx)},{format_number(by)} "
		f"A{format_number(radius)},{format_number(radius)} 0 0 1 {format_number(ax)},{format_number(ay)} Z"
	)


def filled_circle(center_x: float, center_y: float, radius: float) -> str:
	return (
		f"M{format_number(center_x + radius)},{format_number(center_y)} "
		f"A{format_number(radius)},{format_number(radius)} 0 1 1 {format_number(center_x - radius)},{format_number(center_y)} "
		f"A{format_number(radius)},{format_number(radius)} 0 1 1 {format_number(center_x + radius)},{format_number(center_y)} Z"
	)


def circle_ring(center_x: float, center_y: float, radius: float, width: float = STROKE_WIDTH) -> str:
	outer_radius = radius + width / 2
	inner_radius = max(0.2, radius - width / 2)
	outer = (
		f"M{format_number(center_x + outer_radius)},{format_number(center_y)} "
		f"A{format_number(outer_radius)},{format_number(outer_radius)} 0 1 1 {format_number(center_x - outer_radius)},{format_number(center_y)} "
		f"A{format_number(outer_radius)},{format_number(outer_radius)} 0 1 1 {format_number(center_x + outer_radius)},{format_number(center_y)} Z"
	)
	inner = (
		f"M{format_number(center_x + inner_radius)},{format_number(center_y)} "
		f"A{format_number(inner_radius)},{format_number(inner_radius)} 0 1 0 {format_number(center_x - inner_radius)},{format_number(center_y)} "
		f"A{format_number(inner_radius)},{format_number(inner_radius)} 0 1 0 {format_number(center_x + inner_radius)},{format_number(center_y)} Z"
	)
	return f"{outer} {inner}"


def ellipse_ring(
	center_x: float,
	center_y: float,
	radius_x: float,
	radius_y: float,
	width: float = STROKE_WIDTH,
) -> str:
	outer_x = radius_x + width / 2
	outer_y = radius_y + width / 2
	inner_x = max(0.2, radius_x - width / 2)
	inner_y = max(0.2, radius_y - width / 2)
	outer = (
		f"M{format_number(center_x + outer_x)},{format_number(center_y)} "
		f"A{format_number(outer_x)},{format_number(outer_y)} 0 1 1 {format_number(center_x - outer_x)},{format_number(center_y)} "
		f"A{format_number(outer_x)},{format_number(outer_y)} 0 1 1 {format_number(center_x + outer_x)},{format_number(center_y)} Z"
	)
	inner = (
		f"M{format_number(center_x + inner_x)},{format_number(center_y)} "
		f"A{format_number(inner_x)},{format_number(inner_y)} 0 1 0 {format_number(center_x - inner_x)},{format_number(center_y)} "
		f"A{format_number(inner_x)},{format_number(inner_y)} 0 1 0 {format_number(center_x + inner_x)},{format_number(center_y)} Z"
	)
	return f"{outer} {inner}"


def ellipse_arc_ribbon(
	center_x: float,
	center_y: float,
	radius_x: float,
	radius_y: float,
	start_degrees: float,
	end_degrees: float,
	width: float = STROKE_WIDTH,
) -> str:
	half = width / 2
	start_angle = math.radians(start_degrees)
	end_angle = math.radians(end_degrees)
	outer_x = radius_x + half
	outer_y = radius_y + half
	inner_x = max(0.2, radius_x - half)
	inner_y = max(0.2, radius_y - half)
	large_arc = 1 if abs(end_degrees - start_degrees) > 180 else 0

	outer_start_x = center_x + outer_x * math.cos(start_angle)
	outer_start_y = center_y + outer_y * math.sin(start_angle)
	outer_end_x = center_x + outer_x * math.cos(end_angle)
	outer_end_y = center_y + outer_y * math.sin(end_angle)
	inner_start_x = center_x + inner_x * math.cos(start_angle)
	inner_start_y = center_y + inner_y * math.sin(start_angle)
	inner_end_x = center_x + inner_x * math.cos(end_angle)
	inner_end_y = center_y + inner_y * math.sin(end_angle)

	ribbon = (
		f"M{format_number(outer_start_x)},{format_number(outer_start_y)} "
		f"A{format_number(outer_x)},{format_number(outer_y)} 0 {large_arc} 1 {format_number(outer_end_x)},{format_number(outer_end_y)} "
		f"L{format_number(inner_end_x)},{format_number(inner_end_y)} "
		f"A{format_number(inner_x)},{format_number(inner_y)} 0 {large_arc} 0 {format_number(inner_start_x)},{format_number(inner_start_y)} Z"
	)
	start_cap = filled_circle(
		center_x + radius_x * math.cos(start_angle),
		center_y + radius_y * math.sin(start_angle),
		half,
	)
	end_cap = filled_circle(
		center_x + radius_x * math.cos(end_angle),
		center_y + radius_y * math.sin(end_angle),
		half,
	)
	return f"{ribbon} {start_cap} {end_cap}"


def u_body(center_x: float, baseline_y: float, body_width: float, body_height: float, stroke: float = STROKE_WIDTH) -> str:
	half_width = body_width / 2
	outer_radius = half_width
	inner_radius = max(0.2, half_width - stroke)
	top = baseline_y - body_height
	left = center_x - half_width
	right = center_x + half_width
	return (
		f"M{format_number(left)},{format_number(baseline_y)} "
		f"L{format_number(left)},{format_number(top + outer_radius)} "
		f"A{format_number(outer_radius)},{format_number(outer_radius)} 0 0 1 {format_number(right)},{format_number(top + outer_radius)} "
		f"L{format_number(right)},{format_number(baseline_y)} "
		f"L{format_number(right - stroke)},{format_number(baseline_y)} "
		f"L{format_number(right - stroke)},{format_number(top + outer_radius)} "
		f"A{format_number(inner_radius)},{format_number(inner_radius)} 0 0 0 {format_number(left + stroke)},{format_number(top + outer_radius)} "
		f"L{format_number(left + stroke)},{format_number(baseline_y)} Z"
	)


def rounded_rect(x: float, y: float, width: float, height: float, radius: float, clockwise: bool = True) -> str:
	radius = min(radius, width / 2, height / 2)
	if clockwise:
		return (
			f"M{format_number(x + radius)},{format_number(y)} "
			f"L{format_number(x + width - radius)},{format_number(y)} "
			f"Q{format_number(x + width)},{format_number(y)} {format_number(x + width)},{format_number(y + radius)} "
			f"L{format_number(x + width)},{format_number(y + height - radius)} "
			f"Q{format_number(x + width)},{format_number(y + height)} {format_number(x + width - radius)},{format_number(y + height)} "
			f"L{format_number(x + radius)},{format_number(y + height)} "
			f"Q{format_number(x)},{format_number(y + height)} {format_number(x)},{format_number(y + height - radius)} "
			f"L{format_number(x)},{format_number(y + radius)} "
			f"Q{format_number(x)},{format_number(y)} {format_number(x + radius)},{format_number(y)} Z"
		)
	return (
		f"M{format_number(x + radius)},{format_number(y)} "
		f"Q{format_number(x)},{format_number(y)} {format_number(x)},{format_number(y + radius)} "
		f"L{format_number(x)},{format_number(y + height - radius)} "
		f"Q{format_number(x)},{format_number(y + height)} {format_number(x + radius)},{format_number(y + height)} "
		f"L{format_number(x + width - radius)},{format_number(y + height)} "
		f"Q{format_number(x + width)},{format_number(y + height)} {format_number(x + width)},{format_number(y + height - radius)} "
		f"L{format_number(x + width)},{format_number(y + radius)} "
		f"Q{format_number(x + width)},{format_number(y)} {format_number(x + width - radius)},{format_number(y)} "
		f"L{format_number(x + radius)},{format_number(y)} Z"
	)


def rounded_rect_outline(x: float, y: float, width: float, height: float, radius: float, stroke: float = STROKE_WIDTH) -> str:
	inner_radius = max(0.15, radius - stroke)
	outer = rounded_rect(x, y, width, height, radius, clockwise=True)
	inner = rounded_rect(x + stroke, y + stroke, width - 2 * stroke, height - 2 * stroke, inner_radius, clockwise=False)
	return f"{outer} {inner}"


def rounded_bar(x: float, y: float, width: float, height: float, radius: float | None = None) -> str:
	if radius is None:
		radius = min(width, height) / 2
	return rounded_rect(x, y, width, height, radius, clockwise=True)


def plus_sign(center_x: float, center_y: float, arm_length: float, width: float = STROKE_WIDTH) -> str:
	return " ".join(
		[
			capsule(center_x - arm_length, center_y, center_x + arm_length, center_y, width),
			capsule(center_x, center_y - arm_length, center_x, center_y + arm_length, width),
		]
	)


def four_point_star(center_x: float, center_y: float, outer_radius: float, inner_radius: float) -> str:
	points: list[tuple[float, float]] = []
	for index in range(8):
		radius = outer_radius if index % 2 == 0 else inner_radius
		angle = math.radians(-90 + index * 45)
		points.append((center_x + radius * math.cos(angle), center_y + radius * math.sin(angle)))
	commands = [f"M{format_number(points[0][0])},{format_number(points[0][1])}"]
	for x, y in points[1:]:
		commands.append(f"L{format_number(x)},{format_number(y)}")
	commands.append("Z")
	return " ".join(commands)


def file_outline() -> str:
	fold = f"{capsule(14, 3.2, 14, 8)} {capsule(14, 8, 19.2, 8)}"
	return f"{rounded_rect_outline(4, 2, 16, 20, 2)} {fold}"


def cylinder() -> str:
	return " ".join(
		[
			ellipse_ring(12, 6.5, 8, 2.6),
			ellipse_ring(12, 12, 8, 2.6),
			ellipse_ring(12, 17.5, 8, 2.6),
			capsule(4, 6.5, 4, 17.5),
			capsule(20, 6.5, 20, 17.5),
		]
	)


def google_sheets() -> str:
	return " ".join(
		[
			rounded_rect_outline(3, 3, 18, 18, 2),
			capsule(3, 9, 21, 9),
			capsule(9, 9, 9, 21),
			capsule(15, 9, 15, 21),
		]
	)


def google_analytics() -> str:
	return " ".join(
		[
			rounded_bar(4.5, 13, 4, 8, 1),
			rounded_bar(10, 8, 4, 13, 1),
			rounded_bar(15.5, 4, 4, 17, 1),
		]
	)


def csv() -> str:
	return " ".join(
		[
			file_outline(),
			capsule(8, 12, 16, 12),
			capsule(8, 15.5, 16, 15.5),
			capsule(8, 19, 13, 19),
		]
	)


def excel() -> str:
	return " ".join(
		[
			file_outline(),
			rounded_rect_outline(7, 11.5, 10, 8, 0.8),
			capsule(7, 15.5, 17, 15.5),
			capsule(12, 11.5, 12, 19.5),
		]
	)


def google_bigquery() -> str:
	return " ".join(
		[
			circle_ring(10, 10, 6.2),
			rounded_bar(6.6, 10.2, 1.6, 4.2, 0.7),
			rounded_bar(9.2, 7.6, 1.6, 6.8, 0.7),
			rounded_bar(11.8, 9.2, 1.6, 5.2, 0.7),
			capsule(14.6, 14.6, 20.2, 20.2),
		]
	)


def snowflake() -> str:
	parts: list[str] = []
	for degrees in range(0, 360, 60):
		angle = math.radians(degrees - 90)
		end_x = 12 + 8.2 * math.cos(angle)
		end_y = 12 + 8.2 * math.sin(angle)
		parts.append(capsule(12, 12, end_x, end_y))
		branch_origin_x = 12 + 5.2 * math.cos(angle)
		branch_origin_y = 12 + 5.2 * math.sin(angle)
		for side in (-1, 1):
			branch_angle = angle + side * math.radians(55)
			parts.append(
				capsule(
					branch_origin_x,
					branch_origin_y,
					branch_origin_x + 2.6 * math.cos(branch_angle),
					branch_origin_y + 2.6 * math.sin(branch_angle),
				)
			)
	return " ".join(parts)


def sql() -> str:
	return cylinder()


def facebook() -> str:
	return " ".join(
		[
			rounded_rect_outline(3.5, 3.5, 17, 17, 4),
			capsule(10.3, 8.2, 10.3, 16.6),
			capsule(10.3, 11.5, 14.8, 11.5),
			capsule(10.3, 8.2, 14.1, 8.2),
			capsule(14.1, 8.2, 14.1, 9.6),
		]
	)


def metabase() -> str:
	size = 6.2
	gap = 2.2
	origin = (24 - (2 * size + gap)) / 2
	return " ".join(
		[
			rounded_rect_outline(origin, origin, size, size, 1.2),
			rounded_rect_outline(origin + size + gap, origin, size, size, 1.2),
			rounded_rect_outline(origin, origin + size + gap, size, size, 1.2),
			rounded_rect_outline(origin + size + gap, origin + size + gap, size, size, 1.2),
		]
	)


def piano() -> str:
	nodes = [
		(5.2, 19.2),
		(9.4, 12.2),
		(13.2, 5.2),
		(18.8, 12.2),
		(15.4, 19.2),
	]
	edges = [(0, 1), (1, 2), (2, 3), (3, 4), (0, 4), (1, 3)]
	parts = [capsule(*nodes[start], *nodes[end]) for start, end in edges]
	parts.extend(filled_circle(x, y, 1.55) for x, y in nodes)
	return " ".join(parts)


def redshift() -> str:
	parts = [cylinder()]
	nodes = [
		(8.2, 14.8),
		(12.2, 10.6),
		(16.4, 13.2),
		(12.6, 16.8),
	]
	for start, end in [(0, 1), (1, 2), (1, 3), (0, 3)]:
		parts.append(capsule(*nodes[start], *nodes[end], 1.6))
	parts.extend(filled_circle(x, y, 1.35) for x, y in nodes)
	return " ".join(parts)


def mail() -> str:
	return " ".join(
		[
			rounded_rect_outline(2.5, 5, 19, 14, 2),
			capsule(2.8, 6.2, 12, 13.2),
			capsule(12, 13.2, 21.2, 6.2),
		]
	)


def calendar() -> str:
	parts = [
		rounded_rect_outline(3, 5, 18, 16, 2),
		capsule(3, 10, 21, 10),
		capsule(8, 3, 8, 7),
		capsule(16, 3, 16, 7),
	]
	for row in range(3):
		for column in range(3):
			x = 6.4 + column * 4.0
			y = 12.2 + row * 2.8
			parts.append(rounded_bar(x, y, 1.7, 1.7, 0.4))
	return " ".join(parts)


def ai_generator() -> str:
	return " ".join(
		[
			four_point_star(10.2, 13, 7.2, 2.15),
			four_point_star(17.6, 6.6, 3.6, 1.15),
		]
	)


def tableau() -> str:
	return " ".join(
		[
			plus_sign(12, 13.2, 3.4, 1.8),
			plus_sign(12, 4.6, 2.0, 1.5),
			plus_sign(5.2, 8.4, 1.9, 1.5),
			plus_sign(18.8, 8.4, 1.9, 1.5),
			plus_sign(5.2, 18.6, 1.9, 1.5),
			plus_sign(18.8, 18.6, 1.9, 1.5),
		]
	)


def slack() -> str:
	bar_width = 3.1
	return " ".join(
		[
			rounded_bar(7.2, 5.2, 8.2, bar_width, bar_width / 2),
			filled_circle(17.6, 6.75, 1.55),
			rounded_bar(15.7, 7.2, bar_width, 8.2, bar_width / 2),
			filled_circle(17.25, 17.6, 1.55),
			rounded_bar(8.6, 15.7, 8.2, bar_width, bar_width / 2),
			filled_circle(6.4, 17.25, 1.55),
			rounded_bar(5.2, 8.6, bar_width, 8.2, bar_width / 2),
			filled_circle(6.75, 6.4, 1.55),
		]
	)


def teams() -> str:
	return " ".join(
		[
			circle_ring(16.5, 8.0, 2.35),
			ellipse_arc_ribbon(16.5, 22.2, 4.6, 6.4, 258, 348),
			circle_ring(9, 7.3, 3.15),
			u_body(9, 21, 8.8, 7.8),
		]
	)


def url() -> str:
	parts: list[str] = []
	for center_x, center_y in ((8.2, 12), (15.8, 12)):
		points_outer: list[tuple[float, float]] = []
		points_inner: list[tuple[float, float]] = []
		for index in range(24):
			angle = math.radians(index * 15 - 35)
			rotated_x = 5.4 * math.cos(angle)
			rotated_y = 3.15 * math.sin(angle)
			world_x = rotated_x * math.cos(math.radians(-40)) - rotated_y * math.sin(math.radians(-40))
			world_y = rotated_x * math.sin(math.radians(-40)) + rotated_y * math.cos(math.radians(-40))
			points_outer.append((center_x + world_x, center_y + world_y))
			inner_x = 3.4 * math.cos(angle)
			inner_y = 1.15 * math.sin(angle)
			world_inner_x = inner_x * math.cos(math.radians(-40)) - inner_y * math.sin(math.radians(-40))
			world_inner_y = inner_x * math.sin(math.radians(-40)) + inner_y * math.cos(math.radians(-40))
			points_inner.append((center_x + world_inner_x, center_y + world_inner_y))
		outer_commands = [f"M{format_number(points_outer[0][0])},{format_number(points_outer[0][1])}"]
		outer_commands.extend(f"L{format_number(x)},{format_number(y)}" for x, y in points_outer[1:])
		outer_commands.append("Z")
		inner_commands = [f"M{format_number(points_inner[0][0])},{format_number(points_inner[0][1])}"]
		inner_commands.extend(f"L{format_number(x)},{format_number(y)}" for x, y in reversed(points_inner[1:]))
		inner_commands.append("Z")
		parts.append(" ".join(outer_commands + inner_commands))
	return " ".join(parts)


ICONS = {
	"csv": csv,
	"sql": sql,
	"facebook": facebook,
	"metabase": metabase,
	"piano": piano,
	"redshift": redshift,
	"mail": mail,
	"calendar": calendar,
	"ai-generator": ai_generator,
	"tableau": tableau,
	"teams": teams,
	"url": url,
}


def write_icon(name: str, path_data: str) -> None:
	svg = (
		'<?xml version="1.0" encoding="UTF-8"?>\n'
		'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">\n'
		f'  <path fill="currentColor" d="{path_data}"/>\n'
		"</svg>\n"
	)
	output_path = OUTPUT_DIRECTORY / f"{name}.svg"
	output_path.write_text(svg, encoding="utf-8")
	print(f"wrote {output_path.name}")


def main() -> None:
	OUTPUT_DIRECTORY.mkdir(parents=True, exist_ok=True)
	for name, builder in ICONS.items():
		write_icon(name, builder())


if __name__ == "__main__":
	main()
