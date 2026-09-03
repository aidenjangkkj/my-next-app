import type { GetServerSideProps } from "next";

export default function AboutRedirect() {
  return null;
}
export const getServerSideProps: GetServerSideProps = async () => ({
  redirect: { destination: "/experience", permanent: true },
});
