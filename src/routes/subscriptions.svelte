<script>
  import fetch from "node-fetch";
  import { onDestroy, onMount } from "svelte";
  import { fade } from "svelte/transition";
  import settings from "./_settings";
  import { Queue } from "../utils";

  const processedFollows = {};
  const queue = new Queue();
  let notification = { id: "no-id", visible: false };

  const refresh = () => {
    fetch("http://localhost:3000/index.json")
      .then((resp) => resp.json())
      .then((resp) => {
        const incoming = resp.userByDisplayName.chats;

        const allFollows =
          incoming.filter(({ type }) => type === "Follow") || [];

        allFollows.forEach(({ id, sender }) => {
          if (!processedFollows[id]) {
            const { username, avatar } = sender;
            processedFollows[id] = true;
            queue.add({ id, username, avatar });
          }
        });
      });
  };

  const fetchInterval = setInterval(() => {
    refresh();
  }, 4000);

  const displayInterval = setInterval(() => {
    notification.visible = false;

    if (queue.getSize() === -1) return;

    const item = queue.get();
    notification = { ...item, visible: true };
  }, 10000);

  onMount(() => {
    refresh();
  });

  onDestroy(() => {
    clearInterval(fetchInterval);
    clearInterval(displayInterval);
  });
</script>

<style>
  .wrapper {
    border-radius: 12px;
    color: lightgray;
    text-shadow: 0px 0px 4px rgba(243, 161, 0, 1);
    height: 32px;
  }

  .user {
    color: orange;
  }

  .avatar {
    border-radius: 16px;
  }
</style>

<svelte:head>
  <title>Dlive Overlay</title>
</svelte:head>

<div class="wrapper">
  {#key notification.id}
    {#if notification.visible}
      <div id="notification" transition:fade>
        <img
          class="avatar"
          src={notification.avatar}
          width="16"
          height="16"
          alt="avatar" />
        <span class="user">{notification.username} subscribed!</span>
      </div>
    {/if}
  {/key}
</div>
