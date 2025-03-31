This is a demo web app, built to showcase a basic Zaprite API integration.

## Demonstration

The example API integration showcases a demo donation page where anonymous supporters can make a lightning donation to patrons at PubKey bar in New York.

The following flow has been built:

1. The visitor is presented with various donation buttons, or a custom amount field.
2. The visitor clicks a button or enters a custom amount to initiate a donation.
3. The app uses Zaprite's API to create an Order (`/v1/order`), using PubKey's preferred Checkout and lightning Payment Method.
4. The visitor is redirected to the `checkoutUrl` returned from the API.
5. The visitor makes a payment and is redirected back to the `redirectUrl` specified in the original Order request.
6. A 'success' page uses the Order information to query the Order at Zaprite (`/v1/order/{id}`) and display the relevant information to the customer.

## Zaprite API

You can learn more about Zaprite's API at:

- [https://zaprite.com/developers](https://zaprite.com/developers)
- [https://api.zaprite.com](https://api.zaprite.com)

## Stack

This app was built using [Next.js](https://nextjs.org), bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app). It uses [Tailwind](https://tailwindcss.com/) and [Shadcn](https://ui.shadcn.com).

# Local Development

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Requirements

You will need an API key associated with your Zaprite Organization to interact with our API. You can request API access by logging into your Zaprite Organization, creating a Sandbox Organization for testing, and then navigating to _Settings > API_.

Learn more about Zaprite Sandbox Organizations at:

- [How to test payments for an API integration](https://help.zaprite.com/en/articles/9875022-how-to-test-payments-for-an-api-integration).

## Learn More About Next.js

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
