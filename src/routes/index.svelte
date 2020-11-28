<script>
  import fetch from 'node-fetch';

  let messages = [];
  const refresh =() => {
    fetch('http://localhost:3000/index.json').then(resp => {
      return resp.json()
    }).then(resp => {
      messages = resp.userByDisplayName.chats
    });
  }
  refresh()
  setInterval(() => {
    refresh()
  }, 4000)
</script>

<style>
	p {
		text-align: center;
		margin: 0 auto;
	}

  .wrapper {
    background-color: white;
    border-radius: 12px;
    opacity: 0.8;
  }

	p {
		margin: 1em auto;
	}
</style>

<svelte:head>
	<title>Dlive Overlay</title>
</svelte:head>

<div class='wrapper'>
  <p>Chat</p>
  <ul>
	{#each messages as { id, content, sender }, i}
    <li>
      {sender.username}: {content}
    </li>
	{/each}
</ul>
</div>
