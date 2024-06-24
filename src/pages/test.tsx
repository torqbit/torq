import { GetStaticProps, NextPage } from "next";

const Test: NextPage = () => {
  return <h1>Hello world</h1>;
};

export const getStaticProps: GetStaticProps = async () => {
  const data = "Hello from getStaticProps!";
  return {
    props: {
      data: data,
    },
  };
};

export default Test;
