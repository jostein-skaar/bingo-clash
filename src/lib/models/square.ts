export type Square = {
	id: string;
	cohortId: string;
	text: string;
	playerId?: string;
	difficulty: number;
	isInactive?: boolean;
	isApproved?: boolean;
	approvedById?: string;
};
