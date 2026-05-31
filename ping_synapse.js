require('dotenv').config();

async function pingSynapse() {
    const url = process.env.SYNAPSE_RPC_URL;
    if (!url) {
        console.error("SYNAPSE_RPC_URL not found in .env");
        return;
    }

    console.log(`Pinging Synapse RPC: ${url.split('?')[0]}...`);
    
    try {
        // Just sending a basic JSON-RPC payload to register a request on the dashboard
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                jsonrpc: '2.0',
                id: 1,
                method: 'getHealth' // generic method guess, even if it errors it should count as a request
            })
        });

        const data = await response.text();
        console.log("Response Status:", response.status);
        console.log("Response Data:", data);
        console.log("\n✅ Request sent! Check your Synapse Dashboard.");
    } catch (err) {
        console.error("Failed to reach Synapse:", err);
    }
}

pingSynapse();
