async function main() {
    const url = 'http://localhost:3000/api/auth/login';
    const credentials = {
        email: 'bismarkgyawu@raventech.com.gh',
        password: 'password'
    };

    console.log(`Attempting login to ${url}...`);
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
        });

        console.log(`Status: ${response.status} ${response.statusText}`);
        const text = await response.text();
        console.log('Response body:', text);
    } catch (error) {
        console.error('Fetch error:', error);
    }
}

main();
