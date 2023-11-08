import React, { useState } from "react";

type Props = {};

const GetBalance = (props: Props) => {
  const [balance, setBalance] = useState(0);

  const handleBalance = () => {
    const Balance = 10;
    setBalance(Balance);
  };

  return (
    <div className="flex items-center justify-center text-center mt-10 flex-col">
      <button
        onClick={handleBalance}
        className="bg-[#7F56D9] text-white px-4 py-2 text-xl rounded-lg"
      >
        Get Balance
      </button>
      <p className="mt-10 text- ">Balance: {balance}</p>
    </div>
  );
};

export default GetBalance;
