import type { GetServerSideProps } from "next";

export default function BoardRedirect() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async () => ({
  redirect: { destination: "/blog", permanent: true },
});
