import type { GetServerSideProps } from "next";
import { getCaseStudyPageData } from "@/data/caseStudies";

export default function CaseStudyRedirect() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async ({ params }) =>
  getCaseStudyPageData(params?.slug);
