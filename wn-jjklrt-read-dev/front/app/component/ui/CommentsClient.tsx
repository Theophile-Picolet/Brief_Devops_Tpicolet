import dynamic from "next/dynamic";

const CommentsClient = dynamic(() => import("@/app/component/ui/Comments"), {
  ssr: false,
});

export default CommentsClient;
