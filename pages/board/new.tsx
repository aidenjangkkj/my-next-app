import type { GetServerSideProps } from "next";

export default function NewBoardPostRedirect() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async () => ({
  redirect: { destination: "/admin/posts/new", permanent: false },
});
