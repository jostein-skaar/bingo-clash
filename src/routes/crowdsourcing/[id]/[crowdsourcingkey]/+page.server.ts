import { getCohort, getPlayers, storeSquare } from '$lib/server/azureStore';
import { error } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const cohort = await getCohort(params.id, params.crowdsourcingkey);

	if (cohort) {
		const players = await getPlayers(cohort.id);
		return { cohort, players };
	}

	error(404, 'Not found');
};

export const actions = {
	default: async ({ params, request }) => {
		const data = await request.formData();
		const text = data.get('text');
		const playerId = data.get('playerId');
		const difficulty = data.get('difficulty');
		if (!text || !playerId || !difficulty) {
			return { success: false, message: 'Missing text or playerId' };
		}

		const cohortId = params.id;
		const result = await storeSquare(
			cohortId,
			text.toString(),
			+difficulty,
			playerId === '1' ? undefined : playerId.toString()
		);
		if (!result) {
			return { success: false, message: 'Failed to store square' };
		}
		return { success: true };
	}
} satisfies Actions;
