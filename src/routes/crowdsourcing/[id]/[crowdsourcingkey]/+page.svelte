<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import { enhance } from '$app/forms';

	export let data: PageData;
	export let form: ActionData;
</script>

<h1>Crowdsourcing for {data.cohort.name}</h1>

<h2>Add new bingo square</h2>
<form method="POST" use:enhance>
	<label>
		Text (max 100 characters?):
		<br />
		<textarea rows="3" cols="50" name="text" />
	</label>
	<br />
	<br />
	<label>
		About player:
		<br />
		<select name="playerId">
			<option value="">Select player</option>
			<option value="1">No one special</option>
			{#each data.players as player}
				<option value={player.id}>{player.name}</option>
			{/each}
		</select>
	</label>
	<br />
	<br />
	<label>
		Difficulty (how easy-ish is it to get this square?):
		<br />
		<select name="difficulty">
			<option value="2">Medium</option>
			<option value="1">Easy</option>
			<option value="3">Hard</option>
		</select></label
	>
	<br />
	<br />
	<button>Add</button>
</form>

{#if form?.success}
	<p>Bingo square succesfully added!</p>
{/if}
