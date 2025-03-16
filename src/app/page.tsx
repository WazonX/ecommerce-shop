import { Search } from "lucide-react";

export default function Home() {
  return (
    <div className="flex ">
      <div className="w-3/4 mx-auto flex">
          <input className="font-[quantico] bg-amber-50 uppercase text-black w-full mt-14 px-5 text-xl" placeholder="Search" type="text"/>
          <button className="w-fit h-fit mt-14">
            <Search className="size-8"/>
          </button>
      </div>
    </div>
  );
}
