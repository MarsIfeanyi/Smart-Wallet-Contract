import React, { useEffect, useState } from "react";
import factory_abi from "../utils/factory_abi.json";
import factory_address from "../utils/factory_address";

import {
  useAccount,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
} from "wagmi";
import GetBalance from "./GetBalance";

export function Hero() {
  const [address, setAddress] = useState<undefined | string>(undefined);

  const { config: createWalletConfig } = usePrepareContractWrite({
    address: factory_address,
    abi: factory_abi,
    functionName: "createWallet",
  });

  const {
    data: createWalletData,
    isLoading: isCreatingWallet,
    isSuccess: isWalletCreated,
    isError: createWalletIsError,
    write: createWalletWrite,
  } = useContractWrite(createWalletConfig);

  useEffect(() => {
    console.log("createWalletData:", createWalletData);
    console.log("isCreatingWallet:", isCreatingWallet);
    console.log("isWalletCreated", isWalletCreated);
    console.log("createWalletIsError:", createWalletIsError);
    console.log("======= Creating Wallet =======");
  }, [createWalletData, isCreatingWallet, isWalletCreated]);

  const handleCreate = async (e: any) => {
    e.preventDefault();
    try {
      console.log("creating Wallet.....");
      createWalletWrite?.();
    } catch (error: any) {
      //@ts-ignore
      console.error(
        "Error calling createWalletWrite:",
        // @ts-ignore
        error.message as string
      );
    }
  };

  const { data: getWalletData } = useContractRead({
    address: factory_address,
    abi: factory_abi,
    functionName: "getWalletAddress",
    watch: true,
  });

  useEffect(() => {
    if (getWalletData) {
      //@ts-ignore
      setAddress(getWalletData);
    }
  }, [getWalletData]);

  return (
    <>
      <div className="mt-40 flex justify-center space-x-6 ">
        <button
          onClick={handleCreate}
          className="bg-[#7F56D9] text-white px-4 py-2 text-3xl rounded-lg"
        >
          Create Wallet
        </button>
      </div>

      <div className="flex items-center justify-center text-lg mt-6">
        {isCreatingWallet && (
          <div className="mt-4">Creating Smart Wallet....... </div>
        )}
      </div>

      <GetBalance />
    </>
  );
}
