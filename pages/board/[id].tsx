import type { GetServerSideProps } from "next";

export default function BoardPostRedirect() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const id = context.params?.id;

  return {
    redirect: {
      destination: typeof id === "string" ? `/blog/${id}` : "/blog",
      permanent: true,
    },
  };
};
