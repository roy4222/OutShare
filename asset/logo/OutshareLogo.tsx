import Image from "next/image"

// 創建 Logo 組件
export default function Logo() {
    return (
    <Image
      src="/OutShare.svg"
      alt="OutShare"
      width={100}
      height={28}
      priority
      className="w-full h-auto"
    />
  )
}
