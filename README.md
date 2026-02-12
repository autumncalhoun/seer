# Timeline

- 1 hour to get app scaffolded and api endpoints documented
- 1 hour to get basic dashboard
- 1 hour to get conversation list/pagination and convo details
- 1 hour for policy page
- The rest of the day to ~~panic and obsess~~ finesse

# Writeup

## Source

- https://github.com/autumncalhoun/seer

## Stack

- Next.js (server and client)
- Tailwind (general CSS)
- ~~Chakra UI~~ Shadcn (ain't nobody got time to make a dropdown right now!)
  - Chakra was turning into a real yak shaving experiment. It's not important right now, so I just picked another lib
- Github repo + Vercel deployments

## Run locally

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

Development server:

```bash
npm run dev
```

## Deployed to

[https://seer-rust.vercel.app/](https://seer-rust.vercel.app/)

## Features

### Alert dashboard

- Fetches all prompts, 100 rows at a time, in paralell, then processes
  the number of risky prompts, responses, and users with risky conversations
- Shows a table of users sorted by their number of risky conversations (any conversation that inclues a prompt or response with a risk greater than 3).
  The table rows link to the conversations page, filtered to that user.

### Conversations

- The list page is paginated. There is a user dropdown for filtering by user,
  but it is currently broken. The dropdown adds the user's id to the url, the id is passed to the fetching function, but the fetch still returns all conversations. (I'm probably doing something dumb!)
  - I could filter on the frontend but it would break pagination
- The conversation list rows link to the conversation detail. The detail page shows a list of conversations, labeled by the prompt. The accordion panel shows the content of the conversation.
  - A lot more formatting could happen on this page. A lot. So much.

### Policies

- A sad little list of policies that links to nowhere and shows almost nothing. _Womp, womp._

## Tradeoffs

- I used shadcn to get the UI off the ground. That requires actually "installing" components in the app, rather than just referencing the npm package. That causes a lot of diff changes (sorry about that!), but I actually really like the approach for a real app because you know what you're using!
- I stuck to server components for fetching data to avoid having to create two api interfaces (one to call the external api and one to serve data to the frontend). Would that scale? Unlikely. In production, I'd probably define two separate api layers (although types could be shared).
- I would **never** fetch the dashboard data this way in production. Even though the requests are paralellized (mostly), it's hella expensive. I would try to optimize that kind of data much closer to the database layer. I would normalize prompts and responses database entities to have user ids associated with them so you don't have to do the "walk the tree" song and dance. I would imagine that you'd also end up with at least one roll up table where you count the risky prompts/repsonses per day (or some other time frame). Since a prompt/response can't be "undone", you can count them on a rolling basis, then query that for fast reads.
- I have looked at the WitnessAI product demo but intentionally didn't reference it here or copy the layout. What you guys have is better and more scalable than my little 3 page app haha.
