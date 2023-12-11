function(instance, context) {
    let web3auth = null;
    let provider = null;
    let openloginAdapter = null;
    const currentW3AuthNetwork = "sapphire_devnet";
    
    (async function init() {
        
        const clientId = context.keys.web3Auth_clientID;

        web3auth = new window.Modal.Web3Auth({
          clientId, 
          web3AuthNetwork: currentW3AuthNetwork, // mainnet, aqua,  cyan or testnet
          chainConfig: {
            chainNamespace: "eip155",
            chainId: chainID,
            rpcTarget: RPCuri
          },
        });
        openloginAdapter = new window.OpenloginAdapter.OpenloginAdapter({
          loginSettings: {
            mfaLevel: "default", // Pass on the mfa level of your choice: default, optional, mandatory, none
          },
          adapterSettings: { 
            loginConfig: {
              // Google login
              google: {
                name: "Google Login", // The desired name you want to show on the login button
                verifier: "TestGoogleVerifier", 
                typeOfLogin: "google", // Pass on the login provider of the verifier you've created
                clientId: context.keys.googleApp_clientID, // use your app client id you got from google
              },
            }
          },
          web3AuthNetwork: currentW3AuthNetwork
        });
        web3auth.configureAdapter(openloginAdapter);
        await web3auth.initModal();
    })();
    
    
    instance.data.do_login = async function() {
        try {
            console.log("start AA auth...     ");
    		const web3authProvider = await web3auth.connect();
            const user_address = await rpc.getAccounts(web3auth.provider);
            const smart_user_address = await rpc.getSmartAddress(web3auth.provider, user_address);
            console.log(smart_user_address);
            console.log("    ...end AA auth");
            instance.publishState("wallet_address", user_address);
            instance.publishState("smart_wallet_address", smart_user_address);
            instance.publishState("smart_wallet_shortened", smart_user_address.substr(0, 7) + ".." + smart_user_address.substr(smart_user_address.length - 5));
                        
            instance.triggerEvent("logged");
            
        } catch (error)
        {
          console.log(error.message);
        }
    }
    
    instance.data.do_logout = async function() {
        try {
    		await web3auth.logout();
            
            instance.publishState("wallet_address", "");
            instance.publishState("smart_wallet_address", "");
            instance.publishState("smart_wallet_shortened", "");
            
            instance.triggerEvent("unlogged");
        } catch (error)
        {
          console.error(error.message);
        }
    };
    
    async function checkIfCode(provider, addr)
    {
        const ethersProvider = new ethers.providers.Web3Provider(provider);
        const code = await ethersProvider.getCode(addr);
        const noCode = code == "0x";
        if (noCode)
        {
            setTimeout(checkIfCode, 1000, web3auth.provider, addr);
        }
        else
        {
            console.log("request " + addr + " deployed to chain");
            instance.triggerEvent("request_deployed");
        }
    };
    
    instance.data.do_mkRawBillUserOp = async function(requestType, ipfsHash, from, to, asset, amount) {
        try {
            const web3authProvider = await web3auth.connect();
            const user_address = await rpc.getAccounts(web3auth.provider);
            
            const op = await rpc.rawCreateRequest(web3auth.provider, user_address, requestType, ipfsHash, from, to, asset, amount);
            
            const raw = op[1];
            const reqAddr = op[0];
                        
            let response = await fetch(BUNDLERuri/*context.keys.bundler_url*/, {
            method: "POST",
                 body: raw,
                 headers: {
                  "Accept": "application/json",
                  "content-type": "application/json",
                 }
      		});
            if (response.ok) {
                let json = await response.text();
                if (json)
                {
                    console.log(json);
                    instance.publishState("requestaddrpredicted", reqAddr);
                    
                    instance.publishState("request_created_amount", amount);
                    instance.publishState("request_created_to", to);
                    instance.publishState("request_created_from", from);
                    instance.publishState("request_created_asset", asset);
                    
                    
                    
                    
                    instance.triggerEvent("requesttx_sent");
                    // start monitoring the address - it should become a contract
                    setTimeout(checkIfCode, 1000, web3auth.provider, reqAddr);
                    
                }
            } else {
                alert("HTTP error: " + response.status);
            } 
        } catch (error)
        {
          console.log(error.message);
        }
    }
    
    instance.data.do_mkRawPayTheBillUserOp = async function(to, asset, amount, req_addr) {
        try {
            const web3authProvider = await web3auth.connect();
            const user_address = await rpc.getAccounts(web3auth.provider);
            
            let raw = "";
            if (asset == "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee")
            {
            	raw = await rpc.rawPayRequest(web3auth.provider, user_address, to, amount, req_addr);
            }
            else
            {   // ERC20 token
                raw = await rpc.rawERC20PayRequest(web3auth.provider, user_address, to, asset, amount, req_addr);
            }
            
            let response = await fetch(BUNDLERuri/*context.keys.bundler_url*/, {
            method: "POST",
                 body: raw,
                 headers: {
                  "Accept": "application/json",
                  "content-type": "application/json",
                 }
      		});
            if (response.ok) {
                let json = await response.text();
                if (json)
                {
                    console.log(json);
                    
                    instance.triggerEvent("requestpayment_sent");
                }
            } else {
                alert("HTTP error: " + response.status);
            } 
        } catch (error)
        {
          console.log(error.message);
        }
    }
    
    instance.data.do_cancelTheBillUserOp = async function(req_addr) {
        try
        {
            const web3authProvider = await web3auth.connect();
            const user_address = await rpc.getAccounts(web3auth.provider);
            
            const raw = await rpc.rawCancelRequest(web3auth.provider, user_address, req_addr);
            
            let response = await fetch(BUNDLERuri/*context.keys.bundler_url*/, {
            method: "POST",
                 body: raw,
                 headers: {
                  "Accept": "application/json",
                  "content-type": "application/json",
                 }
      		});
            if (response.ok) {
                let json = await response.text();
                if (json)
                {
                    console.log(json);
                    
                    instance.triggerEvent("requestcancel_sent");
                }
            } else {
                alert("HTTP error: " + response.status);
            } 
        } catch (error)
        {
          console.log(error.message);
        }
    }
}