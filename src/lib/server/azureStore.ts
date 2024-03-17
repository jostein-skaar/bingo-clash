import { TableClient, type TableEntity } from '@azure/data-tables';
import { env } from '$env/dynamic/private';
import type { Cohort } from '$lib/models/cohort';
import type { Player } from '$lib/models/player';
import type { Square } from '$lib/models/square';
import { v4 as uuidv4 } from 'uuid';

export const getCohort = async (
	id: string,
	validateWithCrowdsourcingKey?: string
): Promise<Cohort | null> => {
	if (!env.StorageConnectionString) {
		throw new Error('Missing stuff from environment');
	}

	const tableClient = TableClient.fromConnectionString(env.StorageConnectionString, 'cohorts');
	const entity = await tableClient.getEntity<TableEntity<Cohort>>('bingoclash', id);

	if (
		!entity ||
		(validateWithCrowdsourcingKey !== undefined &&
			entity.crowdsourcingKey !== validateWithCrowdsourcingKey)
	) {
		return null;
	}

	const cohort: Cohort = {
		id: entity.rowKey,
		name: entity.name,
		crowdsourcingKey: entity.crowdsourcingKey
	};

	return cohort;
};

export const getPlayers = async (cohortId: string): Promise<Player[]> => {
	if (!env.StorageConnectionString) {
		throw new Error('Missing stuff from environment');
	}

	const tableClient = TableClient.fromConnectionString(env.StorageConnectionString, 'players');
	const entities = tableClient.listEntities<TableEntity<Player>>();
	const players: Player[] = [];
	for await (const entity of entities) {
		if (entity.partitionKey !== cohortId) {
			continue;
		}
		const player: Player = {
			id: entity.rowKey,
			cohortId: entity.partitionKey,
			name: entity.name
		};
		players.push(player);
	}
	console.log('Getting PLAYERS');
	return players.sort((a, b) => a.name.localeCompare(b.name));
};

export const storeSquare = async (
	cohortId: string,
	text: string,
	difficulty: number,
	playerId?: string
): Promise<boolean> => {
	if (!env.StorageConnectionString) {
		throw new Error('Missing stuff from environment');
	}

	const tableClient = TableClient.fromConnectionString(env.StorageConnectionString, 'squares');

	const base64EncodedText = Buffer.from(text).toString('base64');

	//@ts-expect-error Because some required fields are persisted in partitionKey and rowKey.
	const entity: TableEntity<Square> = {
		partitionKey: cohortId,
		rowKey: uuidv4(),
		text: base64EncodedText,
		difficulty,
		playerId
	};

	await tableClient.createEntity(entity);

	return true;
};
