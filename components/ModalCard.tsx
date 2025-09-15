import Image from "next/image";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const ModalCard = () => {
  return (
    <Card className="w-100">
      <div className="relative w-full h-64">
        <Image src="/japan.jpg" alt="日本熊野古道 4 天 3 夜" fill />
      </div>
      <CardHeader>
        <CardTitle>日本熊野古道 4 天 3 夜</CardTitle>
        <CardDescription className="flex items-center gap-2 ">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="128"
            height="128"
            viewBox="0 0 24 24"
            className="size-4 text-green-700"
          >
            <path
              fill="currentColor"
              d="M12 3a7 7 0 0 0-7 7c0 2.862 1.782 5.623 3.738 7.762A26 26 0 0 0 12 20.758q.262-.201.615-.49a26 26 0 0 0 2.647-2.504C17.218 15.623 19 12.863 19 10a7 7 0 0 0-7-7m0 20.214l-.567-.39l-.003-.002l-.006-.005l-.02-.014l-.075-.053l-.27-.197a28 28 0 0 1-3.797-3.44C5.218 16.875 3 13.636 3 9.999a9 9 0 0 1 18 0c0 3.637-2.218 6.877-4.262 9.112a28 28 0 0 1-3.796 3.44a17 17 0 0 1-.345.251l-.021.014l-.006.005l-.002.001zM12 8a2 2 0 1 0 0 4a2 2 0 0 0 0-4m-4 2a4 4 0 1 1 8 0a4 4 0 0 1-8 0"
            />
          </svg>
          中邊路
        </CardDescription>
        <CardDescription className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="128"
            height="128"
            viewBox="0 0 24 24"
            className="size-4 text-green-700"
          >
            <path
              fill="currentColor"
              d="M19 4h-2V3a1 1 0 0 0-2 0v1H9V3a1 1 0 0 0-2 0v1H5a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3m1 15a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-7h16Zm0-9H4V7a1 1 0 0 1 1-1h2v1a1 1 0 0 0 2 0V6h6v1a1 1 0 0 0 2 0V6h2a1 1 0 0 1 1 1Z"
            />
          </svg>
          4天
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <div className="flex items-center pb-4">
          <Badge>#熊野古道 </Badge>
          <Badge>#朝聖之路</Badge>
          <Badge>#鄉間 </Badge>
          <Badge>#輕量化 </Badge>
          <Badge>#單人旅程 </Badge>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ModalCard;
