export default function BotChatHeader() {
  return (
    <div>
      <div className="bg-primary py-3 flex flex-col items-start justify-center pl-4 gap-2 border-b rounded-t-2xl">
        <div className="flex w-full gap-6 ml-[5%]">
          <span className="self-center">img</span>
          <div className="flex flex-col justify-center w-full">
            <p className="overflow-hidden text-ellipsis whitespace-nowrap w-[60%]">
              Ask questions
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
