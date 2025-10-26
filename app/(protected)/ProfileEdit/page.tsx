import Navbar from "@/components/features/layout/Navbar";
import SideBar from "@/components/features/layout/SideBar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ProfileEditPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="flex pt-16">
        <SideBar />
        <main className="flex-1 ml-64 p-6">
          <div className="max-w-7xl mx-auto">
            <header className="mb-10">
              <h1 className="text-xl font-bold text-gray-900">個人檔案</h1>
            </header>
            <div className="mx-auto max-w-2xl">
            <form className="space-y-10">
              <section className="flex flex-col items-center gap-4">
                <Avatar className="size-32 border border-slate-200 bg-white shadow-sm">
                  <AvatarFallback className="bg-gray-200 text-transparent">
                    使用者
                  </AvatarFallback>
                </Avatar>
                <Button
                  type="button"
                  variant="outline"
                  className="h-9 rounded-full border-emerald-500 px-6 text-sm font-medium text-emerald-600 shadow-sm transition-colors hover:bg-emerald-50 hover:text-emerald-600"
                >
                  更換圖片
                </Button>
              </section>

              <section className="space-y-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="displayName"
                    className="text-sm font-medium text-gray-900"
                  >
                    暱稱
                  </Label>
                  <Input
                    id="displayName"
                    defaultValue="KJ"
                    placeholder="請輸入暱稱"
                    className="h-12 rounded-xl border border-slate-200 bg-white text-base shadow-sm focus-visible:border-emerald-500 focus-visible:ring-emerald-100"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-sm font-medium text-gray-900"
                  >
                    電子郵件
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    defaultValue="kaijayhuang@gmail.com"
                    readOnly
                    className="h-12 cursor-default rounded-xl border border-slate-200 bg-gray-100 text-base text-gray-600 shadow-sm focus-visible:outline-none"
                  />
                </div>

                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label
                      htmlFor="bio"
                      className="text-sm font-medium text-gray-900"
                    >
                      介紹
                    </Label>
                    <textarea
                      id="bio"
                      maxLength={150}
                      placeholder="請輸入自我介紹"
                      className="min-h-[120px] w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-3 text-base text-gray-900 placeholder:text-muted-foreground shadow-sm focus-visible:border-emerald-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-100"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">最多 150 字</p>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="facebook"
                    className="text-sm font-medium text-gray-900"
                  >
                    Facebook 連結
                  </Label>
                  <Input
                    id="facebook"
                    placeholder="請輸入連結 https://..."
                    className="h-12 rounded-xl border border-slate-200 bg-white text-base shadow-sm focus-visible:border-emerald-500 focus-visible:ring-emerald-100"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="instagram"
                    className="text-sm font-medium text-gray-900"
                  >
                    Instagram 連結
                  </Label>
                  <Input
                    id="instagram"
                    placeholder="請輸入連結 https://..."
                    className="h-12 rounded-xl border border-slate-200 bg-white text-base shadow-sm focus-visible:border-emerald-500 focus-visible:ring-emerald-100"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="threads"
                    className="text-sm font-medium text-gray-900"
                  >
                    Threads 連結
                  </Label>
                  <Input
                    id="threads"
                    placeholder="請輸入連結 https://..."
                    className="h-12 rounded-xl border border-slate-200 bg-white text-base shadow-sm focus-visible:border-emerald-500 focus-visible:ring-emerald-100"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="youtube"
                    className="text-sm font-medium text-gray-900"
                  >
                    Youtube 連結
                  </Label>
                  <Input
                    id="youtube"
                    placeholder="請輸入連結 https://..."
                    className="h-12 rounded-xl border border-slate-200 bg-white text-base shadow-sm focus-visible:border-emerald-500 focus-visible:ring-emerald-100"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="x"
                    className="text-sm font-medium text-gray-900"
                  >
                    X 連結
                  </Label>
                  <Input
                    id="x"
                    placeholder="請輸入連結 https://..."
                    className="h-12 rounded-xl border border-slate-200 bg-white text-base shadow-sm focus-visible:border-emerald-500 focus-visible:ring-emerald-100"
                  />
                </div>
              </section>
            </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
