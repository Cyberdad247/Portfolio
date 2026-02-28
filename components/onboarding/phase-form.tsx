"use client";

import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import type { PhaseData, PhaseType, OnboardingData } from "./types";

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
	return (
		<Card className="bg-zinc-950 border border-zinc-900 shadow-2xl">
			<CardHeader>
				<CardTitle className="text-xl text-white">{phase.title}</CardTitle>
				<CardDescription className="text-zinc-400">
					{phase.description}
				</CardDescription>
			</CardHeader>

			<CardContent>
				<div className="space-y-6">
					{phase.questions.map((question) => {
						const QuestionIcon = question.icon;
						const value = formData[question.id as keyof OnboardingData] || "";

						return (
							<div key={question.id} className="space-y-2">
								<Label
									htmlFor={question.id}
									className="flex items-center gap-2 text-sm font-medium text-zinc-300"
								>
									<QuestionIcon className="h-4 w-4 text-rose-500" />
									{question.label}
								</Label>

								{question.type === "select" ? (
									<Select
										value={value}
										onValueChange={(val) => onInputChange(question.id, val)}
									>
										<SelectTrigger
											id={question.id}
											className="bg-zinc-900 border-zinc-800 text-white"
										>
											<SelectValue
												placeholder={question.placeholder || "Select an option"}
											/>
										</SelectTrigger>
										<SelectContent className="bg-zinc-950 border-zinc-800">
											{question.options?.map((option) => (
												<SelectItem
													key={option}
													value={option}
													className="text-zinc-200 focus:bg-zinc-800 focus:text-white"
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
										className="resize-none bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600 focus-visible:ring-rose-500"
									/>
								) : (
									<Input
										id={question.id}
										type={question.type || "text"}
										placeholder={question.placeholder}
										value={value}
										onChange={(e) => onInputChange(question.id, e.target.value)}
										className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600 focus-visible:ring-rose-500"
									/>
								)}
							</div>
						);
					})}
				</div>

				{/* Navigation Buttons */}
				<div className="flex justify-between mt-8 pt-6 border-t border-zinc-900">
					<Button
						variant="ghost"
						onClick={onPreviousPhase}
						className="gap-2 text-zinc-400 hover:text-white hover:bg-zinc-900"
					>
						<ArrowRight className="h-4 w-4 rotate-180" />
						{currentPhase === 1 ? "Cancel" : "Previous Phase"}
					</Button>
					<Button
						onClick={onNextPhase}
						className="bg-gradient-to-r from-rose-500 to-violet-600 hover:from-rose-600 hover:to-violet-700 text-white gap-2 shadow-lg shadow-rose-500/20"
					>
						{currentPhase === 3
							? "Complete Onboarding"
							: "Continue to Next Phase"}
						<ArrowRight className="h-4 w-4" />
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
