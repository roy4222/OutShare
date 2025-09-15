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
        <Image
          src="/japan.jpg"
          alt="日本熊野古道 4 天 3 夜"
          fill
        />
      </div>
      <CardHeader>
        <CardTitle>日本熊野古道 4 天 3 夜</CardTitle>
        <CardDescription>中邊路</CardDescription>
        <CardDescription>4天</CardDescription>
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
