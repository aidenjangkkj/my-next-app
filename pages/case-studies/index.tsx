import type { GetServerSideProps } from "next";

export default function CaseStudiesRedirect() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async () => ({
  redirect: { destination: "/blog", permanent: true },
});
