export default function Tags() {
  return (
    <div className="mx-12 my-8 border py-3 px-4 rounded-2xl flex">
      <div className="flex items-center gap-2 mr-4">
        <p className="font-medium">Tags</p>
        <div className="w-[2px] h-[80%] rounded-full bg-black"></div>
      </div>
      <div className="flex gap-4">
        <div className="px-8 py-1 rounded-full bg-primary flex items-center">
          <p className="h-fit">Math</p>
        </div>
        <div className="px-8 py-1 rounded-full border-2 border-primary flex items-center">
          <p className="h-fit">Computer Science</p>
        </div>
      </div>
    </div>
  );
}
