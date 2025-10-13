import Image from "next/image"

// 創建 Illustration 組件
export default function SignUpLogo() {
    return (
    <Image
      src="/illustration.svg"
      alt="illustration"
      width={300}
      height={200}
      className="w-full h-auto"
    />
  )
}
