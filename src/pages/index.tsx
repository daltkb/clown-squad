import { GetServerSideProps } from 'next';
import Stripe from 'stripe';

export const getServerSideProps: GetServerSideProps = async () => {
  const stripe = await new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2022-08-01',
  });

  const prices = await stripe.prices.list({
    limit: 10,
    expand: ['data.product'],
  });

  return { props: { prices: prices.data } };
};

interface IPrice extends Stripe.Price {
  product: Stripe.Product;
}

interface IProps {
  prices: IPrice[];
}

export default function Home({ prices }: IProps) {
  return (
    <div>
      {prices.map((price) => (
        <>
          <img
            src={price.product.images[0]}
            alt={price.product.name}
            className="h-64 w-64"
          />
          <div className="flex items-center">
            <h1 className="text-xl" key={price.id}>
              {price.product.name}
            </h1>
            <p>${(price.unit_amount as number) / 100}</p>
          </div>
        </>
      ))}
    </div>
  );
}
