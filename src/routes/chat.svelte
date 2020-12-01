<script>
  import fetch from 'node-fetch';
  import {filterXSS} from 'xss';
  import { onDestroy, onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  import colors from './_colors';
  import settings from './_settings';

  const textColors = []
  colors.forEach(({shades}) => {
    Object
      .values(shades)
      .filter(({contrast}) => contrast === 'black')
      .forEach(({hex}) => {
        textColors.push(hex)
      })
  })
  const emojiEndpoint = 'https://images.prd.dlivecdn.com/emoji/'
  const emojiRegex = /(DLive\w+)/gm;

  const users = {};
  let newUserIndex = 0;
  const getMessageColor = sender => 
    `color: ${textColors[users[sender.username] % textColors.length]};`

  const messagesObj = {}
  $: messages = Object.values(messagesObj).filter(({hidden}) => !hidden)

  const refresh = () => {
    fetch('http://localhost:3000/index.json')
      .then(resp => resp.json())
      .then(resp => {
        const incoming = resp.userByDisplayName.chats;
        const allMessages = incoming.filter(({type}) => type === "Message") || [];
        let newMessages = [];
        for(let i = allMessages.length - 1; i >= 0; i--){
          const current = allMessages[i];
          if(messagesObj[current.id]) break;

          const {username} = current.sender;
          if(!users[username]){
            users[username] = newUserIndex;
            ++newUserIndex;
          }
          newMessages.push(current);
        }
        if(newMessages.length > 1) newMessages.reverse()
        newMessages.forEach(message => {
          messagesObj[message.id] = {
            ...message,
            content: filterXSS(message.content).replace(emojiRegex, (match) => {
              return `<img width="16px" height="16px" src="${emojiEndpoint + match}" />`
            }),
            hide: setTimeout(() => {
              messagesObj[message.id].hidden = true;
            }, settings.chat.messageTimeout)};
        })
      });
  }
  const interval = setInterval(() => {
    refresh()
  }, 4000)

  const handleScrollIntoView = ({target}) => {
      target.scrollIntoView();
  }

  onMount(() => {
    refresh()
  })

  onDestroy(() => {
    Object.values(messagesObj).forEach(({hidden, hide}) => {
      if(!hidden) clearTimeout(hide)
    })
    clearInterval(interval)
  })
</script>

<style>
  .wrapper {
    border-radius: 12px;
    text-shadow: 0px 0px 4px rgba(243, 161, 0, 1);
  }

	.header {
    color: white;
		text-align: center;
    height: 32px;
	}

  .messages-wrapper {
    max-height: calc(100vh - 96px);
    overflow:auto;
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
  }
  
  .messages-wrapper::-webkit-scrollbar {
    display: none;
  }

  .message {
    margin: 4px;
    border-radius: 16px;
    padding: 4px;
    font-size: 20px;
  }

  .user {
    color: white;
  }

  .avatar {
    border-radius: 16px;
  }
</style>

<svelte:head>
	<title>Dlive Overlay</title>
</svelte:head>

<div class='wrapper'>
  <div class='header'>{settings.chat.header}</div>
  <div class='messages-wrapper'>
	  {#each messages as { id, content, sender }, i}
      <div
        class='message' 
        transition:fade
        on:introstart="{handleScrollIntoView}"
      >
        <img
          class='avatar' 
          src={sender.avatar} 
          width="16" 
          height="16" 
          alt="avatar"
        />
        <span class='user'>{sender.username}: </span>
        <span
          class='content'
          style={getMessageColor(sender)}
        >
          {@html content}
        </span>
      </div>
    {/each}
  </div>
</div>
