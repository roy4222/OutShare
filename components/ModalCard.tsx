import Image from "next/image";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

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
      <CardContent>
        <p>Card Content</p>
      </CardContent>
      <CardFooter>
        <p>Card Footer</p>
      </CardFooter>
    </Card>
  );
};

export default ModalCard;
