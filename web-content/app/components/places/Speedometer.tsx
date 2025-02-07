export default function Speedometer({
  arrayItem,
  calculateRotation,
}: {
  calculateRotation: (value: number) => number;
  arrayItem: any;
}) {
  return (
    <div className="relative w-[270px] h-[150px]">
      <svg className="w-full h-full relative" viewBox="0 0 100 60">
        {" "}
        {/* Gradient Definition */}
        <defs>
          <linearGradient
            id="progressGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" stopColor="#12F312" />
            <stop offset="80%" stopColor="#FCA327" />
            <stop offset="100%" stopColor="#D00707" />
          </linearGradient>
        </defs>
        {/* Progress Arc */}
        <path
          d="M 10 50 A 40 40 0 0 1 90 50"
          fill="none"
          stroke="url(#progressGradient)"
          strokeWidth="8"
          strokeLinecap="round"
        />
      </svg>

      {/* Animated Tracking Marker */}
      <div
        className=" absolute right-[48%] bottom-[10px] h-[122px]"
        style={{
          transform: ` rotate(${calculateRotation(arrayItem.fraud_score)}deg)`,
          transition: "transform 0.5s ease-in-out",
          transformOrigin: "bottom",
        }}
      >
        <svg
          width="8"
          height="21"
          viewBox="0 0 8 21"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4 0.384766C1.79086 0.384766 0 2.17563 0 4.38477C0 6.5939 1.79086 8.38477 4 8.38477C6.20914 8.38477 8 6.5939 8 4.38477C8 2.17563 6.20914 0.384766 4 0.384766ZM3.25 19.6163C3.25 20.0305 3.58579 20.3663 4 20.3663C4.41421 20.3663 4.75 20.0305 4.75 19.6163H3.25ZM3.25 4.38477L3.25 19.6163H4.75L4.75 4.38477H3.25Z"
            fill="black"
          />
        </svg>
      </div>
      {arrayItem?.status !== "High Fraud Score" ? (
        <div className=" absolute text-center bottom-[-20px] right-[76px]">
          <h4 className=" text-[40px] font-extrabold text-black-slate-900">
            {/* {progress} */}
            {arrayItem.fraud_score}
          </h4>
          <h4 className=" text-black-slate-700 font-medium"> /100</h4>
          <div className=" bg-green-slate-50 rounded-[23px] px-1 py-2 text-center">
            <p className=" text-green-slate-800 font-medium text-xs ">
              Good Fraud Score
            </p>
          </div>
        </div>
      ) : (
        <div className=" absolute text-center bottom-[-20px] right-[76px]">
          <h4 className=" text-[40px] font-extrabold text-black-slate-900">
            {/* {progress} */}
            {arrayItem.fraud_score}
          </h4>
          <h4 className=" text-black-slate-700 font-medium"> /100</h4>
          <div className=" bg-red-slate-50 rounded-[23px] px-1 py-2 text-center">
            <p className=" text-red-slate-800 font-medium text-xs ">
              High Fraud Score
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
