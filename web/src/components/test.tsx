import { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { GraduationCap, Users, Calendar } from "lucide-react";

import { DataTable, type EventType } from "@/components/ui/table";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Loader } from "@/components/ui/loader";
import { Banner } from "@/components/ui/banner";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

type ScheduleEntry = {
	subject: string;
	teacher: string;
	startTime: string;
	endTime: string;
	type: EventType;
};

const scheduleColumns: ColumnDef<ScheduleEntry>[] = [
	{ accessorKey: "subject", header: "Subject" },
	{ accessorKey: "teacher", header: "Teacher" },
	{ accessorKey: "startTime", header: "Start" },
	{ accessorKey: "endTime", header: "End" },
];

export default function TestPage() {
	const [isModalOpen, setIsModalOpen] = useState(false);

	const scheduleRows = useMemo<ScheduleEntry[]>(
		() => [
			{
				subject: "Mathematics",
				teacher: "Mr. Singh",
				startTime: "08:00",
				endTime: "09:00",
				type: "class",
			},
			{
				subject: "Physics Exam",
				teacher: "Mrs. Lane",
				startTime: "09:30",
				endTime: "11:00",
				type: "exam",
			},
			{
				subject: "Biology",
				teacher: "Dr. Okafor",
				startTime: "11:15",
				endTime: "12:15",
				type: "class",
			},
		],
		[]
	);

	const progressStats = useMemo(
		() => [
			{ percentage: 80, color: "#16a34a", label: "Assignments Completed", value: "8/10" },
			{ percentage: 65, color: "#2563eb", label: "Attendance", value: "65%" },
			{ percentage: 92, color: "#f97316", label: "Course Progress", value: "92%" },
		],
		[]
	);

	const bannerCards = useMemo(
		() => [
			{ label: "Total Students", value: "1,280", color: "#2563eb", icon: <Users /> },
			{ label: "Active Courses", value: "36", color: "#16a34a", icon: <GraduationCap /> },
			{ label: "Upcoming Events", value: "5", color: "#f97316", icon: <Calendar /> },
		],
		[]
	);

	return (
		<div className="min-h-screen bg-slate-50 p-6 space-y-12">
			<section className="space-y-4">
				<h2 className="text-2xl font-semibold text-slate-900">Banner</h2>
				<div className="flex flex-wrap gap-6">
					{bannerCards.map((card) => (
						<Banner key={card.label} label={card.label} value={card.value} color={card.color} icon={card.icon} />
					))}
				</div>
			</section>

			<section className="space-y-4">
				<h2 className="text-2xl font-semibold text-slate-900">Progress Bars</h2>
				<div className="rounded-xl bg-white p-6 shadow-sm">
					{progressStats.map((stat) => (
						<ProgressBar
							key={stat.label}
							percentage={stat.percentage}
							color={stat.color}
							label={stat.label}
							value={stat.value}
						/>
					))}
				</div>
			</section>

			<section className="space-y-4">
				<h2 className="text-2xl font-semibold text-slate-900">Loader</h2>
				<div className="flex flex-wrap items-center gap-10 rounded-xl bg-white p-6 shadow-sm">
					<Loader size="sm" text="Checking records" />
					<Loader size="md" text="Fetching timetable" />
					<Loader size="lg" text="Preparing analytics" />
				</div>
			</section>

			<section className="space-y-4">
				<h2 className="text-2xl font-semibold text-slate-900">Table</h2>
				<DataTable
					title="Daily Schedule"
					description="Sample data confirming table interactions"
					columns={scheduleColumns}
					data={scheduleRows}
					eventTypeKey="type"
				/>
			</section>

			<section className="space-y-4">
				<h2 className="text-2xl font-semibold text-slate-900">Modal</h2>
				<Button onClick={() => setIsModalOpen(true)}>Open Modal</Button>
				<Modal
					isOpen={isModalOpen}
					onClose={() => setIsModalOpen(false)}
					title="Demo Modal"
					description="This modal confirms the UI integration."
					footer={
						<Button variant="secondary" onClick={() => setIsModalOpen(false)}>
							Close
						</Button>
					}
				>
					<p className="text-sm text-slate-600">
						Adjust the modal component props in this sandbox page to validate new behaviors before shipping them into
						production views.
					</p>
				</Modal>
			</section>
		</div>
	);
}
