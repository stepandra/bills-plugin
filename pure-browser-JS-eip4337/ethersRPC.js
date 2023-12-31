const rpc = (() => {
  /**
   * @param {*} provider - provider received from Web3Auth login.
  */
  const getChainId = async (provider) => {
    const ethersProvider = new ethers.providers.Web3Provider(provider);

    // Get the connected Chain's ID
    const networkDetails = await ethersProvider.getNetwork();

    return networkDetails.chainId;
  };

  const getAccounts = async (provider) => {
      const ethersProvider = new ethers.providers.Web3Provider(provider);
      const signer = ethersProvider.getSigner();

      // Get user's Ethereum public address
      let address = "";
      try {
          address = await signer.getAddress();
      } catch { }
      return address;
  };

  const getBalance = async (provider) => {
    const ethersProvider = new ethers.providers.Web3Provider(provider);
    const signer = ethersProvider.getSigner();

    // Get user's Ethereum public address
    const address = await signer.getAddress();

    // Get user's balance in ether
    const balance = ethers.utils.formatEther(
      await ethersProvider.getBalance(address) // Balance is in wei
    );

    return balance;
  };

  const getSmartAddress = async (provider, addr) => {
    const ethersProvider = new ethers.providers.Web3Provider(provider);
    const Mcontract = new ethers.Contract(addr_SimpleAccountFactory, ABI_SimpleAccountFactory, ethersProvider);
    
    const smartAddr = await Mcontract.getAddress(addr, salt);
    return smartAddr;
	}

  const signMessage = async (provider, msg="MY_MESSAGE") => {
    const ethersProvider = new ethers.providers.Web3Provider(provider);
    const signer = ethersProvider.getSigner();

    const originalMessage = msg;

    // Sign the message
    const signedMessage = await signer.signMessage(originalMessage);

    return signedMessage;
  };

  const getPrivateKey = async (provider) => {
    const privateKey = await provider.request({
      method: "eth_private_key",
    });

    return privateKey;
  }

  const mkUserOp = async (provider, eoa, smartAddr) => {
      const EntryPoint_Addr = addr_Entrypoint;
      const RECEIVER_ADDR = "addr_here"; // sending ether to this address
      const amount = '10000000000'; // amount to send to RECEIVER_ADDR

      const sender = smartAddr; // smart account address , created by calling createAccount method of AccountFactory ( deployed at 0x9406Cc6185a346906296840746125a0E44976454 ) passing RECEIVER_ADDRESS as address and 1 as salt value

      const ethersProvider = new ethers.providers.Web3Provider(provider);
      const entryPointContract = new ethers.Contract(addr_Entrypoint, ABI_Entrypoint, ethersProvider);

      let nonce = await entryPointContract.getNonce(smartAddr, 0); //got nonce

      nonce = nonce._hex;

      const callGasLimit = "0x0927C0";
      const verificationGasLimit = "0x0927C0";
      const preVerificationGas = "0x0927C0";
      const maxFeePerGas = "0x999999"; // adjust the value according to your needs
      const maxPriorityFeePerGas = "0x999999"; // adjust the value according to your needs

      const account = new ethers.utils.Interface(accountABI); // ethers code

      let calldata = account.encodeFunctionData("execute", [RECEIVER_ADDR, amount, "0x"]);
      
      console.log("calldata: " + calldata);
      console.log('keccak ' + ethers.utils.keccak256(calldata));
      //initcode = [AccountFactory address] + [encoded CreateAccountCall with the parameters];
      
      let ifactoryContract = new ethers.utils.Interface(ABI_SimpleAccountFactory);

      let initcode = "0x";

      // check if smart account is not yet exists
      const code = await ethersProvider.getCode(smartAddr);
      const notDeployed = code == "0x";

      if (notDeployed) {
          const txData = ifactoryContract.encodeFunctionData("createAccount", [eoa, salt]);
          initcode = ethers.utils.hexConcat([addr_SimpleAccountFactory, txData]);
      };
      
      const paymasterAndData = ethers.utils.hexConcat([addr_PurePaymaster, ethers.utils.defaultAbiCoder.encode(['uint48', 'uint48'], [10000000000000, 0])]);
   
      // getUserOpHash function is taken from StackUp's UserOp library . Reference : https://github.com/stackup-wallet/userop.js/blob/main/src/context.ts
      const getUserOpHash = () => {
              const packed = ethers.utils.defaultAbiCoder.encode(
                [
                  "address",
                  "uint256",
                  "bytes32",
                  "bytes32",
                  "uint256",
                  "uint256",
                  "uint256",
                  "uint256",
                  "uint256",
                  "bytes32",
                ],
                [
                  smartAddr,
                  nonce,
                  ethers.utils.keccak256(initcode),
                  ethers.utils.keccak256(calldata),
                  callGasLimit,
                  verificationGasLimit,
                  preVerificationGas,
                  maxFeePerGas,
                  maxPriorityFeePerGas,
                  ethers.utils.keccak256(paymasterAndData),
                ]
              );
          
              const enc = ethers.utils.defaultAbiCoder.encode(
                ["bytes32", "address", "uint256"],
                  [ethers.utils.keccak256(packed), EntryPoint_Addr, chainID]
              );
          
              return ethers.utils.keccak256(enc);
      }

      const userOpHash = getUserOpHash();
      
      // Arraified the userOpHash . Reference : https://github.com/stackup-wallet/userop.js/blob/main/src/preset/middleware/signature.ts
          
      const arraifiedHash =  ethers.utils.arrayify(userOpHash);
      console.log("arraified Hash :",arraifiedHash);
      
      const privateKey = await provider.request({
          method: "eth_private_key",
      });

      const netProvider = new ethers.providers.JsonRpcProvider(RPCuri);
      
      const signer = new ethers.Wallet(privateKey, netProvider);
      let signature = await signer.signMessage(arraifiedHash);
      console.log("sig: " + signature);

    let addr = BUNDLERuri;
    let response = await fetch("/w3auth/send.php", {
          method: "POST",
          body: JSON.stringify({
              jsonrpc: "2.0",
              id: 1,
              method: "eth_sendUserOperation",
              params: [
                  {
                      sender: smartAddr,
                      nonce: nonce,
                      initCode: initcode, 
                      callData: calldata, 
                      callGasLimit: callGasLimit,
                      verificationGasLimit: verificationGasLimit,
                      preVerificationGas: preVerificationGas,
                      maxFeePerGas: maxFeePerGas,
                      maxPriorityFeePerGas: maxPriorityFeePerGas,
                      paymasterAndData: paymasterAndData,
                      signature:signature
                  },
                  addr_Entrypoint,
              ],
          }),
          headers: {
              //accept: "application/json",
              "content-type": "application/json",
          }
      });
    if (response.ok) {
        let json = await response.text();
        console.log(json);
        let h = "";
    } else {
        alert("HTTP error: " + response.status);
    }

    /*  const options = {
            method: "POST",
            url: "https://octopus-app-t5hju.ondigitalocean.app/",
            headers: {
              accept: "application/json",
              "content-type": "application/json",
            },
            data: {
              jsonrpc: "2.0",
              id: 1,
              method: "eth_sendUserOperation",
              params: [
                {
                  sender: smartAddr,
                  nonce: nonce,
                  initcode: initcode,
                  callData: calldata,
                  callGasLimit: "500000",
                  verificationGasLimit: "200000",
                  preVerificationGas: "50000",
                  maxFeePerGas: "1000000000",
                  maxPriorityFeePerGas: "100000000",
                  paymasterAndData: "0x",
                  signature:signature
                },
                addr_Entrypoint,
              ],
            },
          }; 
          await axios
            .request(options)
            .then(function (response) {
              console.log(response.data);
            })
            .catch(function (error) {
              console.error(error);
            });
       */
  }

  const sendUserOp = async (provider, eoa, smartAddr, calldata) => {
        const EntryPoint_Addr = addr_Entrypoint;
        
        const sender = smartAddr; // smart account address

        const ethersProvider = new ethers.providers.Web3Provider(provider);
        const entryPointContract = new ethers.Contract(addr_Entrypoint, ABI_Entrypoint, ethersProvider);

        let nonce = await entryPointContract.getNonce(smartAddr, 0); //got nonce

        nonce = nonce._hex;

        const callGasLimit = "0x0927C0";
        const verificationGasLimit = "0x0927C0";
        const preVerificationGas = "0x0927C0";
        const maxFeePerGas = "0x999999"; // adjust the value according to your needs
        const maxPriorityFeePerGas = "0x999999"; // adjust the value according to your needs
        
        console.log("calldata: " + calldata);
        console.log('keccak ' + ethers.utils.keccak256(calldata));

        //initcode = [AccountFactory address] + [encoded CreateAccountCall with the parameters];
        let ifactoryContract = new ethers.utils.Interface(ABI_SimpleAccountFactory);
        let initcode = "0x";

        // check if smart account is not yet exists
        const code = await ethersProvider.getCode(smartAddr);
        const notDeployed = code == "0x";

        if (notDeployed) {
            const txData = ifactoryContract.encodeFunctionData("createAccount", [eoa, salt]);
            initcode = ethers.utils.hexConcat([addr_SimpleAccountFactory, txData]);
        };

        const paymasterAndData = ethers.utils.hexConcat([addr_PurePaymaster, ethers.utils.defaultAbiCoder.encode(['uint48', 'uint48'], [10000000000000, 0])]);

        // getUserOpHash function is taken from StackUp's UserOp library . Reference : https://github.com/stackup-wallet/userop.js/blob/main/src/context.ts
        const getUserOpHash = () => {
            const packed = ethers.utils.defaultAbiCoder.encode(
                [
                    "address",
                    "uint256",
                    "bytes32",
                    "bytes32",
                    "uint256",
                    "uint256",
                    "uint256",
                    "uint256",
                    "uint256",
                    "bytes32",
                ],
                [
                    smartAddr,
                    nonce,
                    ethers.utils.keccak256(initcode),
                    ethers.utils.keccak256(calldata),
                    callGasLimit,
                    verificationGasLimit,
                    preVerificationGas,
                    maxFeePerGas,
                    maxPriorityFeePerGas,
                    ethers.utils.keccak256(paymasterAndData),
                ]
            );

            const enc = ethers.utils.defaultAbiCoder.encode(
                ["bytes32", "address", "uint256"],
                [ethers.utils.keccak256(packed), EntryPoint_Addr, chainID]
            );

            return ethers.utils.keccak256(enc);
        }

        const userOpHash = getUserOpHash();

        // Arraified the userOpHash . Reference : https://github.com/stackup-wallet/userop.js/blob/main/src/preset/middleware/signature.ts

        const arraifiedHash = ethers.utils.arrayify(userOpHash);
        console.log("arraified Hash :", arraifiedHash);

        const privateKey = await provider.request({
            method: "eth_private_key",
        });

        const netProvider = new ethers.providers.JsonRpcProvider(RPCuri);

        const signer = new ethers.Wallet(privateKey, netProvider);
        //const signer = wallet.provider.getSigner(wallet.address);
        //const serializeObj = JSON.stringify(arraifiedHash);   // **error suspect 1**
        let signature = await signer.signMessage(arraifiedHash);
        console.log("sig: " + signature);

      let addr = BUNDLERuri;

      let params_body = [
          {
              sender: smartAddr,
              nonce: nonce,
              initCode: initcode, //ethers.utils.keccak256(initcode),
              callData: calldata, //ethers.utils.keccak256(calldata),
              callGasLimit: callGasLimit,
              verificationGasLimit: verificationGasLimit,
              preVerificationGas: preVerificationGas,
              maxFeePerGas: maxFeePerGas,
              maxPriorityFeePerGas: maxPriorityFeePerGas,
              paymasterAndData: paymasterAndData,
              signature: signature
          },
          addr_Entrypoint,
      ];
      console.log(JSON.stringify(params_body));
              
      let response = await fetch("/w3auth/send.php", {
            method: "POST",
            body: JSON.stringify({
                jsonrpc: "2.0",
                id: 1,
                method: "eth_sendUserOperation",
                params: [
                    {
                        sender: smartAddr,
                        nonce: nonce,
                        initCode: initcode, //ethers.utils.keccak256(initcode),
                        callData: calldata, //ethers.utils.keccak256(calldata),
                        callGasLimit: callGasLimit,
                        verificationGasLimit: verificationGasLimit,
                        preVerificationGas: preVerificationGas,
                        maxFeePerGas: maxFeePerGas,
                        maxPriorityFeePerGas: maxPriorityFeePerGas,
                        paymasterAndData: paymasterAndData,
                        signature: signature
                    },
                    addr_Entrypoint,
                ],
            }),
            headers: {
                //accept: "application/json",
                "content-type": "application/json",
            }
        });
        if (response.ok) {
            let json = await response.text();
            console.log(json);
            let h = "";
        } else {
            alert("HTTP error: " + response.status);
        }
    }

  const mkRawUserOp = async (provider, eoa, smartAddr, calldata) => {
    const EntryPoint_Addr = addr_Entrypoint;

    const sender = smartAddr; // smart account address

    const ethersProvider = new ethers.providers.Web3Provider(provider);
    const entryPointContract = new ethers.Contract(addr_Entrypoint, ABI_Entrypoint, ethersProvider);

    let nonce = await entryPointContract.getNonce(smartAddr, 0); //got nonce

    nonce = nonce._hex;

    const callGasLimit = "0x0927C0";
    const verificationGasLimit = "0x0927C0";
    const preVerificationGas = "0x0927C0";
    const maxFeePerGas = "0x999999"; // adjust the value according to your needs
    const maxPriorityFeePerGas = "0x999999"; // adjust the value according to your needs

    console.log("calldata: " + calldata);
    console.log('keccak ' + ethers.utils.keccak256(calldata));

    //initcode = [AccountFactory address] + [encoded CreateAccountCall with the parameters];
    let ifactoryContract = new ethers.utils.Interface(ABI_SimpleAccountFactory);
    let initcode = "0x";

    // check if smart account is not yet exists
    const code = await ethersProvider.getCode(smartAddr);
    const notDeployed = code == "0x";

    if (notDeployed) {
      const txData = ifactoryContract.encodeFunctionData("createAccount", [eoa, salt]);
      initcode = ethers.utils.hexConcat([addr_SimpleAccountFactory, txData]);
    };

    const paymasterAndData = ethers.utils.hexConcat([addr_PurePaymaster, ethers.utils.defaultAbiCoder.encode(['uint48', 'uint48'], [10000000000000, 0])]);

    // getUserOpHash function is taken from StackUp's UserOp library . Reference : https://github.com/stackup-wallet/userop.js/blob/main/src/context.ts
    const getUserOpHash = () => {
      const packed = ethers.utils.defaultAbiCoder.encode(
        [
          "address",
          "uint256",
          "bytes32",
          "bytes32",
          "uint256",
          "uint256",
          "uint256",
          "uint256",
          "uint256",
          "bytes32",
        ],
        [
          smartAddr,
          nonce,
          ethers.utils.keccak256(initcode),
          ethers.utils.keccak256(calldata),
          callGasLimit,
          verificationGasLimit,
          preVerificationGas,
          maxFeePerGas,
          maxPriorityFeePerGas,
          ethers.utils.keccak256(paymasterAndData),
        ]
      );

      const enc = ethers.utils.defaultAbiCoder.encode(
        ["bytes32", "address", "uint256"],
        [ethers.utils.keccak256(packed), EntryPoint_Addr, chainID]
      );

      return ethers.utils.keccak256(enc);
    }

    const userOpHash = getUserOpHash();

    // Arraified the userOpHash . Reference : https://github.com/stackup-wallet/userop.js/blob/main/src/preset/middleware/signature.ts

    const arraifiedHash = ethers.utils.arrayify(userOpHash);
    console.log("arraified Hash :", arraifiedHash);

    const privateKey = await provider.request({
      method: "eth_private_key",
    });

    const netProvider = new ethers.providers.JsonRpcProvider(RPCuri);

    const signer = new ethers.Wallet(privateKey, netProvider);
    //const signer = wallet.provider.getSigner(wallet.address);
    //const serializeObj = JSON.stringify(arraifiedHash);   // **error suspect 1**
    let signature = await signer.signMessage(arraifiedHash);
    console.log("sig: " + signature);

    let addr = BUNDLERuri;

    let params_body = [
      {
        sender: smartAddr,
        nonce: nonce,
        initCode: initcode, //ethers.utils.keccak256(initcode),
        callData: calldata, //ethers.utils.keccak256(calldata),
        callGasLimit: callGasLimit,
        verificationGasLimit: verificationGasLimit,
        preVerificationGas: preVerificationGas,
        maxFeePerGas: maxFeePerGas,
        maxPriorityFeePerGas: maxPriorityFeePerGas,
        paymasterAndData: paymasterAndData,
        signature: signature
      },
      addr_Entrypoint,
    ];
    const raw = '{"jsonrpc": "2.0","id": 1,"method": "eth_sendUserOperation","params": ' + JSON.stringify(params_body) + '}';
    return raw;
  }
    

    const calcCreateRequestcalldata = async (requestType, ipfsHash, from, to, asset, amount, salt) => {
        const account = new ethers.utils.Interface(accountABI); // ethers code
        const Rcontract = new ethers.utils.Interface(ABI_RequestFactory);

        // Encode UserOperation callData
        const callData = account.encodeFunctionData("execute", [
            addr_RequestFactory,
            ethers.constants.Zero,
            Rcontract.encodeFunctionData("createRequest", [requestType, ipfsHash, from, to, asset, amount, salt]),
        ]);

        return callData;
    };

    const calcPayRequestcalldata = async (to, amount, req_addr) => {
      const account = new ethers.utils.Interface(accountABI); // ethers code
      const Rcontract = new ethers.utils.Interface(ABI_NativePaymentProxy);

      // Encode UserOperation callData
      const callData = account.encodeFunctionData("execute", [
        addr_NativePaymentProxy,
        amount,
        Rcontract.encodeFunctionData("transferWithReference", [to, amount, req_addr]),
      ]);

      return callData;
    };

    const calcCancelRequestcalldata = async (req_addr, sig) => {
      const account = new ethers.utils.Interface(accountABI); // ethers code
      const Rcontract = new ethers.utils.Interface(ABI_Request);

      // Encode UserOperation callData
      const callData = account.encodeFunctionData("execute", [
        req_addr,
        0,
        Rcontract.encodeFunctionData("cancel", [sig]),
      ]);

      return callData;
    };

    const calcERC20PayRequestcalldata = async (to, asset, amount, req_addr) => {
        const account = new ethers.utils.Interface(accountABI); // ethers code
        const Rcontract = new ethers.utils.Interface(ABI_ERC20PaymentProxy);

        // Encode UserOperation callData
        const callData = account.encodeFunctionData("execute", [
            addr_NativePaymentProxy,
            0,
            Rcontract.encodeFunctionData("transferWithReference", [asset, to, amount, req_addr]),
        ]);

        return callData;
    };

    const calcRequestModSignature = async (provider, requestAddr, operation) => {
        const enc = ethers.utils.solidityPack(["address", "string", "bytes"], [requestAddr, operation, []]);
        
        const forSign = ethers.utils.keccak256(enc);
        const arraifiedHash = ethers.utils.arrayify(forSign);

        
        const privateKey = await provider.request({
            method: "eth_private_key",
        });

        const netProvider = new ethers.providers.JsonRpcProvider(RPCuri);

        const signer = new ethers.Wallet(privateKey, netProvider);
        
        /* // for Metamask
        const ethersProvider = new ethers.providers.Web3Provider(provider);

        const signer = ethersProvider.getSigner();
        */

        let signature = await signer.signMessage(arraifiedHash);
        return signature;
    }

    const calcCancelcalldata = async (addr, signature) => {
        const account = new ethers.utils.Interface(accountABI); // ethers code
        const Rcontract = new ethers.utils.Interface(ABI_Request);

        // Encode UserOperation callData
        const callData = account.encodeFunctionData("execute", [
            addr,
            0,
            Rcontract.encodeFunctionData("cancel", [signature]),
        ]);

        return callData;
    }

    const createRequest = async (provider, eoa, requestType, ipfsHash, from, to, asset, amount) => {
        const salt = Date.now();
        const smartAddr = await getSmartAddress(provider, eoa);
        const calldata = await calcCreateRequestcalldata(requestType, ipfsHash, from, to, asset, amount, salt);
        const ethersProvider = new ethers.providers.Web3Provider(provider);
        const Rcontract = new ethers.Contract(addr_RequestFactory, ABI_RequestFactory, ethersProvider);
        const requestAddressPredicted = await Rcontract.getAddress(requestType, ipfsHash, from, to, asset, amount, salt);
        console.log("Request address will be: " + requestAddressPredicted);
        await sendUserOp(provider, eoa, smartAddr, calldata);
        return requestAddressPredicted;
  };

    const ModRequest = async (provider, smartAddr, requestAddr, operation) => {
        const calldata = await calcCreateRequestcalldata(requestType, ipfsHash, from, to, asset, amount, salt);
        const ethersProvider = new ethers.providers.Web3Provider(provider);
        const Rcontract = new ethers.Contract(addr_RequestFactory, ABI_RequestFactory, ethersProvider);
        const requestAddressPredicted = await Rcontract.getAddress(requestType, ipfsHash, from, to, asset, amount, salt);
        console.log("Request address will be: " + requestAddressPredicted);
        await sendUserOp(provider, eoa, smartAddr, calldata);
        return requestAddressPredicted;
    };

  const payRequest = async (provider, eoa, to, amount, req_addr) => {
        const smartAddr = await getSmartAddress(provider, eoa);
        const calldata = await calcPayRequestcalldata(to, amount, req_addr);
        const ophash = await sendUserOp(provider, eoa, smartAddr, calldata);
        return ophash;
  };

  const payERC20Request = async (provider, eoa, to, asset, amount, req_addr) => {
        const smartAddr = await getSmartAddress(provider, eoa);
        const calldata = await calcERC20PayRequestcalldata(to, asset, amount, req_addr);
        const ophash = await sendUserOp(provider, eoa, smartAddr, calldata);
        return ophash;
  };

  const rawCreateRequest = async (provider, eoa, requestType, ipfsHash, from, to, asset, amount) => {
    const salt = Date.now();
    const smartAddr = await getSmartAddress(provider, eoa);
    const calldata = await calcCreateRequestcalldata(requestType, ipfsHash, from, to, asset, amount, salt);
    const ethersProvider = new ethers.providers.Web3Provider(provider);
    const Rcontract = new ethers.Contract(addr_RequestFactory, ABI_RequestFactory, ethersProvider);
    const requestAddressPredicted = await Rcontract.getAddress(requestType, ipfsHash, from, to, asset, amount, salt);
    console.log("Request address will be: " + requestAddressPredicted);
    const raw = await mkRawUserOp(provider, eoa, smartAddr, calldata);
    return [requestAddressPredicted, raw];
  };

  const rawPayRequest = async (provider, eoa, to, amount, req_addr) => {
    const smartAddr = await getSmartAddress(provider, eoa);
    const calldata = await calcPayRequestcalldata(to, amount, req_addr);
    const raw = await mkRawUserOp(provider, eoa, smartAddr, calldata);
    return raw;
  };

  const rawERC20PayRequest = async (provider, eoa, to, asset, amount, req_addr) => {
        const smartAddr = await getSmartAddress(provider, eoa);
        const calldata = await calcERC20PayRequestcalldata(to, asset, amount, req_addr);
        const raw = await mkRawUserOp(provider, eoa, smartAddr, calldata);
        return raw;
  };

    
    
    // MM variant

    const mmCreateRequest = async (provider, requestType, ipfsHash, from, to, asset, amount) => {
        const ethersProvider = new ethers.providers.Web3Provider(provider);
        const signer = ethersProvider.getSigner();
        //const Rcontract = new ethers.Contract(addr_RequestFactory, ABI_RequestFactory,  ethersProvider);
        const Rcontract = new ethers.Contract(addr_RequestFactory, ABI_RequestFactory, signer.connectUnchecked());
        let salt = Date.now();
        
        const requestAddressPredicted = await Rcontract.getAddress(requestType, ipfsHash, from, to, asset, amount, salt);
        console.log("Request address will be: " + requestAddressPredicted);
        //let contractSigner = Rcontract.connect(signer);
        document.getElementById("stat").innerHTML = "unknown...";
        //let accCreation = await contractSigner.createRequest(requestType, ipfsHash, from, to, asset, amount, salt);
        let accCreationTX = await Rcontract.createRequest(requestType, ipfsHash, from, to, asset, amount, salt);
        document.getElementById("stat").innerHTML = "wait tx confirmation and pay!";
        document.getElementById("payreq-reqaddress").value = requestAddressPredicted;
        document.getElementById("payreq-to-addr").value = to;
        document.getElementById("payreq-amount").value = amount;
        let receipt = await accCreationTX.wait();
        document.getElementById("stat").innerHTML = "pay now!!!";
        
        return (accCreationTX.hash);
    };

    const mmPayRequest = async (provider, to, amount, req_addr) => {
        const ethersProvider = new ethers.providers.Web3Provider(provider);
        const signer = ethersProvider.getSigner();
        const Paycontract = new ethers.Contract(addr_NativePaymentProxy, ABI_NativePaymentProxy, signer);
        
        let payment = await Paycontract.transferWithReference(to, amount, req_addr, { value: amount });
        document.getElementById("stat").innerHTML = "payment tx sent!"; 
        return (payment.hash);
    };

    const rawCancelRequest = async (provider, eoa, req_addr) => {
        const smartAddr = await getSmartAddress(provider, eoa);
        const ethersProvider = new ethers.providers.Web3Provider(provider);

        //calc signature parameter 
        const sig = await calcRequestModSignature(provider, req_addr, "cancel");
        const calldata = await calcCancelcalldata(req_addr, sig);
        const raw = await mkRawUserOp(provider, eoa, smartAddr, calldata);
        return raw;
        
        console.log(cancelling);
        //
    };

    const mmCancelRequest = async (provider, req_addr) => {
        const ethersProvider = new ethers.providers.Web3Provider(provider);

        const sig = await calcRequestModSignature(provider, req_addr, "cancel");
        
        const signer = ethersProvider.getSigner();
        const Reqcontract = new ethers.Contract(req_addr, ABI_Request, signer);

        let cancelling = await Reqcontract.cancel(sig, { value: 0 });
        console.log(cancelling);
        //
    };

    const mmPayERC20Request = async (provider, to, asset, amount, req_addr) => {
        const ethersProvider = new ethers.providers.Web3Provider(provider);
        const signer = ethersProvider.getSigner();
        const Paycontract = new ethers.Contract(addr_ERC20PaymentProxy, ABI_ERC20PaymentProxy, signer);

        let payment = await Paycontract.transferWithReference(asset, to, amount, req_addr, { value: 0 });
        document.getElementById("stat").innerHTML = "payment tx sent!";
        return (payment.hash);
    };

  return {
    getChainId,
    getAccounts,
    getBalance,
    signMessage,
    getPrivateKey,
    getSmartAddress,
    mkUserOp,
    createRequest,
    payRequest,
    payERC20Request,

    mkRawUserOp,
    rawCreateRequest,
    rawCancelRequest,
    rawPayRequest,
    rawERC20PayRequest,

    // for Metamask direct usage:
    mmCreateRequest,
    mmPayRequest,
    mmPayERC20Request,
    mmCancelRequest
  }
})()