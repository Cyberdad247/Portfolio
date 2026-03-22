"use client";

import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { OnboardingData, PhaseData, PhaseType } from "./types";

interface PhaseFormProps {
	currentPhase: PhaseType;
	phase: PhaseData;
	formData: OnboardingData;
	onInputChange: (id: string, value: string) => void;
	onNextPhase: () => void;
	onPreviousPhase: () => void;
}

export function PhaseForm({
	currentPhase,
	phase,
	formData,
	onInputChange,
	onNextPhase,
	onPreviousPhase,
}: PhaseFormProps) {
	const PhaseIcon = phase.icon;
	const answeredCount = phase.questions.filter((q) => {
		const value = formData[q.id as keyof OnboardingData];
		return value && value.length > 0;
	}).length;
	const totalCount = phase.questions.length;

	return (
		<div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] shadow-2xl backdrop-blur-2xl">
			{/* Top gradient line */}
			<div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-500/60 to-transparent" />
			{/* Inner glow */}
			<div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent" />

			{/* Header */}
			<div className="relative z-10 border-b border-white/[0.06] px-6 py-5">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-rose-500/20 to-violet-600/20 ring-1 ring-white/[0.08]">
							<PhaseIcon className="h-4 w-4 text-rose-400" />
						</div>
						<div>
							<h2 className="text-lg font-bold tracking-tight text-white">
								{phase.title}
							</h2>
							<p className="mt-0.5 text-[12px] text-zinc-500">
								{phase.description}
							</p>
						</div>
					</div>
					<div className="flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1">
						<CheckCircle2 className="h-3 w-3 text-emerald-400" />
						<span className="font-mono text-[10px] text-zinc-400">
							{answeredCount}/{totalCount}
						</span>
					</div>
				</div>
			</div>

			{/* Form Fields */}
			<div className="relative z-10 space-y-5 px-6 py-6">
				{phase.questions.map((question) => {
					const QuestionIcon = question.icon;
					const value = formData[question.id as keyof OnboardingData] || "";
					const isFilled = value.length > 0;

					return (
						<div key={question.id} className="group space-y-2">
							<Label
								htmlFor={question.id}
								className="flex items-center gap-2 text-[13px] font-medium text-zinc-300 transition-colors group-focus-within:text-white"
							>
								<QuestionIcon
									className={`h-3.5 w-3.5 transition-colors ${isFilled ? "text-emerald-400" : "text-rose-400/70"}`}
								/>
								{question.label}
								{isFilled && (
									<CheckCircle2 className="ml-auto h-3 w-3 text-emerald-400/60" />
								)}
							</Label>

							{question.type === "select" ? (
								<Select
									value={value}
									onValueChange={(val) => onInputChange(question.id, val)}
								>
									<SelectTrigger
										id={question.id}
										className="border-white/[0.08] bg-white/[0.03] text-white backdrop-blur-sm transition-all hover:border-white/[0.15] hover:bg-white/[0.05] focus:border-rose-500/40 focus:ring-rose-500/20"
									>
										<SelectValue
											placeholder={question.placeholder || "Select an option"}
										/>
									</SelectTrigger>
									<SelectContent className="border-white/[0.08] bg-zinc-950/95 backdrop-blur-xl">
										{question.options?.map((option) => (
											<SelectItem
												key={option}
												value={option}
												className="text-zinc-200 focus:bg-white/[0.08] focus:text-white"
											>
												{option}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							) : question.type === "textarea" ? (
								<Textarea
									id={question.id}
									placeholder={question.placeholder}
									value={value}
									onChange={(e) => onInputChange(question.id, e.target.value)}
									rows={4}
									className="resize-none border-white/[0.08] bg-white/[0.03] text-white backdrop-blur-sm transition-all placeholder:text-zinc-600 hover:border-white/[0.15] hover:bg-white/[0.05] focus-visible:border-rose-500/40 focus-visible:ring-rose-500/20"
								/>
							) : (
								<Input
									id={question.id}
									type={question.type || "text"}
									placeholder={question.placeholder}
									value={value}
									onChange={(e) => onInputChange(question.id, e.target.value)}
									className="border-white/[0.08] bg-white/[0.03] text-white backdrop-blur-sm transition-all placeholder:text-zinc-600 hover:border-white/[0.15] hover:bg-white/[0.05] focus-visible:border-rose-500/40 focus-visible:ring-rose-500/20"
								/>
							)}
						</div>
					);
				})}
			</div>

			{/* Navigation */}
			<div className="relative z-10 flex items-center justify-between border-t border-white/[0.06] px-6 py-4">
				<Button
					variant="ghost"
					onClick={onPreviousPhase}
					className="gap-2 text-zinc-500 transition-all hover:bg-white/[0.05] hover:text-white"
				>
					<ArrowRight className="h-4 w-4 rotate-180" />
					<span className="font-mono text-[10px] uppercase tracking-wider">
						{currentPhase === 1 ? "Cancel" : "Previous"}
					</span>
				</Button>
				<Button
					onClick={onNextPhase}
					className="gap-2 bg-gradient-to-r from-rose-500 to-violet-600 text-white shadow-lg shadow-rose-500/20 transition-all hover:from-rose-600 hover:to-violet-700 hover:shadow-rose-500/30 active:scale-[0.98]"
				>
					<span className="font-mono text-[10px] uppercase tracking-wider">
						{currentPhase === 3 ? "Complete" : "Continue"}
					</span>
					<ArrowRight className="h-4 w-4" />
				</Button>
			</div>
		</div>
	);
}
