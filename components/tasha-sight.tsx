"use client";

import React from "react";
import { useTasha } from "./tasha-provider";

interface TashaSightProps {
	id: string;
	insight?: string;
	children: React.ReactNode;
	className?: string;
}

/**
 * TashaSight Wrapper (L7 Interface)
 * "Tags" a component so Tasha can "see" it and react contextually.
 */
export function TashaSight({ id, insight, children, className }: TashaSightProps) {
	const { setFocusedElement } = useTasha();

	return (
		<div
			onMouseEnter={() => setFocusedElement(id)}
			onMouseLeave={() => setFocusedElement(undefined)}
			data-tasha-insight={id}
			className={className}
		>
			{children}
		</div>
	);
}
